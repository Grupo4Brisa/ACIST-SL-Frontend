import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, Megaphone, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';

interface Announcement {
  id: number;
  title: string;
  content: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AnnouncementForm {
  title: string;
  content: string;
  active: boolean;
}

const EMPTY_FORM: AnnouncementForm = { title: '', content: '', active: true };

export default function Comunicados() {

  const [items, setItems]       = useState<Announcement[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm]         = useState<AnnouncementForm>(EMPTY_FORM);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');
  const [sendResult, setSendResult] = useState<{ sent: number; errors: number } | null>(null);

  async function load() {
    try {
      const res = await api.get('/announcements/admin/all');
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch { /* silencioso */ }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError('');
    setShowModal(true);
  }

  function openEdit(a: Announcement) {
    setEditingId(a.id);
    setForm({ title: a.title, content: a.content, active: a.active });
    setError('');
    setShowModal(true);
  }


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError('Preencha título e conteúdo.');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await api.patch(`/announcements/${editingId}`, form);
      } else {
        await api.post('/announcements', { title: form.title, content: form.content });
      }
      setShowModal(false);
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar comunicado.');
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(a: Announcement) {
    try {
      await api.patch(`/announcements/${a.id}`, { active: !a.active });
      setItems(prev => prev.map(i => i.id === a.id ? { ...i, active: !a.active } : i));
    } catch { /* silencioso */ }
  }

  async function handleDelete(id: number) {
    if (!confirm('Deseja excluir este comunicado?')) return;
    try {
      await api.delete(`/announcements/${id}`);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch { /* silencioso */ }
  }

  function formatDate(d: string) {
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(d));
  }

  if (loading) return <div className="p-8">Carregando comunicados...</div>;

  return (
    <div className="p-8">

      {/* HEADER */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1>Comunicados</h1>
          <p className="text-muted-foreground mt-1">Gerencie os comunicados publicados para os associados</p>
        </div>
        <button onClick={openCreate}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Comunicado
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-card border rounded-lg p-6 flex items-center gap-4">
          <div className="bg-blue-500 rounded-lg p-3"><Megaphone className="h-5 w-5 text-white" /></div>
          <div>
            <p className="text-muted-foreground text-sm">Total</p>
            <p className="text-2xl font-bold">{items.length}</p>
          </div>
        </div>
        <div className="bg-card border rounded-lg p-6 flex items-center gap-4">
          <div className="bg-green-500 rounded-lg p-3"><Eye className="h-5 w-5 text-white" /></div>
          <div>
            <p className="text-muted-foreground text-sm">Ativos</p>
            <p className="text-2xl font-bold">{items.filter(i => i.active).length}</p>
          </div>
        </div>
      </div>

      {/* LISTA */}
      {items.length === 0 ? (
        <div className="bg-card border rounded-lg p-12 text-center">
          <Megaphone className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Nenhum comunicado cadastrado</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map(a => (
            <div key={a.id} className={`bg-card border rounded-lg p-5 ${!a.active ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{a.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${a.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {a.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{a.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">Criado em {formatDate(a.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => toggleActive(a)}
                    className="p-2 rounded-lg hover:bg-muted"
                    title={a.active ? 'Desativar' : 'Ativar'}>
                    {a.active ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-green-600" />}
                  </button>
                  <button onClick={() => openEdit(a)}
                    className="p-2 rounded-lg hover:bg-muted"
                    title="Editar">
                    <Edit className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button onClick={() => handleDelete(a.id)}
                    className="p-2 rounded-lg hover:bg-red-100"
                    title="Excluir">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RESULTADO ENVIO */}
      {sendResult && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 z-50">
          <Send className="h-4 w-4" />
          <span className="text-sm">Enviado para <strong>{sendResult.sent}</strong> empresa(s){sendResult.errors > 0 ? `, ${sendResult.errors} erro(s)` : ''}.</span>
          <button onClick={() => setSendResult(null)} className="ml-2 text-white/80 hover:text-white">✕</button>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border shadow-xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h2>{editingId ? 'Editar Comunicado' : 'Novo Comunicado'}</h2>
              <button onClick={() => setShowModal(false)}><X className="h-5 w-5" /></button>
            </div>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Título * <span className="text-muted-foreground font-normal text-xs">(máx. 150 caracteres)</span></label>
                <input
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  maxLength={150}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="Digite o título do comunicado"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Conteúdo *</label>
                <textarea
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  rows={5}
                  className="w-full border rounded-lg px-3 py-2 text-sm resize-none"
                  placeholder="Digite o conteúdo do comunicado..."
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={e => setForm({ ...form, active: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm">Publicar imediatamente</span>
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg text-sm">Cancelar</button>
                <button type="submit" disabled={saving}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm disabled:opacity-50">
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
