import type { Ticket } from '../types';
import { Clock, Sparkles, ChevronRight, UserCheck, ShieldAlert, HeartHandshake, CheckCircle2, Coins } from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';
import { triggerHaptic } from '../utils/telegram';

interface TicketCardProps {
  ticket: Ticket;
  onOpen: (ticket: Ticket) => void;
  onTake: (ticket: Ticket) => void;
  currentAdmin?: string;
}

export const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  onOpen,
  onTake,
}) => {
  const isVip = ticket.vipStatus;
  const isSlaBreached = ticket.minutesInQueue >= 15;

  const getReasonBadge = () => {
    switch (ticket.reason) {
      case 'negative_experience':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
            <ShieldAlert className="w-3 h-3 text-amber-400" />
            <span>Страх / Досвід</span>
          </span>
        );
      case 'human_request':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-300 bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 rounded-full">
            <HeartHandshake className="w-3 h-3 text-purple-400" />
            <span>Кличе людину</span>
          </span>
        );
      case 'booking_intent':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Запит на запис</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-300 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full">
            <span>{ticket.reasonTitle}</span>
          </span>
        );
    }
  };

  return (
    <div
      onClick={() => {
        triggerHaptic('light');
        onOpen(ticket);
      }}
      className={`group relative rounded-2xl p-3.5 border transition-all duration-200 cursor-pointer shadow-lg hover:border-amber-500/50 ${
        ticket.status === 'open'
          ? isSlaBreached
            ? 'bg-rose-950/20 border-rose-500/40 hover:bg-rose-950/30'
            : 'bg-slate-900/80 border-slate-800 hover:bg-slate-800/80'
          : ticket.status === 'deposit_pending'
          ? 'bg-amber-950/20 border-amber-500/30 hover:bg-amber-950/30'
          : ticket.status === 'booked'
          ? 'bg-emerald-950/15 border-emerald-500/25 hover:bg-emerald-950/25'
          : 'bg-slate-900/40 border-slate-800/60 opacity-80'
      }`}
    >
      {/* Top row: Client info & SLA */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500/30 to-amber-300/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-200 text-sm shrink-0">
            {ticket.clientName.slice(0, 1)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-semibold text-white truncate">{ticket.clientName}</span>
              {isVip && (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1 py-0.2 rounded font-medium">
                  VIP
                </span>
              )}
            </div>
            <a
              href={ticket.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 truncate transition-colors"
            >
              <InstagramIcon className="w-3 h-3 text-pink-400 shrink-0" />
              <span>@{ticket.instagramHandle}</span>
            </a>
          </div>
        </div>

        {/* SLA and Status Pill */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="flex items-center gap-1 text-[11px] font-mono">
            <Clock className={`w-3 h-3 ${isSlaBreached ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`} />
            <span className={isSlaBreached ? 'text-rose-300 font-semibold' : 'text-slate-400'}>
              {ticket.createdAt}
            </span>
          </div>
          {getReasonBadge()}
        </div>
      </div>

      {/* Booking preview pill if service is defined */}
      {ticket.booking.serviceName && (
        <div className="mt-2.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-amber-400 shrink-0 font-medium">✂️ {ticket.booking.serviceName}</span>
            {ticket.booking.masterName && (
              <span className="text-slate-400 border-l border-slate-700 pl-2 shrink-0">
                Майстер: <strong className="text-slate-200">{ticket.booking.masterName}</strong>
              </span>
            )}
            {ticket.booking.time && (
              <span className="text-slate-400 border-l border-slate-700 pl-2 shrink-0">
                {ticket.booking.time}
              </span>
            )}
          </div>

          {ticket.booking.depositRequired && ticket.booking.depositAmount && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 shrink-0">
              <Coins className="w-3 h-3" />
              {ticket.booking.depositAmount} ₴
            </span>
          )}
        </div>
      )}

      {/* Last message preview */}
      <div className="mt-2 text-xs text-slate-300 line-clamp-2 bg-slate-950/30 p-2 rounded-lg border border-slate-800/40 italic">
        «{ticket.lastClientMessage}»
      </div>

      {/* Footer: Admin assignment & Actions */}
      <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/60">
        <div className="flex items-center gap-1 text-xs text-slate-400">
          {ticket.assignedAdmin ? (
            <span className="flex items-center gap-1 text-cyan-300 font-medium">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Веде: {ticket.assignedAdmin}</span>
            </span>
          ) : ticket.status === 'ai_active' ? (
            <span className="text-sky-400 font-medium">🤖 Бот самостійно відповідає</span>
          ) : (
            <span className="text-rose-400 font-medium">Потрібен адміністратор</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!ticket.assignedAdmin && ticket.status === 'open' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                triggerHaptic('medium');
                onTake(ticket);
              }}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              ✋ Беру
            </button>
          )}

          {ticket.status === 'deposit_pending' && (
            <span className="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Очікує квитанцію
            </span>
          )}

          {ticket.status === 'booked' && (
            <span className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Оформлено</span>
            </span>
          )}

          <div className="flex items-center text-xs text-amber-400 font-medium group-hover:translate-x-0.5 transition-transform">
            <span>Картка</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
