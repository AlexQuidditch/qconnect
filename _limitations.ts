const premiumDomain = 'https://vip.qtconnect.ru/';
const defaultDomain = 'https://qtconnect.ru/';

const premiumDomainRegex = new RegExp(premiumDomain);

const isDomainPremium = premiumDomainRegex.test(window.location.href);

async function isUserPaid(): Promise<boolean> {
  const username = localStorage.getItem('username');
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

const maxPeopleAllowed = 110;
const timeLimitation = 60000 * 50;
const timeTillNotification = 60000 * 40;

export {
  premiumDomain,
  defaultDomain,

  isDomainPremium,
  maxPeopleAllowed,
  timeLimitation,
  isUserPaid,
  timeTillNotification
};
