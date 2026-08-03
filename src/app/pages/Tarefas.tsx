import { useEffect, useState } from "react";
import {
  CheckSquare,
  Calendar,
  User,
  Plus,
  Filter,
  X,
  Building2,
} from "lucide-react";
import { Link as RouterLink } from "react-router";
import api from "../services/api";

interface Task {
  id: number;
  companyId?: number;
  title: string;
  description: string;
  assignedTo: number;
  dueDate: string;
  status: string;
  createdAt: string;
}

interface ColabUser {
  id: number;
  name: string;
  role: string;
}

interface TaskForm {
  title: string;
  description: string;
  dueDate: string;
  assignedRole: string; // 'COLABORADOR_ADMIN' | 'COLABORADOR_APROVADOR' | ''
  assignedId: string; // ID específico ou ''
}

const EMPTY_FORM: TaskForm = {
  title: "",
  description: "",
  dueDate: "",
  assignedRole: "",
  assignedId: "",
};

function getLoggedUserId(): number | null {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
    return payload.sub ?? null;
  } catch {
    return null;
  }
}

function getLoggedUserInfo(): { id: number | null; role: string } {
  const token = localStorage.getItem("token");
  if (!token) return { id: null, role: "" };
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
    return { id: payload.sub ?? null, role: payload.role ?? "" };
  } catch {
    return { id: null, role: "" };
  }
}

