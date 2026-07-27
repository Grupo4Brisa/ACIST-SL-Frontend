import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Mail, Phone, User, Plus, Trash2, Save, ArrowRight, LogOut } from 'lucide-react';
import api from '../services/api';
import Header from '../components/Header/Header';
import ProgressoCadastro from '../components/ProgressoCadastro';
import Footer from '../components/Footer/Footer';

interface Contact {
  id?: number;
  name: string;
  role: string;
  position: string;
  email: string;
  phone: string;
}

const contactTypes = ['Sócio', 'Financeiro', 'Comercial', 'RH', 'Outro'];

const inputStyle = `
  w-full px-4 py-3 rounded-lg border border-gray-300 bg-white
  text-gray-800 placeholder:text-gray-400 outline-none transition
  focus:ring-2 focus:ring-[#0C3A59] focus:border-[#0C3A59]
`;

const labelStyle = `block mb-2 text-sm font-medium text-gray-700`;

export default function CadastroContatos() {

  const navigate = useNavigate();
  const { id } = useParams();

  const [contacts, setContacts] = useState<Contact[]>([
    { name: '', role: 'Sócio', position: '', email: '', phone: '' }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/company-contacts/company/${id}`)
      .then(res => {
        if (res.data?.length > 0) {
          setContacts(res.data.map((c: any) => ({
            id: c.id,
            name: c.name || '',
            role: c.role || 'Sócio',
            position: c.position || '',
            email: c.email || '',
            phone: c.phone || '',
          })));
        }
      })
      .catch(() => {});
  }, [id]);

  function updateContact(index: number, field: keyof Contact, value: string) {
    const updated = [...contacts];
    updated[index] = { ...updated[index], [field]: value };
    setContacts(updated);
  }

  function addContact() {
    setContacts([...contacts, { name: '', role: 'Outro', position: '', email: '', phone: '' }]);
  }

  function removeContact(index: number) {
    if (contacts.length <= 1) return;
    setContacts(contacts.filter((_, i) => i !== index));
  }

  async function saveDraft(): Promise<boolean> {
  try {
    setLoading(true);
    setError('');

    const validContacts = contacts.filter(c => c.name.trim());
    if (validContacts.length === 0) {
      setError('Preencha ao menos o nome de um contato para salvar.');
      return false;
    }

    // busca contatos existentes e deleta antes de recriar
    const existing = await api.get(`/company-contacts/company/${id}`);
    const existingNames = (existing.data || []).map((c: any) => c.name.trim()).sort().join(',');
    const newNames = validContacts.map(c => c.name.trim()).sort().join(',');
    const contatosAlteraram = existingNames !== newNames ||
      (existing.data || []).some((e: any, i: number) => {
        const n = validContacts[i];
        return n && (e.email !== n.email || e.phone !== n.phone || e.role !== n.role);
      });

    for (const c of existing.data || []) {
      await api.delete(`/company-contacts/${c.id}`).catch(() => {});
    }

    await api.post(`/company-contacts/bulk`,
      validContacts.map(c => ({
        companyId: Number(id),
        name: c.name,
        role: c.role,
        email: c.email,
        phone: c.phone,
        changed: contatosAlteraram,
      }))
    );

    alert('Rascunho salvo com sucesso!');
    return true;
  } catch (err: any) {
    setError(err.response?.data?.message || 'Erro ao salvar contatos');
    alert('Erro ao salvar rascunho.');
    return false;
  } finally {
    setLoading(false);
  }
}

  async function handleNext() {
    const ok = await saveDraft();
    if (!ok) return;
    navigate(`/cadastro/${id}/divulgacao`);
  }

  return (
    <div className="min-h-screen bg-[#0C3A59] flex flex-col">

      <Header />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-12 w-full">
          <div className="bg-white rounded-2xl shadow-xl p-10">

            {/* CABEÇALHO DA ETAPA */}
            <div className="flex justify-between items-start mb-10 gap-4 flex-wrap">

              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Cadastro de Associado
                </h1>
                <p className="text-sm text-gray-500 mt-1">Etapa 2 de 8 - Contatos</p>
              </div>
              <div className="flex gap-3">

                <button
                  type="button"
                  onClick={saveDraft}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg border border-gray-300 flex items-center gap-2 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                  <Save size={16} />
                  Salvar Rascunho
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-4 py-2 rounded-lg border border-gray-300 flex items-center gap-2 text-gray-700 hover:bg-gray-100"
                >
                  <LogOut size={16} />
                  Voltar
                </button>
              </div>

            </div>

            <ProgressoCadastro etapaAtual={2} />

            {/* TÍTULO DA SEÇÃO */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Contatos</h2>
            <p className="text-gray-500 mb-8">Informe os principais contatos responsáveis.</p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* LISTA DE CONTATOS */}
            <div className="space-y-6">
              {contacts.map((contact, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-6">

                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#0C3A59]/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-[#0C3A59]" />
                      </div>
                      <h3 className="font-semibold text-gray-800">Contato {index + 1}</h3>
                    </div>
                    {contacts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeContact(index)}
                        className="text-red-600 hover:text-red-800 flex items-center gap-2 text-sm"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remover
                      </button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">

                    <div>
                      <label className={labelStyle}>Tipo de Contato</label>
                      <select
                        value={contact.role}
                        onChange={(e) => updateContact(index, 'role', e.target.value)}
                        className={inputStyle}
                      >
                        {contactTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={labelStyle}>Nome Completo</label>
                      <input
                        type="text"
                        value={contact.name}
                        onChange={(e) => updateContact(index, 'name', e.target.value)}
                        placeholder="Nome do contato"
                        className={inputStyle}
                      />
                    </div>

                    <div>
                      <label className={labelStyle}>Cargo</label>
                      <input
                        type="text"
                        value={contact.position}
                        onChange={(e) => updateContact(index, 'position', e.target.value)}
                        placeholder="Ex: Diretor, Gerente..."
                        className={inputStyle}
                      />
                    </div>

                    <div>
                      <label className={labelStyle}>E-mail</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="email"
                          value={contact.email}
                          onChange={(e) => updateContact(index, 'email', e.target.value)}
                          placeholder="email@empresa.com"
                          className={inputStyle.replace('px-4', 'pl-10 pr-4')}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelStyle}>Telefone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="tel"
                          value={contact.phone}
                          onChange={(e) => updateContact(index, 'phone', e.target.value)}
                          placeholder="(51) 99999-9999"
                          className={inputStyle.replace('px-4', 'pl-10 pr-4')}
                        />
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* BOTÃO ADICIONAR CONTATO */}
            <button
              type="button"
              onClick={addContact}
              className="mt-6 px-5 py-3 border border-gray-300 rounded-lg flex items-center gap-2 text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Adicionar Contato
            </button>

            {/* BOTÕES DE NAVEGAÇÃO */}
            <div className="flex justify-between mt-10 pt-8 border-t">
              <button
                type="button"
                onClick={() => navigate(`/cadastro/${id}`)}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Voltar
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={loading}
                className="px-6 py-3 bg-[#0C3A59] text-white rounded-lg flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
              >
                Próxima Etapa
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
