import { useEffect, useState } from "react";

import {
  FileText,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Eye,
} from "lucide-react";

import api from "../services/api";

import type { DocumentStatus } from "../types";

interface Document {
  id: number;

  companyId: number;

  companyName?: string;

  documentType: string;

  fileName: string;

  mimeType: string;

  fileSize: number;

  status: DocumentStatus;

  uploadedAt: string;
}

export default function Documentos() {
  const [documents, setDocuments] = useState<Document[]>([]);

  const [filterStatus, setFilterStatus] = useState<DocumentStatus | "ALL">(
    "ALL",
  );

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    try {
      const response = await api.get("/documents");

      setDocuments(response.data);
    } catch (error) {
      console.error("Erro ao carregar documentos", error);
    }
  }

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.fileName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "ALL" || doc.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  function getStatusIcon(status: DocumentStatus) {
    const icons = {
      PENDING: AlertCircle,

      APPROVED: CheckCircle,

      REJECTED: XCircle,
    };

    return icons[status];
  }

  const statusLabels = {
    PENDING: "Pendente",

    APPROVED: "Aprovado",

    REJECTED: "Rejeitado",
  };

  function getStatusColor(status: DocumentStatus) {
    const colors = {
      PENDING: "text-gray-600 bg-gray-100",

      APPROVED: "text-green-600 bg-green-100",

      REJECTED: "text-red-600 bg-red-100",
    };

    return colors[status];
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
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

  const statusCounts = {
    PENDING: documents.filter((doc) => doc.status === "PENDING").length,

    APPROVED: documents.filter((doc) => doc.status === "APPROVED").length,

    REJECTED: documents.filter((doc) => doc.status === "REJECTED").length,
  };

  async function approveDocument(id: number) {
    try {
      await api.patch(`/documents/${id}`, {
        status: "APPROVED",
      });

      loadDocuments();
    } catch (error) {
      console.error("Erro ao aprovar documento", error);
    }
  }

  async function rejectDocument(id: number) {
    try {
      await api.patch(`/documents/${id}`, {
        status: "REJECTED",
      });

      loadDocuments();
    } catch (error) {
      console.error("Erro ao rejeitar documento", error);
    }
  }
  async function downloadDocument(id: number, fileName: string) {
    try {
      const response = await api.get(`/documents/${id}/download`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute("download", fileName);

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao baixar documento", error);
    }
  }

  async function viewDocument(id: number) {
    try {
      const response = await api.get(`/documents/${id}/download`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      const url = window.URL.createObjectURL(blob);

      window.open(url, "_blank");
    } catch (error) {
      console.error("Erro ao visualizar documento", error);
    }
  }

  async function replaceDocument(id: number) {
    if (!selectedFile) {
      alert("Selecione um arquivo");

      return;
    }

    try {
      const formData = new FormData();

      formData.append("file", selectedFile);

      await api.patch(`/documents/${id}/file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSelectedFile(null);

      loadDocuments();
    } catch (error) {
      console.error("Erro ao substituir documento", error);
    }
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Documentos</h1>

        <p
          className="
            text-muted-foreground
            mt-1
          "
        >
          Gestão e validação dos documentos enviados pelas empresas
        </p>
      </div>

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-3
          gap-4
          sm:gap-6
          mb-8
        "
      >
        {Object.entries(statusCounts).map(([status, count]) => {
          const StatusIcon = getStatusIcon(status as DocumentStatus);

          const color = getStatusColor(status as DocumentStatus);

          return (
            <div
              key={status}
              className="
                    bg-card
                    border
                    border-border
                    rounded-lg
                    p-4
                    sm:p-6
                  "
            >
              <div
                className="
                      flex
                      items-center
                      gap-3
                      mb-4
                    "
              >
                <div
                  className={`
                        ${color}
                        rounded-lg
                        p-3
                      `}
                >
                  <StatusIcon
                    className="
                          h-5
                          w-5
                        "
                  />
                </div>
              </div>

              <p
                className="
                      text-muted-foreground
                      mb-1
                    "
              >
                {statusLabels[status as DocumentStatus]}
              </p>

              <p className="text-3xl">{count}</p>
            </div>
          );
        })}
      </div>

      <div
        className="
          bg-card
          border
          border-border
          rounded-lg
          p-4
          sm:p-6
          mb-6
        "
      >
        <div
          className="
            flex
            gap-4
            flex-wrap
          "
        >
          <div
            className="
              flex-1
              min-w-[240px]
              relative
            "
          >
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
              placeholder="
                Buscar documento...
              "
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

          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as DocumentStatus | "ALL")
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
        </div>
      </div>
      <div className="space-y-4">
        {filteredDocuments.map((doc) => {
          const StatusIcon = getStatusIcon(doc.status);

          const statusColor = getStatusColor(doc.status);

          return (
            <div
              key={doc.id}
              className="
                    bg-card
                    border
                    border-border
                    rounded-lg
                    p-4
                    sm:p-6
                  "
            >
              <div
                className="
                      flex
                      flex-col
                      lg:flex-row
                      lg:items-start
                      justify-between
                      gap-4
                    "
              >
                <div
                  className="
                        flex
                        gap-4
                        flex-1
                        min-w-0
                      "
                >
                  <div
                    className="
                          w-14
                          h-14
                          bg-blue-100
                          rounded-lg
                          flex
                          items-center
                          justify-center
                          shrink-0
                        "
                  >
                    <FileText
                      className="
                            h-7
                            w-7
                            text-blue-600
                          "
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div
                      className="
                            flex
                            justify-between
                            gap-3
                            flex-wrap
                            mb-3
                          "
                    >
                      <div className="min-w-0">
                        <h4
                          className="
                                text-lg
                                font-medium
                                break-words
                              "
                        >
                          {doc.fileName}
                        </h4>

                        <p
                          className="
                                text-sm
                                text-muted-foreground
                              "
                        >
                          Empresa: {doc.companyName ?? `ID ${doc.companyId}`}
                        </p>
                      </div>

                      <span
                        className={`
                              flex
                              items-center
                              gap-2
                              px-3
                              py-1.5
                              rounded-full
                              text-sm
                              shrink-0
                              ${statusColor}
                            `}
                      >
                        <StatusIcon
                          className="
                                h-4
                                w-4
                              "
                        />

                        {statusLabels[doc.status]}
                      </span>
                    </div>

                    <div
                      className="
                            flex
                            flex-wrap
                            gap-x-6
                            gap-y-1
                            text-sm
                            text-muted-foreground
                          "
                    >
                      <span>Tipo: {doc.documentType}</span>

                      <span>Enviado: {formatDate(doc.uploadedAt)}</span>

                      <span>Tamanho: {formatFileSize(doc.fileSize)}</span>

                      <span>Arquivo: {doc.mimeType}</span>
                    </div>
                  </div>
                </div>

                <div
                  className="
                        flex
                        items-center
                        gap-2
                        flex-wrap
                        lg:ml-6
                      "
                >
                  {doc.status === "PENDING" && (
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
                              "
                      >
                        <CheckCircle
                          className="
                                  h-4
                                  w-4
                                "
                        />
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
                              "
                      >
                        <XCircle
                          className="
                                  h-4
                                  w-4
                                "
                        />
                        Rejeitar
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => viewDocument(doc.id)}
                    className="
                          p-2
                          rounded-lg
                          hover:bg-muted
                        "
                    title="Visualizar documento"
                  >
                    <Eye
                      className="
                            h-5
                            w-5
                          "
                    />
                  </button>

                  <button
                    onClick={() => downloadDocument(doc.id, doc.fileName)}
                    className="
                          p-2
                          rounded-lg
                          hover:bg-muted
                        "
                    title="Baixar documento"
                  >
                    <Download
                      className="
                            h-5
                            w-5
                          "
                    />
                  </button>

                  <label
                    className="
                          p-2
                          rounded-lg
                          hover:bg-muted
                          cursor-pointer
                        "
                    title="Substituir arquivo"
                  >
                    <Upload
                      className="
                            h-5
                            w-5
                          "
                    />

                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];

                        if (file) {
                          setSelectedFile(file);

                          replaceDocument(doc.id);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDocuments.length === 0 && (
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
          <p
            className="
                text-muted-foreground
              "
          >
            Nenhum documento encontrado
          </p>
        </div>
      )}
    </div>
  );
}
