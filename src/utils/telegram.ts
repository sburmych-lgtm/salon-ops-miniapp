// Telegram WebApp helper with browser fallbacks

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export function getTelegramWebApp() {
  if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
    return (window as any).Telegram.WebApp;
  }
  return null;
}

export function initTelegramApp() {
  const tg = getTelegramWebApp();
  if (tg) {
    try {
      tg.ready();
      tg.expand();
      // Disable vertical swipe to close if available (API 7.7+)
      if (typeof tg.disableVerticalSwipes === 'function') {
        tg.disableVerticalSwipes();
      }
      // Apply Telegram theme colors if present
      if (tg.themeParams) {
        const root = document.documentElement;
        if (tg.themeParams.bg_color) {
          root.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color);
        }
        if (tg.themeParams.text_color) {
          root.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color);
        }
        if (tg.themeParams.button_color) {
          root.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color);
        }
        if (tg.themeParams.secondary_bg_color) {
          root.style.setProperty('--tg-theme-secondary-bg-color', tg.themeParams.secondary_bg_color);
        }
      }
    } catch (e) {
      console.warn('Telegram WebApp init error', e);
    }
  }
}

export function triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection') {
  const tg = getTelegramWebApp();
  if (!tg?.HapticFeedback) return;
  try {
    if (type === 'selection') {
      tg.HapticFeedback.selectionChanged();
    } else if (type === 'success' || type === 'warning' || type === 'error') {
      tg.HapticFeedback.notificationOccurred(type);
    } else {
      tg.HapticFeedback.impactOccurred(type);
    }
  } catch (e) {
    // Ignore in unsupported environments
  }
}

export function getCurrentUser(): TelegramUser {
  const tg = getTelegramWebApp();
  if (tg?.initDataUnsafe?.user) {
    return tg.initDataUnsafe.user;
  }
  return {
    id: 998877,
    first_name: 'Оксана',
    last_name: '(Адміністратор)',
    username: 'admin_oxana',
  };
}

export function closeTelegramApp() {
  const tg = getTelegramWebApp();
  if (tg) {
    tg.close();
  }
}
