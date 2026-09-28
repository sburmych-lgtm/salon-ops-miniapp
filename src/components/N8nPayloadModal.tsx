import React, { useState } from 'react';
import { X, Code2, Copy, Check, Sparkles } from 'lucide-react';
import type { N8nWebhookPayload } from '../types';
import { triggerHaptic } from '../utils/telegram';

interface N8nPayloadModalProps {
  lastPayload: N8nWebhookPayload | null;
  onClose: () => void;
  onCopyPayload: (json: string) => void;
}

export const N8nPayloadModal: React.FC<N8nPayloadModalProps> = ({
  lastPayload,
  onClose,
  onCopyPayload,
}) => {
  const [copied, setCopied] = useState(false);

  // Default sample payload if none was generated yet
  const displayPayload: N8nWebhookPayload = lastPayload || {
    event: 'confirm_booking',
    conversation_id: 477,
    actor: {
      admin_name: 'Оксана',
      telegram_user_id: 998877,
    },
    timestamp: new Date().toISOString(),
    booking: {
      service_id: 'srv-haircut-ends',
      service_name: 'Стрижка кінчиків',
      master_name: 'Саша',
      date: '2026-10-01',
      time: '15:00',
      deposit_required: false,
      deposit_amount: 0,
      deposit_status: 'not_needed',
    },
    message_to_client: 'Запис підтверджено: стрижка кінчиків, майстер Саша, чт 01.10 о 15:00. Safe Town, вул. Кульпарківська, 96 🤍',
  };

  const jsonString = JSON.stringify(displayPayload, null, 2);

  const handleCopy = () => {
    triggerHaptic('success');
    onCopyPayload(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">n8n Webhook Inspector</h2>
              <p className="text-[11px] text-slate-400">
                Структура даних, яку Mini App передає в автоматизацію (WF-10 / Webhook)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-3 text-xs">
          <div className="p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-cyan-200 text-[11px] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>
                Endpoint: <code>POST /webhook/salon-ops-action</code>
              </span>
            </div>
            <span className="bg-cyan-500/20 px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300">
              STATUS 200 OK
            </span>
          </div>

          <div className="relative rounded-xl bg-slate-950 border border-slate-800 p-3 overflow-x-auto font-mono text-[11px] text-emerald-400 leading-relaxed">
            <button
              onClick={handleCopy}
              className="absolute right-3 top-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-sans transition-colors border border-slate-700"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Скопійовано' : 'Скопіювати JSON'}</span>
            </button>
            <pre className="pt-4">{jsonString}</pre>
          </div>

          <div className="text-[11px] text-slate-400 leading-relaxed">
            <strong className="text-slate-300">Перевага для архітектури:</strong> Цей вебхук повністю усуває необхідність у regex-парсингу рядків відповідей з Telegram-чату. Дані вже валідовані на клієнті, прив'язані до <code>conversation_id</code>, і готові для запису у PostgreSQL та виклику <code>WF-90 Send</code>.
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
          >
            Закрити
          </button>
        </div>
      </div>
    </div>
  );
};
