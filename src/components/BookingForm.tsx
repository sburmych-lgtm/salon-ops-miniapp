import type { BookingState } from '../types';
import { SERVICES, MASTERS } from '../data/mockData';
import { Calendar, Clock, User, Scissors, Coins, Check } from 'lucide-react';
import { triggerHaptic } from '../utils/telegram';

interface BookingFormProps {
  booking: BookingState;
  onChange: (updated: BookingState) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({ booking, onChange }) => {
  const timeSlots = ['09:00', '10:30', '11:30', '14:00', '15:00', '16:30', '18:00', '19:30'];
  const depositPresets = [300, 500, 1000];

  const handleServiceChange = (serviceId: string) => {
    triggerHaptic('selection');
    const s = SERVICES.find((item) => item.id === serviceId);
    if (s) {
      onChange({
        ...booking,
        serviceId: s.id,
        serviceName: s.name,
        durationMin: s.durationMin,
      });
    }
  };

  const handleMasterChange = (masterId: string) => {
    triggerHaptic('selection');
    const m = MASTERS.find((item) => item.id === masterId);
    if (m) {
      onChange({
        ...booking,
        masterId: m.id,
        masterName: m.name,
      });
    }
  };

  const handleDateQuickPick = (daysOffset: number) => {
    triggerHaptic('selection');
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    const dateStr = d.toISOString().split('T')[0];
    onChange({
      ...booking,
      date: dateStr,
    });
  };

  return (
    <div className="space-y-4 text-xs">
      {/* 1. Service Selection */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 font-semibold text-slate-300">
          <Scissors className="w-3.5 h-3.5 text-amber-400" />
          <span>Послуга:</span>
        </label>
        <select
          value={booking.serviceId || ''}
          onChange={(e) => handleServiceChange(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-slate-100 font-medium focus:outline-none focus:border-amber-500 cursor-pointer"
        >
          <option value="">-- Оберіть послугу з каталогу --</option>
          {SERVICES.map((s) => (
            <option key={s.id} value={s.id} className="bg-slate-900 text-white">
              {s.name} ({s.priceFrom} ₴ · {s.durationMin} хв)
            </option>
          ))}
        </select>
      </div>

      {/* 2. Master Selection */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 font-semibold text-slate-300">
          <User className="w-3.5 h-3.5 text-amber-400" />
          <span>Майстер:</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {MASTERS.map((m) => {
            const isSelected = booking.masterName === m.name;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => handleMasterChange(m.id)}
                className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-500/80 text-amber-200 shadow-sm'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
                }`}
              >
                <img
                  src={m.avatar}
                  alt={m.name}
                  className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-700"
                />
                <div className="min-w-0">
                  <div className="font-semibold truncate">{m.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{m.role.split('/')[0]}</div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 ml-auto shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Date & Time Selection */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 font-semibold text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Дата та час:</span>
          </label>
          <div className="flex items-center gap-1 text-[11px]">
            <button
              type="button"
              onClick={() => handleDateQuickPick(0)}
              className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              Сьогодні
            </button>
            <button
              type="button"
              onClick={() => handleDateQuickPick(1)}
              className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              Завтра
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            value={booking.date || ''}
            onChange={(e) => {
              triggerHaptic('selection');
              onChange({ ...booking, date: e.target.value });
            }}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-100 font-medium focus:outline-none focus:border-amber-500"
          />
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-100">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium">{booking.time || 'Оберіть слот нижче'}</span>
          </div>
        </div>

        {/* Time slot chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {timeSlots.map((slot) => {
            const isSelected = booking.time === slot;
            return (
              <button
                key={slot}
                type="button"
                onClick={() => {
                  triggerHaptic('selection');
                  onChange({ ...booking, time: slot });
                }}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                    : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {slot}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Deposit Settings */}
      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-semibold text-slate-200">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>Завдаток за бронь</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={booking.depositRequired}
              onChange={(e) => {
                triggerHaptic('medium');
                onChange({
                  ...booking,
                  depositRequired: e.target.checked,
                  depositAmount: e.target.checked ? (booking.depositAmount || 300) : 0,
                  depositStatus: e.target.checked ? 'pending' : 'not_needed',
                });
              }}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
        </div>

        {booking.depositRequired && (
          <div className="space-y-2 pt-1 border-t border-slate-800/60">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px]">Сума:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {depositPresets.map((amt) => {
                  const isChosen = booking.depositAmount === amt;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        triggerHaptic('selection');
                        onChange({ ...booking, depositAmount: amt });
                      }}
                      className={`px-2.5 py-1 rounded-lg border text-xs font-semibold ${
                        isChosen
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {amt} ₴
                    </button>
                  );
                })}
                <input
                  type="number"
                  placeholder="Інша..."
                  value={booking.depositAmount || ''}
                  onChange={(e) =>
                    onChange({ ...booking, depositAmount: Number(e.target.value) || 0 })
                  }
                  className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span>Статус:</span>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('selection');
                  onChange({ ...booking, depositStatus: 'received' });
                }}
                className={`px-2 py-0.5 rounded border ${
                  booking.depositStatus === 'received'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                ✓ Отримано
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('selection');
                  onChange({ ...booking, depositStatus: 'pending' });
                }}
                className={`px-2 py-0.5 rounded border ${
                  booking.depositStatus === 'pending'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                ⏳ Очікуємо
              </button>
            </div>
          </div>
        )}
      </div>

      {/* BookOn Sync Status Preview */}
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px]">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <Check className="w-3.5 h-3.5" />
          <span>Синхронізація з BookOn CRM активна</span>
        </div>
        <span className="text-slate-400 font-mono">ID: {booking.masterName ? `bo-${booking.masterName}` : 'auto'}</span>
      </div>
    </div>
  );
};
