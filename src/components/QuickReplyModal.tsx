import React, { useState } from 'react';
import type { Ticket } from '../types';
import { X, Send, Sparkles, MapPin, CreditCard, Calendar } from 'lucide-react';
import { triggerHaptic } from '../utils/telegram';

interface QuickReplyModalProps {
  ticket: Ticket;
  onClose: () => void;
  onSend: (ticketId: string, message: string) => void;
}

export const QuickReplyModal: React.FC<QuickReplyModalProps> = ({
  ticket,
  onClose,
  onSend,
}) => {
  const [customText, setCustomText] = useState('');

  const templates = [
    {
      title: 'Підтвердження запису',
      icon: Calendar,
      text: `Запис підтверджено: ${ticket.booking.serviceName || 'послуга'}, майстер ${ticket.booking.masterName || 'Саша'}, ${ticket.booking.date || 'четвер'} о ${ticket.booking.time || '15:00'}.\n\nЛьвів, вул. Кульпарківська, 96 (Safe Town).\nЯкщо захочете додати щось того ж дня — напишіть, підберемо час 🤍`,
    },
    {
      title: 'Реквізити на завдаток',
      icon: CreditCard,
      text: `Для закріплення запису надішліть, будь ласка, завдаток ${ticket.booking.depositAmount || 300} грн:\nIBAN: UA123456789012345678901234567\nОдержувач: ФОП Бурмич С.\nПризначення: завдаток за послуги (${ticket.clientName})\n\nПісля оплати надішліть скріншот чеку сюди в повідомлення ✨`,
    },
    {
      title: 'Локація салону',
      icon: MapPin,
      text: `Чекаємо на вас за адресою:\n📍 м. Львів, вул. Кульпарківська, 96 (ЖК Safe Town, біля головного входу).\nМаршрут на Google Maps: https://maps.app.goo.gl/salon-safe-town\n\nЯкщо виникатимуть труднощі з навігацією — телефонуйте: +380 67 000 00 00 🤍`,
    },
    {
      title: 'Уточнення деталей',
      icon: Sparkles,
      text: `Доброго дня, ${ticket.clientName}! Підкажіть, будь ласка, чи є у вас додаткові побажання до майстра або фото бажаного результату? Будемо раді переглянути перед візитом ✨`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white">Швидка відповідь в Instagram Direct</h3>
            <p className="text-xs text-slate-400">Клієнт: {ticket.clientName} (@{ticket.instagramHandle})</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Templates list */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-300 block">Готові шаблони салону:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {templates.map((tpl, i) => {
                const Icon = tpl.icon;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      triggerHaptic('selection');
                      setCustomText(tpl.text);
                    }}
                    className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/50 text-left transition-all text-xs group"
                  >
                    <div className="flex items-center gap-1.5 font-semibold text-amber-300 mb-1">
                      <Icon className="w-3.5 h-3.5 text-amber-400" />
                      <span>{tpl.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{tpl.text}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Textarea */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-300 block">Текст повідомлення клієнту:</span>
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              rows={4}
              placeholder="Введіть текст повідомлення або оберіть шаблон зверху..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-sans"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
          >
            Скасувати
          </button>
          <button
            disabled={!customText.trim()}
            onClick={() => {
              triggerHaptic('success');
              onSend(ticket.id, customText);
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Надіслати в Direct</span>
          </button>
        </div>
      </div>
    </div>
  );
};
