import { useEffect, useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import api from '../services/api';

interface Colaborador {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: string;
}

interface ColaboradorForm {
  name: string;
  email: string;
  password: string;
  role: string;
  active: boolean;
}

const EMPTY_FORM: ColaboradorForm = {
  name: '',
  email: '',
  password: '',
  role: 'COLABORADOR_APROVADOR',
  active: true,
};

const ROLE_LABELS: Record<string, string> = {
  COLABORADOR_ADMIN: 'Administrador',
  COLABORADOR_APROVADOR: 'Aprovador',
};

export default function Colaboradores() {

  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ColaboradorForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);


  async function loadColaboradores() {

    try {

      setLoading(true);

      const response = await api.get('/users');

      setColaboradores(response.data);

    } catch (error) {

      console.error('Erro ao carregar colaboradores', error);

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    loadColaboradores();

  }, []);


  const filteredColaboradores = colaboradores.filter(c => {

    const term = searchTerm.toLowerCase();

    return (
      c.name.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term)
    );

  });


  function openCreateModal() {

    setEditingId(null);

    setForm(EMPTY_FORM);

    setError('');

    setShowModal(true);

  }


  function openEditModal(colaborador: Colaborador) {

    setEditingId(colaborador.id);

    setForm({
      name: colaborador.name,
      email: colaborador.email,
      password: '',
      role: colaborador.role,
      active: colaborador.active,
    });

    setError('');

    setShowModal(true);

  }


  async function handleSubmit(event: React.FormEvent) {

    event.preventDefault();

    setError('');

    setSaving(true);

    try {

      if (editingId) {

        // No update, senha só é enviada se o admin preencher
        // um valor novo (evita sobrescrever com string vazia).
        const payload: any = {
          name: form.name,
          email: form.email,
          role: form.role,
          active: form.active,
        };

        if (form.password) {
          payload.password = form.password;
        }

        await api.patch(`/users/${editingId}`, payload);

      } else {

        await api.post('/users', {
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
          active: form.active,
        });

      }

      setShowModal(false);

      loadColaboradores();

    } catch (error: any) {

      setError(
        error.response?.data?.message ?? 'Erro ao salvar colaborador.',
      );

    } finally {

      setSaving(false);

    }

  }


  async function deleteColaborador(id: number) {

    const confirmed = window.confirm(
      'Tem certeza que deseja remover este colaborador? Essa ação não pode ser desfeita.',
    );

    if (!confirmed) return;

    try {

      await api.delete(`/users/${id}`);

      loadColaboradores();

    } catch (error: any) {

      alert(
        error.response?.data?.message ??
          'Erro ao remover colaborador.',
      );

    }

  }


  if (loading) {

    return <div className="p-8">Carregando colaboradores...</div>;

  }

  return (

    <div className="p-8">

      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">

        <div>

          <h1 className="text-2xl font-semibold">Colaboradores</h1>

          <p className="text-muted-foreground mt-1">
            Gerencie os acessos de administradores e aprovadores
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
          Novo Colaborador
        </button>

      </div>


      {/* RESUMO */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">

        <div className="bg-card border border-border rounded-lg p-6">

          <div className="bg-blue-500 rounded-lg p-3 w-fit mb-4">
            <Users className="h-6 w-6 text-white" />
          </div>

          <p className="text-muted-foreground mb-1">Total de colaboradores</p>
          <p className="text-[2rem] leading-none mb-2">
            {colaboradores.length}
          </p>

        </div>

        <div className="bg-card border border-border rounded-lg p-6">

          <div className="bg-purple-500 rounded-lg p-3 w-fit mb-4">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>

          <p className="text-muted-foreground mb-1">Administradores</p>
          <p className="text-[2rem] leading-none mb-2">
            {colaboradores.filter(c => c.role === 'COLABORADOR_ADMIN').length}
          </p>

        </div>

        <div className="bg-card border border-border rounded-lg p-6">

          <div className="bg-green-500 rounded-lg p-3 w-fit mb-4">
            <UserCheck className="h-6 w-6 text-white" />
          </div>

          <p className="text-muted-foreground mb-1">Aprovadores</p>
          <p className="text-[2rem] leading-none mb-2">
            {
              colaboradores.filter(
                c => c.role === 'COLABORADOR_APROVADOR',
              ).length
            }
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
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
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

        {filteredColaboradores.map(colaborador => (

          <div
            key={colaborador.id}
            className="bg-card border border-border rounded-lg p-6"
          >

            <div className="flex items-start justify-between gap-4 flex-wrap">

              <div className="flex-1 min-w-[240px]">

                <div className="flex items-center gap-3 mb-1 flex-wrap">

                  <h3 className="text-lg font-medium">{colaborador.name}</h3>

                  <span
                    className={`
                      px-3
                      py-1
                      rounded-full
                      text-sm
                      ${
                        colaborador.role === 'COLABORADOR_ADMIN'
                          ? 'text-purple-600 bg-purple-100'
                          : 'text-green-600 bg-green-100'
                      }
                    `}
                  >
                    {ROLE_LABELS[colaborador.role] ?? colaborador.role}
                  </span>

                  <span
                    className={`
                      px-3
                      py-1
                      rounded-full
                      text-sm
                      ${
                        colaborador.active
                          ? 'text-green-600 bg-green-100'
                          : 'text-gray-600 bg-gray-100'
                      }
                    `}
                  >
                    {colaborador.active ? 'Ativo' : 'Inativo'}
                  </span>

                </div>

                <p className="text-muted-foreground text-sm">
                  {colaborador.email}
                </p>

              </div>

              <div className="flex items-center gap-2">

                <button
                  onClick={() => openEditModal(colaborador)}
                  className="p-2 rounded-lg hover:bg-muted"
                  title="Editar colaborador"
                >
                  <Edit className="h-5 w-5" />
                </button>

                <button
                  onClick={() => deleteColaborador(colaborador.id)}
                  className="p-2 rounded-lg hover:bg-red-100 text-red-600"
                  title="Remover colaborador"
                >
                  <Trash2 className="h-5 w-5" />
                </button>

              </div>

            </div>

          </div>

        ))}

        {filteredColaboradores.length === 0 && (

          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <p className="text-muted-foreground">
              Nenhum colaborador encontrado
            </p>
          </div>

        )}

      </div>


      {/* MODAL CRIAR/EDITAR */}

      {showModal && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div className="bg-card rounded-lg border p-6 w-full max-w-lg">

            <div className="flex justify-between items-center mb-6">

              <h2>{editingId ? 'Editar Colaborador' : 'Novo Colaborador'}</h2>

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
                <label className="text-sm">Nome</label>
                <input
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm">
                  Senha
                  {editingId && (
                    <span className="text-muted-foreground">
                      {' '}(deixe em branco para manter a atual)
                    </span>
                  )}
                </label>
                <input
                  type="password"
                  required={!editingId}
                  value={form.password}
                  onChange={e =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                  minLength={6}
                />
              </div>

              <div>
                <label className="text-sm">Perfil</label>
                <select
                  value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="COLABORADOR_APROVADOR">Aprovador</option>
                  <option value="COLABORADOR_ADMIN">Administrador</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={form.active}
                  onChange={e =>
                    setForm({ ...form, active: e.target.checked })
                  }
                  className="w-5 h-5"
                />
                <label htmlFor="active" className="text-sm">
                  Colaborador ativo
                </label>
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
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  );

}
