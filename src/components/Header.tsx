import React from 'react';
import { Sparkles, User, HelpCircle, Code2, MapPin } from 'lucide-react';
import { triggerHaptic } from '../utils/telegram';

interface HeaderProps {
  currentAdmin: string;
  onAdminChange: (name: string) => void;
  onOpenComparison: () => void;
  onOpenN8nInspector: () => void;
  openTicketsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentAdmin,
  onAdminChange,
  onOpenComparison,
  onOpenN8nInspector,
  openTicketsCount,
}) => {
  const admins = ['Оксана', 'Марта', 'Сергій (Власник)'];

  return (
    <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Salon Branding */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 via-amber-500/10 to-transparent border border-amber-500/30 flex items-center justify-center shrink-0 shadow-inner">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-bold tracking-tight text-white truncate">
                Owned Salon <span className="text-xs font-normal text-amber-400/90 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">Lviv</span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
              <span>Кульпарківська, 96 (Safe Town)</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Compare Button */}
          <button
            onClick={() => {
              triggerHaptic('light');
              onOpenComparison();
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700/70 text-slate-300 hover:text-amber-300 hover:border-amber-500/40 text-xs font-medium transition-all"
            title="Порівняння з Telegram-картками"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Аналіз: Bot vs TMA</span>
          </button>

          {/* n8n Webhook Inspector */}
          <button
            onClick={() => {
              triggerHaptic('light');
              onOpenN8nInspector();
            }}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-900 border border-slate-700/70 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 text-xs font-medium transition-all flex items-center gap-1"
            title="Схема взаємодії з n8n"
          >
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">n8n Live</span>
          </button>

          {/* Admin Switcher */}
          <div className="relative">
            <select
              value={currentAdmin}
              onChange={(e) => {
                triggerHaptic('selection');
                onAdminChange(e.target.value);
              }}
              className="appearance-none bg-slate-900 border border-slate-700/80 text-amber-200 text-xs font-medium rounded-lg pl-7 pr-3 py-1.5 cursor-pointer focus:outline-none focus:border-amber-500"
            >
              {admins.map((name) => (
                <option key={name} value={name} className="bg-slate-900 text-white">
                  {name}
                </option>
              ))}
            </select>
            <User className="w-3.5 h-3.5 text-amber-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Live SLA notification banner if hot tickets exist */}
      {openTicketsCount > 0 && (
        <div className="max-w-4xl mx-auto mt-2 flex items-center justify-between bg-amber-500/10 border border-amber-500/25 px-3 py-1.5 rounded-lg text-[12px] text-amber-300">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>У черзі <strong>{openTicketsCount}</strong> звернення, що очікують відповіді адміністраторки</span>
          </div>
          <span className="text-[11px] text-amber-400/80 font-mono">SLA &lt; 15 хв</span>
        </div>
      )}
    </header>
  );
};
