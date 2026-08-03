import { useEffect, useState } from "react";
import {
  Calendar,
  MapPin,
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Eye,
  Target,
} from "lucide-react";
import api from "../services/api";

interface EventItem {
  id: number;
  title: string;
  description?: string;
  eventDate: string;
  location: string;
  vacancies?: number;
  status: string;
  createdAt: string;
}

interface EventForm {
  title: string;
  description: string;
  eventDate: string;
  location: string;
  vacancies: string;
}

const EMPTY_FORM: EventForm = {
  title: "",
  description: "",
  eventDate: "",
  location: "",
  vacancies: "",
};

export default function Eventos() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<EventForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [viewedEvent, setViewedEvent] = useState<EventItem | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  // =========================
  // LISTAR TODOS
  // =========================

  async function loadEvents() {
    try {
      setLoading(true);

      const response = await api.get("/events");

      setEvents(response.data);
    } catch (error) {
      console.error("Erro ao carregar eventos", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  // =========================
  // BUSCAR UM SÓ (detalhe)
  // =========================

  async function viewEvent(id: number) {
    try {
      setViewLoading(true);

      const response = await api.get(`/events/${id}`);

      setViewedEvent(response.data);
    } catch (error) {
      console.error("Erro ao buscar evento", error);
    } finally {
      setViewLoading(false);
    }
  }

  // =========================
  // FILTRO LOCAL (título/local)
  // =========================

  const filteredEvents = events.filter((event) => {
    const term = searchTerm.toLowerCase();

    return (
      event.title.toLowerCase().includes(term) ||
      (event.location ?? "").toLowerCase().includes(term)
    );
  });

  // =========================
  // HELPERS
  // =========================

  function formatDate(date: string) {
    if (!date) return "-";

    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  }

  function toDateTimeLocal(date: string) {
    // 'YYYY-MM-DDTHH:mm' exigido pelo input datetime-local
    const d = new Date(date);

    const pad = (n: number) => String(n).padStart(2, "0");

    return (
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
      `T${pad(d.getHours())}:${pad(d.getMinutes())}`
    );
  }

  function getStatusColor(status: string) {
    const colors: Record<string, string> = {
      OPEN: "text-green-600 bg-green-100",
      CLOSED: "text-gray-600 bg-gray-100",
      CANCELLED: "text-red-600 bg-red-100",
    };

    return colors[status] ?? "text-gray-600 bg-gray-100";
  }

  // =========================
  // MODAL: CRIAR
  // =========================

  function openCreateModal() {
    setEditingId(null);

    setForm(EMPTY_FORM);

    setError("");

    setShowModal(true);
  }

  // =========================
  // MODAL: EDITAR
  // =========================

  function openEditModal(event: EventItem) {
    setEditingId(event.id);

    setForm({
      title: event.title,
      description: event.description ?? "",
      eventDate: event.eventDate ? toDateTimeLocal(event.eventDate) : "",
      location: event.location ?? "",
      vacancies: event.vacancies?.toString() ?? "",
    });

    setError("");

    setShowModal(true);
  }

  // =========================
  // CRIAR / ATUALIZAR
  // =========================

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setError("");

    setSaving(true);

    try {
      const payload = {
        title: form.title,
        description: form.description || undefined,
        eventDate: new Date(form.eventDate).toISOString(),
        location: form.location,
        vacancies: Number(form.vacancies),
      };

      if (editingId) {
        await api.patch(`/events/${editingId}`, payload);
      } else {
        await api.post("/events", payload);
      }

      setShowModal(false);

      loadEvents();
    } catch (error: any) {
      setError(error.response?.data?.message ?? "Erro ao salvar evento.");
    } finally {
      setSaving(false);
    }
  }

  // =========================
  // DELETAR
  // =========================

  async function deleteEvent(id: number) {
    const confirmed = window.confirm(
      "Tem certeza que deseja remover este evento? Essa ação não pode ser desfeita.",
    );

    if (!confirmed) return;

    try {
      await api.delete(`/events/${id}`);

      loadEvents();
    } catch (error) {
      console.error("Erro ao remover evento", error);
    }
  }

  // =========================
  // RENDER
  // =========================

  if (loading) {
    return <div className="p-8">Carregando eventos...</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Eventos</h1>

          <p className="text-muted-foreground mt-1">
            Gerencie os eventos disponíveis para os associados
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="
            px-4
            py-2
            bg-primary
            text-primary-foreground
            rounded-lg
            flex
            items-center
            gap-2
          "
        >
          <Plus className="h-4 w-4" />
          Novo Evento
        </button>
      </div>

      {/* RESUMO */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="bg-blue-500 rounded-lg p-3 w-fit mb-4">
            <Target className="h-6 w-6 text-white" />
          </div>

          <p className="text-muted-foreground mb-1">Total de eventos</p>
          <p className="text-[2rem] leading-none mb-2">{events.length}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="bg-green-500 rounded-lg p-3 w-fit mb-4">
            <Calendar className="h-6 w-6 text-white" />
          </div>

          <p className="text-muted-foreground mb-1">Abertos</p>
          <p className="text-[2rem] leading-none mb-2">
            {events.filter((e) => e.status === "OPEN").length}
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="bg-gray-500 rounded-lg p-3 w-fit mb-4">
            <Users className="h-6 w-6 text-white" />
          </div>

          <p className="text-muted-foreground mb-1">Vagas totais</p>
          <p className="text-[2rem] leading-none mb-2">
            {events.reduce((sum, e) => sum + (e.vacancies ?? 0), 0)}
          </p>
        </div>
      </div>

      {/* BUSCA */}

      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <div className="relative">
          <Search
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              h-5
              w-5
              text-muted-foreground
            "
          />

          <input
            type="text"
            placeholder="Buscar por título ou local..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="
              w-full
              pl-10
              pr-4
              py-3
              rounded-lg
              border
              border-border
              bg-input-background
            "
          />
        </div>
      </div>

      {/* LISTA */}

      <div className="space-y-4">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-card border border-border rounded-lg p-6"
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-[240px]">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-medium">{event.title}</h3>

                  <span
                    className={`
                      px-3
                      py-1
                      rounded-full
                      text-sm
                      ${getStatusColor(event.status)}
                    `}
                  >
                    {event.status}
                  </span>
                </div>

                {event.description && (
                  <p className="text-muted-foreground text-sm mb-3">
                    {event.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(event.eventDate)}
                  </span>

                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </span>

                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {event.vacancies ?? 0} vagas
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => viewEvent(event.id)}
                  className="p-2 rounded-lg hover:bg-muted"
                  title="Ver detalhes"
                >
                  <Eye className="h-5 w-5" />
                </button>

                <button
                  onClick={() => openEditModal(event)}
                  className="p-2 rounded-lg hover:bg-muted"
                  title="Editar evento"
                >
                  <Edit className="h-5 w-5" />
                </button>

                <button
                  onClick={() => deleteEvent(event.id)}
                  className="p-2 rounded-lg hover:bg-red-100 text-red-600"
                  title="Remover evento"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredEvents.length === 0 && (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <p className="text-muted-foreground">Nenhum evento encontrado</p>
          </div>
        )}
      </div>

      {/* MODAL CRIAR/EDITAR */}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h2>{editingId ? "Editar Evento" : "Novo Evento"}</h2>

              <button onClick={() => setShowModal(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm">Título</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm">Descrição</label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm">Data e hora</label>
                <input
                  type="datetime-local"
                  required
                  value={form.eventDate}
                  onChange={(e) =>
                    setForm({ ...form, eventDate: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm">Local</label>
                <input
                  required
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm">Vagas</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={form.vacancies}
                  onChange={(e) =>
                    setForm({ ...form, vacancies: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="
                    px-4
                    py-2
                    bg-primary
                    text-primary-foreground
                    rounded-lg
                    disabled:opacity-50
                  "
                >
                  {saving ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL VER DETALHES */}

      {(viewedEvent || viewLoading) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h2>Detalhes do Evento</h2>

              <button onClick={() => setViewedEvent(null)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            {viewLoading ? (
              <p className="text-muted-foreground">Carregando...</p>
            ) : (
              viewedEvent && (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Título</p>
                    <p className="font-medium">{viewedEvent.title}</p>
                  </div>

                  {viewedEvent.description && (
                    <div>
                      <p className="text-sm text-muted-foreground">Descrição</p>
                      <p>{viewedEvent.description}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-muted-foreground">Data</p>
                    <p>{formatDate(viewedEvent.eventDate)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Local</p>
                    <p>{viewedEvent.location}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Vagas</p>
                    <p>{viewedEvent.vacancies ?? 0}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <span
                      className={`
                      inline-block
                      px-3
                      py-1
                      rounded-full
                      text-sm
                      ${getStatusColor(viewedEvent.status)}
                    `}
                    >
                      {viewedEvent.status}
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
