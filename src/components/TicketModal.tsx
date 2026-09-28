import React, { useState } from 'react';
import type { Ticket, BookingState } from '../types';
import { ChatTimeline } from './ChatTimeline';
import { BookingForm } from './BookingForm';
import { InstagramIcon } from './InstagramIcon';
import {
  X,
  Copy,
  CalendarCheck,
  UserCheck,
  Bot,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Clock,
  Send,
} from 'lucide-react';
import { triggerHaptic } from '../utils/telegram';

interface TicketModalProps {
  ticket: Ticket;
  onClose: () => void;
  onConfirmBooking: (ticketId: string, booking: BookingState) => void;
  onTakeConversation: (ticketId: string) => void;
  onResumeBot: (ticketId: string) => void;
  onOpenQuickReply: (ticket: Ticket) => void;
  onCopyCrmNotes: (notes: string) => void;
  currentAdmin?: string;
}

export const TicketModal: React.FC<TicketModalProps> = ({
  ticket,
  onClose,
  onConfirmBooking,
  onTakeConversation,
  onResumeBot,
  onOpenQuickReply,
  onCopyCrmNotes,
}) => {
  const [activeTab, setActiveTab] = useState<'booking' | 'chat'>('booking');
  const [currentBooking, setCurrentBooking] = useState<BookingState>(ticket.booking);

  // Auto-generate updated CRM note based on form edits
  const generatedCrmNote = `${currentBooking.serviceName || 'Послуга'} · Клієнт: ${ticket.clientName} (@${ticket.instagramHandle}) · ${currentBooking.date ? `${currentBooking.date} ` : ''}${currentBooking.time || ''} · Майстер: ${currentBooking.masterName || 'Будь-хто'}${currentBooking.depositRequired ? ` · Завдаток: ${currentBooking.depositAmount || 300} ₴` : ' · Без завдатку'}`;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/80 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500/30 to-amber-300/10 border border-amber-500/40 flex items-center justify-center font-bold text-amber-200 text-sm shrink-0">
            {ticket.clientName.slice(0, 1)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-bold text-white truncate">{ticket.clientName}</h2>
              {ticket.vipStatus && (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-semibold">
                  VIP
                </span>
              )}
            </div>
            <a
              href={ticket.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
            >
              <InstagramIcon className="w-3 h-3 text-pink-400 shrink-0" />
              <span>@{ticket.instagramHandle}</span>
              <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>{ticket.createdAt}</span>
          </div>
          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700/80 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CRM Quick Copy Banner */}
      <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between gap-2 shrink-0">
        <div className="min-w-0 text-xs">
          <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">
            Нотатки для BookOn / CRM:
          </span>
          <p className="text-slate-200 truncate font-mono text-[11px]">
            {generatedCrmNote}
          </p>
        </div>
        <button
          onClick={() => {
            triggerHaptic('medium');
            onCopyCrmNotes(generatedCrmNote);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold shrink-0 transition-all active:scale-95"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Скопіювати</span>
        </button>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center border-b border-slate-800 bg-slate-950 px-4 shrink-0">
        <button
          onClick={() => {
            triggerHaptic('selection');
            setActiveTab('booking');
          }}
          className={`flex items-center gap-2 py-2.5 px-4 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'booking'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Параметри запису</span>
        </button>
        <button
          onClick={() => {
            triggerHaptic('selection');
            setActiveTab('chat');
          }}
          className={`flex items-center gap-2 py-2.5 px-4 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'chat'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Контекст діалогу ({ticket.dialogue.length})</span>
        </button>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {/* AI Action Hint */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200/90">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-amber-300">Підказка ШІ-асистента: </span>
            {ticket.aiSuggestedAction}
          </div>
        </div>

        {activeTab === 'booking' ? (
          <BookingForm
            booking={currentBooking}
            onChange={(updated) => setCurrentBooking(updated)}
          />
        ) : (
          <ChatTimeline messages={ticket.dialogue} clientName={ticket.clientName} />
        )}
      </div>

      {/* Fixed Sticky Action Bar at Bottom (Native Telegram Style) */}
      <div className="p-3 bg-slate-950/95 border-t border-slate-800/90 shrink-0 space-y-2 pb-[max(12px,env(safe-area-inset-bottom))]">
        {/* Primary Action Button */}
        <button
          onClick={() => {
            triggerHaptic('success');
            onConfirmBooking(ticket.id, currentBooking);
          }}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <CalendarCheck className="w-4 h-4" />
          <span>✅ Оформити запис і надіслати клієнту</span>
        </button>

        {/* Secondary Action Grid */}
        <div className="grid grid-cols-3 gap-2">
          {/* Take Conversation Button */}
          <button
            onClick={() => {
              triggerHaptic('medium');
              onTakeConversation(ticket.id);
            }}
            className="py-2 px-2 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-200 hover:bg-slate-800 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>✋ Взяти (60хв)</span>
          </button>

          {/* Quick Reply Button */}
          <button
            onClick={() => {
              triggerHaptic('medium');
              onOpenQuickReply(ticket);
            }}
            className="py-2 px-2 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-200 hover:bg-slate-800 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Send className="w-3.5 h-3.5 text-pink-400" />
            <span>💬 Відповісти</span>
          </button>

          {/* Resume Bot Button */}
          <button
            onClick={() => {
              triggerHaptic('medium');
              onResumeBot(ticket.id);
            }}
            className="py-2 px-2 rounded-xl bg-slate-900 border border-slate-700/80 text-sky-300 hover:bg-slate-800 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Bot className="w-3.5 h-3.5 text-sky-400" />
            <span>🤖 До бота</span>
          </button>
        </div>
      </div>
    </div>
  );
};
