export const PREMIUM_DOMAIN = 'https://vip.qtconnect.ru/';
export const DEFAULT_DOMAIN = 'https://qtconnect.ru/';

export const MAX_PEOPLE_ALLOWED = 110;
export const TIME_LIMITATION = 60000 * 50;
export const TIME_TILL_NOTIFICATION = 60000 * 40;

const premiumDomainRegex = new RegExp(PREMIUM_DOMAIN);

const isDomainPremium = premiumDomainRegex.test(window.location.href);

export function redirectToPremium(): void {
  window.location.href = PREMIUM_DOMAIN;
}

export function redirectToDefault(): void {
  window.location.href = DEFAULT_DOMAIN;
}

export async function getUserByHash(): Promise<string> {
  const urlParams = new URLSearchParams(window.location.search.split('?')[1]);
  const err = urlParams.get('error');
  const hash = urlParams.get('userHash');

  if (err) {
    throw err.toString()
  }

  if (isDomainPremium && hash) {
    const res = await fetch('https://bot.quasaria.ru/bot/redirect/check-hash', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ hash })
    });

    const result = await res.json();

    if (result.username) {
      localStorage.setItem('username', result.username);
      return result.username;
    }
  }

  return ''
}

export async function isUserPaid(name?: string): Promise<boolean> {
  const username = name || localStorage.getItem('username');
  let isPayed = false;

  if (username) {
    const res = await fetch('https://bot.quasaria.ru/bot/users/check-on-payed', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ username })
    });
    const json = await res.json();
    isPayed = json.payed;
  }

  return isPayed;
}

