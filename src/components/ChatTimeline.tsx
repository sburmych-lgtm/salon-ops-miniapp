import type { DialogueMessage } from '../types';
import { Bot, User, UserCheck } from 'lucide-react';

interface ChatTimelineProps {
  messages: DialogueMessage[];
  clientName: string;
}

export const ChatTimeline: React.FC<ChatTimelineProps> = ({ messages, clientName }) => {
  return (
    <div className="space-y-3 py-2">
      {messages.map((m) => {
        const isClient = m.author === 'client';
        const isBot = m.author === 'bot';
        const isAdmin = m.author === 'human';

        return (
          <div
            key={m.id}
            className={`flex flex-col ${isClient ? 'items-start' : 'items-end'}`}
          >
            {/* Author label + time */}
            <div className="flex items-center gap-1.5 px-2 mb-1 text-[11px] text-slate-400">
              {isClient && (
                <>
                  <User className="w-3 h-3 text-pink-400" />
                  <span className="font-semibold text-slate-300">{clientName}</span>
                </>
              )}
              {isBot && (
                <>
                  <span className="font-semibold text-sky-300">Бот (C1 Brain)</span>
                  <Bot className="w-3 h-3 text-sky-400" />
                </>
              )}
              {isAdmin && (
                <>
                  <span className="font-semibold text-amber-300">Адміністраторка</span>
                  <UserCheck className="w-3 h-3 text-amber-400" />
                </>
              )}
              <span className="text-[10px] text-slate-500 font-mono">· {m.time}</span>
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-md ${
                isClient
                  ? 'bg-slate-800 text-slate-100 rounded-tl-sm border border-slate-700/80'
                  : isBot
                  ? 'bg-gradient-to-r from-sky-950/70 to-slate-900 text-sky-100 rounded-tr-sm border border-sky-500/30'
                  : 'bg-gradient-to-r from-amber-950/70 to-slate-900 text-amber-100 rounded-tr-sm border border-amber-500/30'
              }`}
            >
              {m.text}
              {m.intent && (
                <div className="mt-1 pt-1 border-t border-white/10 text-[10px] text-amber-300/80 font-mono">
                  Intent: {m.intent}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