export default function Tarefas() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [companies, setCompanies] = useState<Record<number, string>>({});
  const [users, setUsers] = useState<ColabUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<TaskForm>(EMPTY_FORM);

  // filtros
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRole, setFilterRole] = useState("");
  const [filterUserId, setFilterUserId] = useState("");

  const usersMap = Object.fromEntries(users.map((u) => [u.id, u.name]));
  const usersRoleMap = Object.fromEntries(users.map((u) => [u.id, u.role]));

  async function loadTasks() {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
    api
      .get("/companies")
      .then((res) => {
        const map: Record<number, string> = {};
        res.data.forEach((c: any) => {
          map[c.id] = c.companyName;
        });
        setCompanies(map);
      })
      .catch(() => {});
    api
      .get("/users")
      .then((res) => setUsers(Array.isArray(res.data) ? res.data : []))
      .catch(() => {});
  }, []);

  function formatDate(date: string) {
    if (!date) return "-";
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  }

  function isOverdue(date: string) {
    return !!date && new Date(date).getTime() < Date.now();
  }

  async function handleCreateTask(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    let assignedTo: number | null = null;

    if (form.assignedId) {
      // ID específico tem prioridade
      assignedTo = Number(form.assignedId);
    } else if (form.assignedRole) {
      // sorteio dentro do perfil
      const group = users.filter((u) => u.role === form.assignedRole);
      if (group.length === 0) {
        setError("Nenhum colaborador encontrado para o perfil selecionado.");
        return;
      }
      assignedTo = group[Math.floor(Math.random() * group.length)].id;
    } else {
      assignedTo = getLoggedUserId();
    }

    if (!assignedTo) {
      setError("Selecione um responsável.");
      return;
    }

    try {
      await api.post("/tasks", {
        title: form.title,
        description: form.description,
        assignedTo,
        dueDate: new Date(form.dueDate).toISOString(),
      });
      setShowModal(false);
      setForm(EMPTY_FORM);
      loadTasks();
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao criar tarefa");
    }
  }

  async function updateTaskStatus(id: number, status: string) {
    try {
      await api.patch(`/tasks/${id}`, { status });
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    } catch (e: any) {
      console.error(e.response?.data || e);
    }
  }

  // filtro composto
  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === "PENDING" && task.status !== "PENDING") return false;
    if (filterStatus === "COMPLETED" && task.status !== "COMPLETED")
      return false;
    if (
      filterStatus === "OVERDUE" &&
      !(task.status === "PENDING" && isOverdue(task.dueDate))
    )
      return false;
    if (filterRole && usersRoleMap[task.assignedTo] !== filterRole)
      return false;
    if (filterUserId && String(task.assignedTo) !== filterUserId) return false;
    return true;
  });

  const pendingTasks = tasks.filter((t) => t.status === "PENDING").length;
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;
  const overdueTasks = tasks.filter(
    (t) => t.status === "PENDING" && isOverdue(t.dueDate),
  ).length;

  // usuários filtrados pelo perfil selecionado no form (para o select de ID específico)
  const usersForIdSelect = form.assignedRole
    ? users.filter((u) => u.role === form.assignedRole)
    : users;

  if (loading) return <div className="p-8">Carregando tarefas...</div>;

  return (
    <div className="p-8">
      {/* HEADER */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1>Tarefas</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie tarefas e atividades dos colaboradores
          </p>
        </div>
        <button
          onClick={() => {
            const { id, role } = getLoggedUserInfo();
            setForm({
              ...EMPTY_FORM,
              assignedRole: role,
              assignedId: id ? String(id) : "",
            });
            setShowModal(true);
          }}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nova Tarefa
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {[
          {
            label: "Pendentes",
            value: pendingTasks,
            color: "bg-blue-500",
            icon: CheckSquare,
            filter: "PENDING",
          },
          {
            label: "Atrasadas",
            value: overdueTasks,
            color: "bg-red-500",
            icon: Calendar,
            filter: "OVERDUE",
          },
          {
            label: "Concluídas",
            value: completedTasks,
            color: "bg-green-500",
            icon: CheckSquare,
            filter: "COMPLETED",
          },
        ].map(({ label, value, color, icon: Icon, filter }) => (
          <div
            key={label}
            onClick={() =>
              setFilterStatus((prev) => (prev === filter ? "all" : filter))
            }
            className={`bg-card border rounded-lg p-6 cursor-pointer transition-all hover:shadow-md ${filterStatus === filter ? "ring-2 ring-primary" : ""}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`${color} rounded-lg p-3`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
            </div>
            <p className="text-muted-foreground">{label}</p>
            <p className="text-[2rem]">{value}</p>
          </div>
        ))}
      </div>

      {/* FILTROS */}
      <div className="bg-card border rounded-lg p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <Filter className="h-5 w-5 text-muted-foreground" />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="all">Todos os Status</option>
            <option value="PENDING">Pendentes</option>
            <option value="COMPLETED">Concluídas</option>
            <option value="OVERDUE">Atrasadas</option>
          </select>

          <select
            value={filterRole}
            onChange={(e) => {
              setFilterRole(e.target.value);
              setFilterUserId("");
            }}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">Todos os Perfis</option>
            <option value="COLABORADOR_ADMIN">Administrador</option>
            <option value="COLABORADOR_APROVADOR">Aprovador</option>
          </select>

          <select
            value={filterUserId}
            onChange={(e) => setFilterUserId(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">Todos os Colaboradores</option>
            {(filterRole
              ? users.filter((u) => u.role === filterRole)
              : users
            ).map((u) => (
              <option key={u.id} value={String(u.id)}>
                {u.name} (
                {u.role === "COLABORADOR_ADMIN" ? "Admin" : "Aprovador"})
              </option>
            ))}
          </select>

          {(filterStatus !== "all" || filterRole || filterUserId) && (
            <button
              onClick={() => {
                setFilterStatus("all");
                setFilterRole("");
                setFilterUserId("");
              }}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" /> Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* LISTA */}
      <div className="space-y-4">
        {filteredTasks.map((task) => {
          const overdue = task.status === "PENDING" && isOverdue(task.dueDate);
          const companyName = task.companyId ? companies[task.companyId] : null;
          const role = usersRoleMap[task.assignedTo];
          const roleLabel =
            role === "COLABORADOR_ADMIN"
              ? "Admin"
              : role === "COLABORADOR_APROVADOR"
                ? "Aprovador"
                : "";

          return (
            <div
              key={task.id}
              className={`bg-card border rounded-lg p-6 ${overdue ? "border-red-300" : "border-border"}`}
            >
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={task.status === "COMPLETED"}
                  onChange={(e) =>
                    updateTaskStatus(
                      task.id,
                      e.target.checked ? "COMPLETED" : "PENDING",
                    )
                  }
                  className="mt-1 w-5 h-5 cursor-pointer"
                />
                <div className="flex-1">
                  <h3
                    className={
                      task.status === "COMPLETED"
                        ? "line-through text-muted-foreground"
                        : ""
                    }
                  >
                    {task.title}
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    {task.description}
                  </p>

                  {companyName && (
                    <RouterLink
                      to={`/admin/company/${task.companyId}`}
                      className="inline-flex items-center gap-1.5 mt-2 text-sm text-primary hover:underline"
                    >
                      <Building2 className="h-3.5 w-3.5" />
                      {companyName}
                    </RouterLink>
                  )}

                  <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {usersMap[task.assignedTo] ?? `ID ${task.assignedTo}`}
                      {roleLabel && (
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                          {roleLabel}
                        </span>
                      )}
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(task.dueDate)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="bg-card border rounded-lg p-12 text-center">
            <p className="text-muted-foreground">Nenhuma tarefa encontrada</p>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg border p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2>Nova Tarefa</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setForm(EMPTY_FORM);
                }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Título *</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Descrição *</label>
                <textarea
                  required
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Data limite *</label>
                <input
                  type="datetime-local"
                  required
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm({ ...form, dueDate: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Perfil do responsável{" "}
                  <span className="text-muted-foreground font-normal">
                    (opcional)
                  </span>
                </label>
                <select
                  value={form.assignedRole}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      assignedRole: e.target.value,
                      assignedId: "",
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                >
                  <option value="">Qualquer perfil</option>
                  <option value="COLABORADOR_ADMIN">Administrador</option>
                  <option value="COLABORADOR_APROVADOR">Aprovador</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Colaborador específico{" "}
                  <span className="text-muted-foreground font-normal">
                    (opcional)
                  </span>
                </label>
                <select
                  value={form.assignedId}
                  onChange={(e) =>
                    setForm({ ...form, assignedId: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                >
                  <option value="">Não especificar</option>
                  {usersForIdSelect.map((u) => (
                    <option key={u.id} value={String(u.id)}>
                      {u.name} (
                      {u.role === "COLABORADOR_ADMIN" ? "Admin" : "Aprovador"})
                    </option>
                  ))}
                </select>
                {!form.assignedRole && !form.assignedId && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Se nenhum for selecionado, a tarefa será atribuída a você.
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setForm(EMPTY_FORM);
                  }}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
