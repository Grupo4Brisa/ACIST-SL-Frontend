import { useEffect, useState } from 'react';
import {
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Building2,
} from 'lucide-react';
import api from '../services/api';

type PaymentStatus = 'PENDING' | 'APPROVED' | 'PAID' | 'CANCELLED' | 'OVERDUE';

interface Payment {
  id: number;
  companyId: number;
  companyName?: string;
  amount: string | number;
  paymentType: string;
  status: PaymentStatus;
  dueDate: string;
  paidAt?: string;
  createdAt: string;
}

export default function Pagamentos() {

  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<PaymentStatus | 'ALL'>('ALL');


  async function loadPayments() {

    try {

      setLoading(true);

      const response = await api.get('/payments');

      setPayments(response.data);

    } catch (error) {

      console.error('Erro ao carregar pagamentos', error);

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    loadPayments();

  }, []);


  const filteredPayments = payments.filter(payment => {

    const term = searchTerm.toLowerCase();

    const matchesSearch =
      (payment.companyName ?? '').toLowerCase().includes(term) ||
      String(payment.companyId).includes(term);

    const matchesStatus =
      filterStatus === 'ALL' || payment.status === filterStatus;

    return matchesSearch && matchesStatus;

  });


  const statusCounts = {
    PENDING: payments.filter(p => p.status === 'PENDING').length,
    APPROVED: payments.filter(p => p.status === 'APPROVED').length,
    PAID: payments.filter(p => p.status === 'PAID').length,
    CANCELLED: payments.filter(p => p.status === 'CANCELLED').length,
  };


  const statusLabels: Record<PaymentStatus, string> = {
    PENDING: 'Pendente',
    APPROVED: 'Aprovado',
    PAID: 'Pago',
    CANCELLED: 'Cancelado',
    OVERDUE: 'Vencido',
  };


  function getStatusColor(status: PaymentStatus) {

    const colors: Record<PaymentStatus, string> = {
      PENDING: 'text-yellow-600 bg-yellow-100',
      APPROVED: 'text-blue-600 bg-blue-100',
      PAID: 'text-green-600 bg-green-100',
      CANCELLED: 'text-red-600 bg-red-100',
      OVERDUE: 'text-red-600 bg-red-100',
    };

    return colors[status];

  }


  function getStatusIcon(status: PaymentStatus) {

    const icons: Record<PaymentStatus, typeof Clock> = {
      PENDING: Clock,
      APPROVED: CheckCircle,
      PAID: CheckCircle,
      CANCELLED: XCircle,
      OVERDUE: AlertCircle,
    };

    return icons[status];

  }


  function formatDate(date?: string) {

    if (!date) return '-';

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(date));

  }


  function formatAmount(amount: string | number) {

    const value = typeof amount === 'string' ? parseFloat(amount) : amount;

    return value.toFixed(2).replace('.', ',');

  }


  async function approvePayment(id: number) {

    try {

      await api.patch(`/payments/${id}/approve`);

      loadPayments();

    } catch (error: any) {

      alert(
        error.response?.data?.message ?? 'Erro ao aprovar pagamento.',
      );

    }

  }


  async function markAsPaid(id: number) {

    try {

      await api.patch(`/payments/${id}/pay`);

      loadPayments();

    } catch (error: any) {

      alert(
        error.response?.data?.message ?? 'Erro ao marcar como pago.',
      );

    }

  }


  async function cancelPayment(id: number) {

    const confirmed = window.confirm(
      'Tem certeza que deseja cancelar este pagamento?',
    );

    if (!confirmed) return;

    try {

      await api.patch(`/payments/${id}/cancel`);

      loadPayments();

    } catch (error: any) {

      alert(
        error.response?.data?.message ?? 'Erro ao cancelar pagamento.',
      );

    }

  }


  if (loading) {

    return <div className="p-8">Carregando pagamentos...</div>;

  }

  return (

    <div className="p-8">

      <div className="mb-8">

        <h1 className="text-2xl font-semibold">Pagamentos</h1>

        <p className="text-muted-foreground mt-1">
          Aprovação e acompanhamento dos pagamentos das associações
        </p>

      </div>


      {/* RESUMO */}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">

        {(['PENDING', 'APPROVED', 'PAID', 'CANCELLED'] as PaymentStatus[]).map(
          status => {

            const StatusIcon = getStatusIcon(status);

            return (

              <div
                key={status}
                className="bg-card border border-border rounded-lg p-6"
              >

                <div
                  className={`
                    ${getStatusColor(status)}
                    rounded-lg
                    p-3
                    w-fit
                    mb-4
                  `}
                >
                  <StatusIcon className="h-5 w-5" />
                </div>

                <p className="text-muted-foreground mb-1">
                  {statusLabels[status]}
                </p>

                <p className="text-3xl">{statusCounts[status]}</p>

              </div>

            );

          },
        )}

      </div>


      {/* FILTROS */}

      <div className="bg-card border border-border rounded-lg p-6 mb-6">

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
              placeholder="Buscar por empresa..."
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
              setFilterStatus(e.target.value as PaymentStatus | 'ALL')
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
            <option value="PAID">Pago</option>
            <option value="CANCELLED">Cancelado</option>

          </select>

        </div>

      </div>


      {/* LISTA */}

      <div className="space-y-4">

        {filteredPayments.map(payment => {

          const StatusIcon = getStatusIcon(payment.status);

          return (

            <div
              key={payment.id}
              className="bg-card border border-border rounded-lg p-6"
            >

              <div className="flex items-start justify-between gap-4 flex-wrap">

                <div className="flex gap-4 flex-1 min-w-[240px]">

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
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>

                  <div>

                    <div className="flex items-center gap-2 mb-1">

                      <Building2 className="h-4 w-4 text-muted-foreground" />

                      <h3 className="font-medium">
                        {payment.companyName ?? `Empresa #${payment.companyId}`}
                      </h3>

                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">

                      <span>
                        R$ {formatAmount(payment.amount)}
                      </span>

                      <span>{payment.paymentType}</span>

                      <span>Vencimento: {formatDate(payment.dueDate)}</span>

                      {payment.paidAt && (
                        <span>Pago em: {formatDate(payment.paidAt)}</span>
                      )}

                    </div>

                  </div>

                </div>

                <div className="flex items-center gap-3">

                  <span
                    className={`
                      flex
                      items-center
                      gap-2
                      px-3
                      py-1.5
                      rounded-full
                      text-sm
                      ${getStatusColor(payment.status)}
                    `}
                  >
                    <StatusIcon className="h-4 w-4" />
                    {statusLabels[payment.status]}
                  </span>

                  {payment.status === 'PENDING' && (

                    <>

                      <button
                        onClick={() => approvePayment(payment.id)}
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
                        onClick={() => cancelPayment(payment.id)}
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
                        Cancelar
                      </button>

                    </>

                  )}

                  {payment.status === 'APPROVED' && (

                    <>

                      <button
                        onClick={() => markAsPaid(payment.id)}
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
                        Marcar como Pago
                      </button>

                      <button
                        onClick={() => cancelPayment(payment.id)}
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
                        Cancelar
                      </button>

                    </>

                  )}

                </div>

              </div>

            </div>

          );

        })}

        {filteredPayments.length === 0 && (

          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <p className="text-muted-foreground">
              Nenhum pagamento encontrado
            </p>
          </div>

        )}

      </div>

    </div>

  );

}
