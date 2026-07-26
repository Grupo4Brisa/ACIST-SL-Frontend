import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Search, Building2, Mail, Phone, Filter } from 'lucide-react';
import api from '../services/api';
import type { Company } from '../types/company';

const STATUS_OPTIONS = [
  { value: '', label: 'Todos os Status' },
  { value: 'INCOMPLETE', label: 'Cadastro Incompleto' },
  { value: 'PENDING_APPROVAL', label: 'Aguardando Aprovação' },
  { value: 'ACTIVE', label: 'Aprovada' },
  { value: 'INACTIVE', label: 'Reprovada' },
];

const PORTE_OPTIONS = [
  { value: '', label: 'Todos os Portes' },
  { value: 'MEI', label: 'MEI' },
  { value: 'Microempresa', label: 'Microempresa' },
  { value: 'Pequena', label: 'Pequena' },
  { value: 'Média', label: 'Média' },
  { value: 'Grande', label: 'Grande' },
];

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  PENDING_APPROVAL: 'bg-yellow-100 text-yellow-700',
  INCOMPLETE: 'bg-orange-100 text-orange-700',
  INACTIVE: 'bg-red-100 text-red-700',
};

const STATUS_CADASTRO: Record<string, { label: string; color: string }> = {
  INCOMPLETE: { label: 'Cadastro Incompleto', color: 'bg-yellow-100 text-yellow-700' },
  PENDING_APPROVAL: { label: 'Cadastro Completo', color: 'bg-blue-100 text-blue-700' },
  ACTIVE: { label: 'Cadastro Completo', color: 'bg-blue-100 text-blue-700' },
  INACTIVE: { label: 'Cadastro Completo', color: 'bg-blue-100 text-blue-700' },
};

const STATUS_APROVACAO: Record<string, { label: string; color: string }> = {
  INCOMPLETE: { label: 'Aguardando Aprovação', color: 'bg-orange-100 text-orange-700' },
  PENDING_APPROVAL: { label: 'Aguardando Aprovação', color: 'bg-yellow-100 text-yellow-700' },
  ACTIVE: { label: 'Aprovado', color: 'bg-green-100 text-green-700' },
  INACTIVE: { label: 'Reprovado', color: 'bg-red-100 text-red-700' },
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Aprovada',
  PENDING_APPROVAL: 'Aguardando Aprovação',
  INCOMPLETE: 'Cadastro Incompleto',
  INACTIVE: 'Reprovada',
};

export default function Cadastros() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroPorte, setFiltroPorte] = useState('');

  useEffect(() => {
    api.get('/companies')
      .then(r => setCompanies(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtradas = companies.filter(c => {
    const termo = busca.toLowerCase();
    const matchBusca = !busca ||
      c.companyName?.toLowerCase().includes(termo) ||
      c.cnpjcpf?.toLowerCase().includes(termo) ||
      c.email?.toLowerCase().includes(termo);
    const matchStatus = !filtroStatus || c.status === filtroStatus;
    const matchPorte = !filtroPorte || c.companySize === filtroPorte;
    return matchBusca && matchStatus && matchPorte;
  });

  return (
    <div className="p-8">

      {/* CABEÇALHO */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Cadastros</h1>
        <p className="text-gray-500 mt-1">Gestão de todos os cadastros de leads e associados</p>
      </div>

      {/* FILTROS */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-col md:flex-row gap-3">

        {/* BUSCA */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por empresa, CNPJ ou email..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3A59]"
          />
        </div>

        {/* FILTRO STATUS */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={filtroStatus}
            onChange={e => setFiltroStatus(e.target.value)}
            className="pl-9 pr-8 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3A59] bg-white"
          >
            {STATUS_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* FILTRO PORTE */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={filtroPorte}
            onChange={e => setFiltroPorte(e.target.value)}
            className="pl-9 pr-8 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3A59] bg-white"
          >
            {PORTE_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

      </div>

      {/* CONTADOR */}
      <p className="text-sm text-gray-500 mb-4">
        {filtradas.length} empresa{filtradas.length !== 1 ? 's' : ''} encontrada{filtradas.length !== 1 ? 's' : ''}
      </p>

      {/* TABELA */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Carregando...</div>
      ) : filtradas.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200">
          Nenhuma empresa encontrada.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Empresa</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">CNPJ/CPF</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Contato</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Porte</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtradas.map(company => (
                <tr key={company.id} className="hover:bg-gray-50 transition-colors">

                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-800">{company.companyName}</div>
                    <div className="text-xs text-gray-400">{company.corporateName}</div>
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-gray-400" />
                      {company.cnpjcpf}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-gray-400" />
                      {company.email}
                    </div>
                    {company.phone && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <Phone className="h-3.5 w-3.5 text-gray-400" />
                        {company.phone}
                      </div>
                    )}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {company.companySize || '-'}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-1">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_CADASTRO[company.status]?.color || 'bg-gray-100 text-gray-600'}`}>
                        {STATUS_CADASTRO[company.status]?.label || company.status}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_APROVACAO[company.status]?.color || 'bg-gray-100 text-gray-600'}`}>
                        {STATUS_APROVACAO[company.status]?.label || company.status}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <Link
                      to={`/admin/company/${company.id}`}
                      className="text-[#0C3A59] hover:underline text-sm font-medium"
                    >
                      Ver detalhes
                    </Link>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
