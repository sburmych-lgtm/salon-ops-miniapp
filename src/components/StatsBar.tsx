import React from 'react';
import { Search, Flame, Coins, CalendarCheck, Bot, ListFilter } from 'lucide-react';
import { triggerHaptic } from '../utils/telegram';

export type FilterCategory = 'open' | 'deposit' | 'booked' | 'ai_active' | 'all';

interface StatsBarProps {
  activeTab: FilterCategory;
  onTabChange: (tab: FilterCategory) => void;
  counts: {
    open: number;
    deposit: number;
    booked: number;
    ai_active: number;
    all: number;
  };
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  activeTab,
  onTabChange,
  counts,
  searchQuery,
  onSearchChange,
}) => {
  const tabs = [
    {
      id: 'open' as FilterCategory,
      label: 'Потребують дії',
      icon: Flame,
      count: counts.open,
      color: 'text-rose-400',
      activeBg: 'bg-rose-500/20 border-rose-500/40 text-rose-200',
    },
    {
      id: 'deposit' as FilterCategory,
      label: 'Завдаток',
      icon: Coins,
      count: counts.deposit,
      color: 'text-amber-400',
      activeBg: 'bg-amber-500/20 border-amber-500/40 text-amber-200',
    },
    {
      id: 'booked' as FilterCategory,
      label: 'Записи',
      icon: CalendarCheck,
      count: counts.booked,
      color: 'text-emerald-400',
      activeBg: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200',
    },
    {
      id: 'ai_active' as FilterCategory,
      label: 'Веде бот',
      icon: Bot,
      count: counts.ai_active,
      color: 'text-sky-400',
      activeBg: 'bg-sky-500/20 border-sky-500/40 text-sky-200',
    },
    {
      id: 'all' as FilterCategory,
      label: 'Всі',
      icon: ListFilter,
      count: counts.all,
      color: 'text-slate-400',
      activeBg: 'bg-slate-700/40 border-slate-600 text-slate-200',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-3 space-y-2.5">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Пошук клієнта, @instagram, послуги або телефону..."
          className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60 transition-colors shadow-inner"
        />
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded bg-slate-800"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filter Tabs with Badges */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                triggerHaptic('selection');
                onTabChange(tab.id);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? tab.activeBg
                  : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${tab.color}`} />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-semibold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
