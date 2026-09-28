import React, { useState, useEffect } from 'react';
import type { Ticket, BookingState, N8nWebhookPayload } from './types';
import { INITIAL_TICKETS } from './data/mockData';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import type { FilterCategory } from './components/StatsBar';
import { TicketCard } from './components/TicketCard';
import { TicketModal } from './components/TicketModal';
import { QuickReplyModal } from './components/QuickReplyModal';
import { ComparisonModal } from './components/ComparisonModal';
import { N8nPayloadModal } from './components/N8nPayloadModal';
import { Toast } from './components/Toast';
import { initTelegramApp, getCurrentUser, triggerHaptic } from './utils/telegram';
import { Inbox, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [currentAdmin, setCurrentAdmin] = useState<string>('Оксана');
  const [activeTab, setActiveTab] = useState<FilterCategory>('open');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals state
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [quickReplyTicket, setQuickReplyTicket] = useState<Ticket | null>(null);
  const [showComparison, setShowComparison] = useState<boolean>(false);
  const [showN8nInspector, setShowN8nInspector] = useState<boolean>(false);
  const [lastPayload, setLastPayload] = useState<N8nWebhookPayload | null>(null);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    initTelegramApp();
    const user = getCurrentUser();
    if (user?.first_name) {
      setCurrentAdmin(user.first_name);
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Action: Take Conversation (Assigns admin, mutes bot)
  const handleTakeConversation = (ticketId: string) => {
    triggerHaptic('medium');
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: 'progress',
            assignedAdmin: currentAdmin,
            humanUntil: 'через 60 хв',
          };
        }
        return t;
      })
    );

    const target = tickets.find((t) => t.id === ticketId);
    if (target) {
      const payload: N8nWebhookPayload = {
        event: 'take_conversation',
        conversation_id: target.conversationId,
        actor: {
          admin_name: currentAdmin,
        },
        timestamp: new Date().toISOString(),
      };
      setLastPayload(payload);
    }

    showToast(`Діалог закріплено за адміністраторкою ${currentAdmin} (бот на паузі 60 хв)`);
  };

  // Action: Confirm Booking
  const handleConfirmBooking = (ticketId: string, booking: BookingState) => {
    triggerHaptic('success');
    const target = tickets.find((t) => t.id === ticketId);
    if (!target) return;

    const isDepositNeeded = booking.depositRequired && booking.depositStatus !== 'received';
    const nextStatus = isDepositNeeded ? 'deposit_pending' : 'booked';

    const clientMsg = isDepositNeeded
      ? `Запис попередньо заброньовано: ${booking.serviceName}, майстер ${booking.masterName || 'Саша'}, ${booking.time || '15:00'}. Для фіксації очікуємо завдаток ${booking.depositAmount || 300} грн за реквізитами IBAN 🤍`
      : `Запис підтверджено: ${booking.serviceName}, майстер ${booking.masterName || 'Саша'}, ${booking.time || '15:00'}. Чекаємо на вас у Safe Town, вул. Кульпарківська, 96 ✨`;

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: nextStatus,
            booking: {
              ...booking,
              bookonSyncStatus: 'synced',
            },
            dialogue: [
              ...t.dialogue,
              {
                id: `m_${Date.now()}`,
                author: 'human',
                text: clientMsg,
                time: new Intl.DateTimeFormat('uk-UA', { hour: '2-digit', minute: '2-digit' }).format(new Date()),
              },
            ],
          };
        }
        return t;
      })
    );

    const payload: N8nWebhookPayload = {
      event: 'confirm_booking',
      conversation_id: target.conversationId,
      actor: {
        admin_name: currentAdmin,
      },
      timestamp: new Date().toISOString(),
      booking: {
        service_id: booking.serviceId,
        service_name: booking.serviceName,
        master_name: booking.masterName,
        date: booking.date,
        time: booking.time,
        deposit_required: booking.depositRequired,
        deposit_amount: booking.depositAmount,
        deposit_status: booking.depositStatus,
      },
      message_to_client: clientMsg,
    };
    setLastPayload(payload);

    setSelectedTicket(null);
    showToast(
      isDepositNeeded
        ? `Запис оформлено, очікуємо завдаток ${booking.depositAmount} ₴ (реквізити надіслано в Direct)`
        : `Запис для ${target.clientName} успішно підтверджено та синхронізовано з BookOn!`
    );
  };

  // Action: Resume Bot
  const handleResumeBot = (ticketId: string) => {
    triggerHaptic('medium');
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: 'ai_active',
            assignedAdmin: undefined,
            humanUntil: undefined,
          };
        }
        return t;
      })
    );

    const target = tickets.find((t) => t.id === ticketId);
    if (target) {
      const payload: N8nWebhookPayload = {
        event: 'resume_bot',
        conversation_id: target.conversationId,
        actor: {
          admin_name: currentAdmin,
        },
        timestamp: new Date().toISOString(),
      };
      setLastPayload(payload);
    }

    setSelectedTicket(null);
    showToast('Діалог повернуто ШІ-агенту (C1 Brain). Бот веде клієнта далі.');
  };

  // Action: Send Direct message
  const handleSendDirect = (ticketId: string, messageText: string) => {
    triggerHaptic('success');
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            dialogue: [
              ...t.dialogue,
              {
                id: `m_${Date.now()}`,
                author: 'human',
                text: messageText,
                time: new Intl.DateTimeFormat('uk-UA', { hour: '2-digit', minute: '2-digit' }).format(new Date()),
              },
            ],
          };
        }
        return t;
      })
    );

    const target = tickets.find((t) => t.id === ticketId);
    if (target) {
      const payload: N8nWebhookPayload = {
        event: 'send_direct_message',
        conversation_id: target.conversationId,
        actor: {
          admin_name: currentAdmin,
        },
        timestamp: new Date().toISOString(),
        message_to_client: messageText,
      };
      setLastPayload(payload);
    }

    showToast('Повідомлення надіслано в Instagram Direct клієнту!');
  };

  // Action: Copy CRM notes
  const handleCopyCrmNotes = (notes: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(notes);
    }
    showToast('Нотатки для картки BookOn скопійовано в буфер!');
  };

  // Filtered tickets
  const filteredTickets = tickets.filter((ticket) => {
    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        ticket.clientName.toLowerCase().includes(q) ||
        ticket.instagramHandle.toLowerCase().includes(q) ||
        (ticket.booking.serviceName && ticket.booking.serviceName.toLowerCase().includes(q)) ||
        (ticket.booking.masterName && ticket.booking.masterName.toLowerCase().includes(q)) ||
        ticket.lastClientMessage.toLowerCase().includes(q);
      if (!match) return false;
    }

    // 2. Tab Filter
    if (activeTab === 'open') {
      return ticket.status === 'open' || ticket.status === 'progress';
    }
    if (activeTab === 'deposit') {
      return ticket.status === 'deposit_pending';
    }
    if (activeTab === 'booked') {
      return ticket.status === 'booked';
    }
    if (activeTab === 'ai_active') {
      return ticket.status === 'ai_active';
    }
    return true; // 'all'
  });

  const counts = {
    open: tickets.filter((t) => t.status === 'open' || t.status === 'progress').length,
    deposit: tickets.filter((t) => t.status === 'deposit_pending').length,
    booked: tickets.filter((t) => t.status === 'booked').length,
    ai_active: tickets.filter((t) => t.status === 'ai_active').length,
    all: tickets.length,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-10">
      {/* Top Header */}
      <Header
        currentAdmin={currentAdmin}
        onAdminChange={(name) => setCurrentAdmin(name)}
        onOpenComparison={() => setShowComparison(true)}
        onOpenN8nInspector={() => setShowN8nInspector(true)}
        openTicketsCount={counts.open}
      />

      {/* Stats and Filter Bar */}
      <StatsBar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        counts={counts}
        searchQuery={searchQuery}
        onSearchChange={(q) => setSearchQuery(q)}
      />

      {/* Main Queue Feed */}
      <main className="max-w-4xl mx-auto px-4 flex-1 w-full space-y-3 pt-1">
        {filteredTickets.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
              <Inbox className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-slate-300">Немає звернень у цій категорії</h3>
              <p className="text-xs text-slate-500">
                Всі звернення оброблені, або спробуйте змінити фільтр чи пошуковий запит
              </p>
            </div>
            {activeTab !== 'all' && (
              <button
                onClick={() => setActiveTab('all')}
                className="text-xs text-amber-400 hover:underline pt-2 font-medium"
              >
                Показати всі звернення ({counts.all})
              </button>
            )}
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onOpen={(t) => setSelectedTicket(t)}
              onTake={(t) => handleTakeConversation(t.id)}
              currentAdmin={currentAdmin}
            />
          ))
        )}

        {/* Quick Help Callout Banner */}
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800/80 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <span className="font-semibold text-slate-200 block">
                Як Telegram Mini App спрощує роботу?
              </span>
              <span className="text-[11px] text-slate-400">
                Замість реплаїв у чаті — миттєве оформлення та чисті n8n-вебхуки.
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowComparison(true)}
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold shrink-0 transition-colors"
          >
            Детальніше
          </button>
        </div>
      </main>

      {/* Modals */}
      {selectedTicket && (
        <TicketModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onConfirmBooking={handleConfirmBooking}
          onTakeConversation={handleTakeConversation}
          onResumeBot={handleResumeBot}
          onOpenQuickReply={(t) => setQuickReplyTicket(t)}
          onCopyCrmNotes={handleCopyCrmNotes}
          currentAdmin={currentAdmin}
        />
      )}

      {quickReplyTicket && (
        <QuickReplyModal
          ticket={quickReplyTicket}
          onClose={() => setQuickReplyTicket(null)}
          onSend={handleSendDirect}
        />
      )}

      {showComparison && (
        <ComparisonModal onClose={() => setShowComparison(false)} />
      )}

      {showN8nInspector && (
        <N8nPayloadModal
          lastPayload={lastPayload}
          onClose={() => setShowN8nInspector(false)}
          onCopyPayload={() => showToast('JSON скопійовано в буфер!')}
        />
      )}

      {/* Global Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default App;
