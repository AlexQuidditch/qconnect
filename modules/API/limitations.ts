// @ts-ignore
import { getUrlWithParams } from '../util/qs';

export const PREMIUM_DOMAIN = 'https://vip.qtconnect.ru/';
export const DEFAULT_DOMAIN = 'https://qtconnect.ru/';

export const MAX_PEOPLE_ALLOWED = 110;
export const TIME_LIMITATION = 60000 * 50;
export const TIME_TILL_NOTIFICATION = 60000 * 40;

const premiumDomainRegex = new RegExp(PREMIUM_DOMAIN);

export const isDomainPremium = premiumDomainRegex.test(window.location.href);

export function redirectToPremium(query: Record<string, any>): void {
  window.location.href = getUrlWithParams(PREMIUM_DOMAIN, query);
}

export function redirectToDefault(query: Record<string, any>): void {
  window.location.href = getUrlWithParams(DEFAULT_DOMAIN, query);
}

export async function getUserByHash(name?: string): Promise<string> {
  const username = name || localStorage.getItem('username');
  const res = await fetch('https://bot.quasaria.ru/bot/redirect/get-hash', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ username })
  });

  const result = await res.json();

  if (result.hash) {
    return result.hash;
  }

  return '';
}

export async function checkUserByHash(hash?: string): Promise<string> {
  const urlParams = new URLSearchParams(window.location.search.split('?')[1]);
  const err = urlParams.get('error');

  if (err) {
    throw err.toString();
  }

  if (!hash) {
    return '';
  }

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

  return '';
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
