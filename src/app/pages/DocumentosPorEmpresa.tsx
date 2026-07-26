import {
  useEffect,
  useState,
} from 'react';

import {
  FileText,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Eye,
  Trash2,
  ChevronDown,
  ChevronUp,
  Building2,
} from 'lucide-react';

import api from '../services/api';

import type { DocumentStatus } from '../types';


interface Document {

  id: number;

  companyId: number;

  companyName?: string;

  establishmentType?: string;

  documentType: string;

  fileName: string;

  mimeType: string;

  fileSize: number;

  status: DocumentStatus;

  uploadedAt: string;

}


interface CompanyGroup {

  companyId: number;

  companyName: string;

  documents: Document[];

}


export default function DocumentosPorEmpresa() {


  const [documents, setDocuments] =
    useState<Document[]>([]);


  const [searchTerm, setSearchTerm] =
    useState('');


  const [filterStatus, setFilterStatus] =
    useState<DocumentStatus | 'ALL'>('ALL');


  const [filterRamo, setFilterRamo] =
    useState('ALL');


  const [dateFrom, setDateFrom] =
    useState('');


  const [dateTo, setDateTo] =
    useState('');


  const [expandedCompanies, setExpandedCompanies] =
    useState<Set<number>>(new Set());


  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    loadDocuments();

  }, []);


  async function loadDocuments() {

    try {

      setLoading(true);

      const response =
        await api.get('/documents');

      setDocuments(response.data);

    } catch (error) {

      console.error(
        'Erro ao carregar documentos',
        error,
      );

    } finally {

      setLoading(false);

    }

  }


  // =========================
  // AGRUPAR POR EMPRESA
  // =========================

  function groupByCompany(
    docs: Document[],
  ): CompanyGroup[] {

    const groupsMap =
      new Map<number, CompanyGroup>();

    for (const doc of docs) {

      const existing =
        groupsMap.get(doc.companyId);

      if (existing) {

        existing.documents.push(doc);

      } else {

        groupsMap.set(doc.companyId, {

          companyId: doc.companyId,

          companyName:
            doc.companyName ??
            `Empresa #${doc.companyId}`,

          documents: [doc],

        });

      }

    }

    return Array.from(groupsMap.values())
      .sort((a, b) =>
        a.companyName.localeCompare(b.companyName),
      );

  }


  // =========================
  // OPÇÕES DE RAMO
  // (derivadas dos documentos carregados)
  // =========================

  const ramoOptions =
    Array.from(
      new Set(
        documents
          .map(doc => doc.establishmentType)
          .filter((ramo): ramo is string => !!ramo),
      ),
    ).sort((a, b) => a.localeCompare(b));


  const filteredDocuments =
    documents.filter(doc => {

      const matchesSearch =
        doc.fileName
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
        ||
        (doc.companyName ?? '')
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === 'ALL' ||
        doc.status === filterStatus;

      const matchesRamo =
        filterRamo === 'ALL' ||
        doc.establishmentType === filterRamo;

      const uploadedDate =
        doc.uploadedAt.slice(0, 10); // 'YYYY-MM-DD'

      const matchesDateFrom =
        !dateFrom || uploadedDate >= dateFrom;

      const matchesDateTo =
        !dateTo || uploadedDate <= dateTo;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesRamo &&
        matchesDateFrom &&
        matchesDateTo
      );

    });


  const companyGroups =
    groupByCompany(filteredDocuments);


  function toggleCompany(companyId: number) {

    setExpandedCompanies(prev => {

      const next = new Set(prev);

      if (next.has(companyId)) {

        next.delete(companyId);

      } else {

        next.add(companyId);

      }

      return next;

    });

  }


  // =========================
  // HELPERS DE STATUS
  // =========================

  function getStatusIcon(status: DocumentStatus) {

    const icons = {
      PENDING: AlertCircle,
      APPROVED: CheckCircle,
      REJECTED: XCircle,
    };

    return icons[status];

  }


  const statusLabels = {
    PENDING: 'Pendente',
    APPROVED: 'Aprovado',
    REJECTED: 'Rejeitado',
  };


  function getStatusColor(status: DocumentStatus) {

    const colors = {
      PENDING: 'text-gray-600 bg-gray-100',
      APPROVED: 'text-green-600 bg-green-100',
      REJECTED: 'text-red-600 bg-red-100',
    };

    return colors[status];

  }


  function formatDate(date: string) {

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(date));

  }


  function formatFileSize(size: number) {

    if (size < 1024) {

      return `${size} Bytes`;

    }

    if (size < 1024 * 1024) {

      return `${(size / 1024).toFixed(2)} KB`;

    }

    return `${(size / (1024 * 1024)).toFixed(2)} MB`;

  }


  // =========================
  // AÇÕES
  // =========================

  async function viewDocument(id: number) {

    try {

      const response = await api.get(
        `/documents/${id}/download`,
        { responseType: 'blob' },
      );

      const blob = new Blob(
        [response.data],
        { type: response.headers['content-type'] },
      );

      const url = window.URL.createObjectURL(blob);

      window.open(url, '_blank');

    } catch (error) {

      console.error('Erro ao visualizar documento', error);

    }

  }


  async function downloadDocument(id: number, fileName: string) {

    try {

      const response = await api.get(
        `/documents/${id}/download`,
        { responseType: 'blob' },
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data]),
      );

      const link = document.createElement('a');

      link.href = url;

      link.setAttribute('download', fileName);

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (error) {

      console.error('Erro ao baixar documento', error);

    }

  }


  async function approveDocument(id: number) {

    try {

      await api.patch(`/documents/${id}`, {
        status: 'APPROVED',
      });

      loadDocuments();

    } catch (error) {

      console.error('Erro ao aprovar documento', error);

    }

  }


  async function rejectDocument(id: number) {

    try {

      await api.patch(`/documents/${id}`, {
        status: 'REJECTED',
      });

      loadDocuments();

    } catch (error) {

      console.error('Erro ao rejeitar documento', error);

    }

  }


  async function deleteDocument(id: number) {

    const confirmed = window.confirm(
      'Tem certeza que deseja remover este documento? Essa ação não pode ser desfeita.',
    );

    if (!confirmed) return;

    try {

      await api.delete(`/documents/${id}`);

      loadDocuments();

    } catch (error) {

      console.error('Erro ao remover documento', error);

    }

  }


  // =========================
  // RENDER
  // =========================

  if (loading) {

    return (
      <div className="p-8">
        Carregando documentos...
      </div>
    );

  }


  return (

    <div className="p-8">

      <div className="mb-8">

        <h1 className="text-2xl font-semibold">
          Documentos por Empresa
        </h1>

        <p className="text-muted-foreground mt-1">
          Documentos enviados, organizados por empresa associada
        </p>

      </div>


      {/* ==========================
          RESUMO
      =========================== */}

      <div
        className="
          grid
          grid-cols-1
          gap-6
          sm:grid-cols-2
          mb-8
        "
      >

        <div
          className="
            bg-card
            border
            border-border
            rounded-lg
            p-6
          "
        >

          <div className="bg-blue-500 rounded-lg p-3 w-fit mb-4">

            <Building2 className="h-6 w-6 text-white" />

          </div>

          <p className="text-muted-foreground mb-1">
            Empresas com documentos
          </p>

          <p className="text-[2rem] leading-none mb-2">
            {companyGroups.length}
          </p>

          <p className="text-muted-foreground text-[0.875rem]">
            Empresas com pelo menos um envio
          </p>

        </div>


        <div
          className="
            bg-card
            border
            border-border
            rounded-lg
            p-6
          "
        >

          <div className="bg-green-500 rounded-lg p-3 w-fit mb-4">

            <FileText className="h-6 w-6 text-white" />

          </div>

          <p className="text-muted-foreground mb-1">
            Total de documentos
          </p>

          <p className="text-[2rem] leading-none mb-2">
            {filteredDocuments.length}
          </p>

          <p className="text-muted-foreground text-[0.875rem]">
            Considerando os filtros aplicados
          </p>

        </div>

      </div>


      {/* ==========================
          FILTROS
      =========================== */}

      <div
        className="
          bg-card
          border
          border-border
          rounded-lg
          p-6
          mb-6
        "
      >

        <div className="flex gap-4 flex-wrap">

          <div className="flex-1 min-w-[240px] relative">

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
              placeholder="Buscar por empresa ou arquivo..."
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

          <select
            value={filterStatus}
            onChange={e =>
              setFilterStatus(
                e.target.value as DocumentStatus | 'ALL',
              )
            }
            className="
              px-4
              py-3
              rounded-lg
              border
              border-border
              bg-input-background
            "
          >

            <option value="ALL">Todos os status</option>
            <option value="PENDING">Pendente</option>
            <option value="APPROVED">Aprovado</option>
            <option value="REJECTED">Rejeitado</option>

          </select>

          <select
            value={filterRamo}
            onChange={e => setFilterRamo(e.target.value)}
            className="
              px-4
              py-3
              rounded-lg
              border
              border-border
              bg-input-background
            "
          >

            <option value="ALL">Todos os ramos</option>

            {ramoOptions.map(ramo => (
              <option key={ramo} value={ramo}>
                {ramo}
              </option>
            ))}

          </select>

        </div>


        <div className="flex gap-4 flex-wrap mt-4">

          <div className="flex items-center gap-2">

            <label className="text-sm text-muted-foreground whitespace-nowrap">
              De:
            </label>

            <input
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              className="
                px-4
                py-2
                rounded-lg
                border
                border-border
                bg-input-background
              "
            />

          </div>

          <div className="flex items-center gap-2">

            <label className="text-sm text-muted-foreground whitespace-nowrap">
              Até:
            </label>

            <input
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              className="
                px-4
                py-2
                rounded-lg
                border
                border-border
                bg-input-background
              "
            />

          </div>

          {(dateFrom || dateTo || filterRamo !== 'ALL') && (

            <button
              type="button"
              onClick={() => {
                setDateFrom('');
                setDateTo('');
                setFilterRamo('ALL');
              }}
              className="
                text-sm
                text-muted-foreground
                hover:text-foreground
                underline
              "
            >
              Limpar filtros de ramo/período
            </button>

          )}

        </div>

      </div>


      {/* ==========================
          LISTA AGRUPADA POR EMPRESA
      =========================== */}

      <div className="space-y-4">

        {companyGroups.map(group => {

          const isExpanded =
            expandedCompanies.has(group.companyId);

          const pendingCount =
            group.documents.filter(
              d => d.status === 'PENDING',
            ).length;

          return (

            <div
              key={group.companyId}
              className="
                bg-card
                border
                border-border
                rounded-lg
                overflow-hidden
              "
            >

              {/* CABEÇALHO DA EMPRESA */}

              <button
                onClick={() => toggleCompany(group.companyId)}
                className="
                  w-full
                  flex
                  items-center
                  justify-between
                  p-6
                  hover:bg-muted
                  transition-colors
                "
              >

                <div className="flex items-center gap-4">

                  <div
                    className="
                      w-12
                      h-12
                      bg-blue-100
                      rounded-lg
                      flex
                      items-center
                      justify-center
                    "
                  >

                    <Building2 className="h-6 w-6 text-blue-600" />

                  </div>

                  <div className="text-left">

                    <h4 className="text-lg font-medium">
                      {group.companyName}
                    </h4>

                    <p className="text-sm text-muted-foreground">
                      {group.documents.length}{' '}
                      {group.documents.length === 1
                        ? 'documento'
                        : 'documentos'}
                      {pendingCount > 0 && (
                        <>
                          {' · '}
                          <span className="text-yellow-600">
                            {pendingCount} pendente
                            {pendingCount > 1 ? 's' : ''}
                          </span>
                        </>
                      )}
                    </p>

                  </div>

                </div>

                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}

              </button>


              {/* DOCUMENTOS DA EMPRESA */}

              {isExpanded && (

                <div className="border-t border-border divide-y divide-border">

                  {group.documents.map(doc => {

                    const StatusIcon = getStatusIcon(doc.status);

                    const statusColor = getStatusColor(doc.status);

                    return (

                      <div
                        key={doc.id}
                        className="
                          p-6
                          flex
                          items-start
                          justify-between
                        "
                      >

                        <div className="flex gap-4 flex-1">

                          <div
                            className="
                              w-12
                              h-12
                              bg-gray-100
                              rounded-lg
                              flex
                              items-center
                              justify-center
                            "
                          >

                            <FileText className="h-6 w-6 text-gray-600" />

                          </div>

                          <div className="flex-1">

                            <div className="flex justify-between mb-2">

                              <h5 className="font-medium">
                                {doc.fileName}
                              </h5>

                              <span
                                className={`
                                  flex
                                  items-center
                                  gap-2
                                  px-3
                                  py-1
                                  rounded-full
                                  text-sm
                                  ${statusColor}
                                `}
                              >

                                <StatusIcon className="h-4 w-4" />

                                {statusLabels[doc.status]}

                              </span>

                            </div>

                            <div
                              className="
                                flex
                                flex-wrap
                                gap-4
                                text-sm
                                text-muted-foreground
                              "
                            >

                              <span>Tipo: {doc.documentType}</span>

                              <span>
                                Enviado: {formatDate(doc.uploadedAt)}
                              </span>

                              <span>
                                Tamanho: {formatFileSize(doc.fileSize)}
                              </span>

                            </div>

                          </div>

                        </div>

                        <div className="flex items-center gap-2 ml-4">

                          {doc.status === 'PENDING' && (

                            <>

                              <button
                                onClick={() => approveDocument(doc.id)}
                                className="
                                  px-4
                                  py-2
                                  rounded-lg
                                  bg-green-600
                                  text-white
                                  hover:bg-green-700
                                  flex
                                  items-center
                                  gap-2
                                  text-sm
                                "
                              >
                                <CheckCircle className="h-4 w-4" />
                                Aprovar
                              </button>

                              <button
                                onClick={() => rejectDocument(doc.id)}
                                className="
                                  px-4
                                  py-2
                                  rounded-lg
                                  bg-red-600
                                  text-white
                                  hover:bg-red-700
                                  flex
                                  items-center
                                  gap-2
                                  text-sm
                                "
                              >
                                <XCircle className="h-4 w-4" />
                                Rejeitar
                              </button>

                            </>

                          )}

                          <button
                            onClick={() => viewDocument(doc.id)}
                            className="p-2 rounded-lg hover:bg-muted"
                            title="Visualizar documento"
                          >
                            <Eye className="h-5 w-5" />
                          </button>

                          <button
                            onClick={() =>
                              downloadDocument(doc.id, doc.fileName)
                            }
                            className="p-2 rounded-lg hover:bg-muted"
                            title="Baixar documento"
                          >
                            <Download className="h-5 w-5" />
                          </button>

                          <button
                            onClick={() => deleteDocument(doc.id)}
                            className="
                              p-2
                              rounded-lg
                              hover:bg-red-100
                              text-red-600
                            "
                            title="Remover documento"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>

                        </div>

                      </div>

                    );

                  })}

                </div>

              )}

            </div>

          );

        })}

      </div>


      {companyGroups.length === 0 && (

        <div
          className="
            bg-card
            border
            border-border
            rounded-lg
            p-12
            text-center
          "
        >

          <p className="text-muted-foreground">
            Nenhum documento encontrado
          </p>

        </div>

      )}

    </div>

  );

}
