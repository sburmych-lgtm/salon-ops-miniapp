import React from 'react';
import { X, CheckCircle, XCircle, Zap, Sparkles, MessageSquareCode } from 'lucide-react';

interface ComparisonModalProps {
  onClose: () => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({ onClose }) => {
  const criteria = [
    {
      title: 'Зручність адміністраторки',
      botCard: 'Груповий чат тоне в десятках повідомлень. Потрібно вручну пам’ятати синтаксис відповідей («25.09 14:00 Юля послуга: Стрижка»). Кнопки оновлюються із затримкою.',
      botCardBad: true,
      miniApp: 'Окремий інтерактивний хаб. Черга розділена по вкладках («Потребують дії», «Завдаток», «Записи»). Вибір майстра, послуги та часу візуальними кліками.',
      miniAppGood: true,
    },
    {
      title: 'Швидкість обробки одного ліда',
      botCard: '≈ 2–3 хвилини (перегляд довгого тексту, написання текстового реплаю для коригування часу/майстра, перевірка чи змінилася кнопка).',
      botCardBad: true,
      miniApp: '≈ 20–30 секунд (відкрив картку з Telegram, обрав слот, натиснув «Оформити запис і надіслати клієнту»).',
      miniAppGood: true,
    },
    {
      title: 'Введення та коригування даних',
      botCard: 'Текстовий парсинг регулярними виразами. Будь-яка помилка в написанні імені майстра чи формату дати призводить до помилки у n8n.',
      botCardBad: true,
      miniApp: 'Повністю валідовані форми: випадаючі списки послуг, картки майстрів, календар слотів, швидкі кнопки завдатку (300/500/1000 ₴).',
      miniAppGood: true,
    },
    {
      title: 'Інтеграція з CRM (BookOn)',
      botCard: 'Ручне перенесення даних з повідомлення бота у BookOn, високий ризик помилки у номері телефону чи імені.',
      botCardBad: true,
      miniApp: 'Кнопка «Скопіювати нотатки для CRM» в 1 клік копіює структурований готовий рядок для вставки у BookOn + пряме посилання на картку.',
      miniAppGood: true,
    },
    {
      title: 'Надійність для n8n автоматизації',
      botCard: 'WF-10 містить сотні рядків складного SQL/Regex коду для обробки callback_data та message replies. Обмеження Telegram 4096 символів.',
      botCardBad: true,
      miniApp: 'Mini App надсилає чистий типізований JSON на n8n Webhook: { action, service_id, master_id, slot, deposit }. Жодних регексів і помилок парсингу.',
      miniAppGood: true,
    },
    {
      title: 'Контроль затримки відповідей (SLA)',
      botCard: 'SLA Watch (WF-97) повинен кожні 30 хвилин спамити нагадуваннями в чат, які оператори часто змахують.',
      botCardBad: true,
      miniApp: 'Візуальні кольорові таймери в черзі: Зелений (<5 хв), Жовтий (5-15 хв), Червоний пульсуючий (>15 хв SLA Alert). Жоден клієнт не губиться.',
      miniAppGood: true,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Аналіз ефективності: Telegram Картки vs Mini App
              </h2>
              <p className="text-xs text-slate-400">
                Чому перехід на TMA радикально покращує роботу салону та надійність n8n
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Comparison Table Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {/* Executive Summary */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-slate-900 border border-amber-500/30 text-slate-200 leading-relaxed">
            <span className="font-bold text-amber-300 block mb-1">💡 Головний висновок аналізу:</span>
            Telegram Mini App <strong>НЕ замінює бота повністю, а доповнює його</strong>. Бот миттєво сповіщає про гарячий лід, але замість 5 раундів редагування тексту та криптичних команд у чаті, адміністраторка натискає <em>«📱 Обробити в додатку»</em> — і за 20 секунд оформлює запис у красивому мобільному інтерфейсі.
          </div>

          {/* Matrix items */}
          <div className="space-y-3">
            {criteria.map((c, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2"
              >
                <div className="font-bold text-slate-200 flex items-center gap-2 text-[13px]">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{c.title}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {/* Bot Card */}
                  <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/20 space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-rose-400">
                      <XCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>Telegram Бот-картка (як зараз)</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{c.botCard}</p>
                  </div>

                  {/* Mini App */}
                  <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                      <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>Telegram Mini App (прототип)</span>
                    </div>
                    <p className="text-slate-200 text-[11px] leading-relaxed">{c.miniApp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Architecture Benefits for Automation Machine */}
          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-2">
            <div className="flex items-center gap-2 font-bold text-cyan-300">
              <MessageSquareCode className="w-4 h-4 text-cyan-400" />
              <span>Полегшення для n8n автоматизації:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px] leading-relaxed">
              <li>
                <strong>Ліквідація regex-парсингу в WF-10:</strong> Більше не потрібно парсити тексти з реплаїв, де оператор випадково написав крапку замість двокрапки або зробив помилку в імені майстра.
              </li>
              <li>
                <strong>Атомарні вебхуки:</strong> Одне звернення на n8n Webhook передає чистий JSON-об'єкт, який одразу йде у базу даних та відправляє підтвердження клієнту в WF-90.
              </li>
              <li>
                <strong>Зниження лімітів n8n executions:</strong> Замість 4–6 тригерів редагування картки на один запис (вибір завдатку, введення суми, створення запису) — використовується 1 цільовий виклик.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
          >
            Зрозуміло, повернутися до додатку
          </button>
        </div>
      </div>
    </div>
  );
};
