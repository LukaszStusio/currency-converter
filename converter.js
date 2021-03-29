console.log('Works fine.');

const currencies = {
  USD: 'United States Dollar',
  AUD: 'Australian Dollar',
  BGN: 'Bulgarian Lev',
  BRL: 'Brazilian Real',
  CAD: 'Canadian Dollar',
  CHF: 'Swiss Franc',
  CNY: 'Chinese Yuan',
  CZK: 'Czech Republic Koruna',
  DKK: 'Danish Krone',
  GBP: 'British Pound Sterling',
  HKD: 'Hong Kong Dollar',
  HRK: 'Croatian Kuna',
  HUF: 'Hungarian Forint',
  IDR: 'Indonesian Rupiah',
  ILS: 'Israeli New Sheqel',
  INR: 'Indian Rupee',
  JPY: 'Japanese Yen',
  KRW: 'South Korean Won',
  MXN: 'Mexican Peso',
  MYR: 'Malaysian Ringgit',
  NOK: 'Norwegian Krone',
  NZD: 'New Zealand Dollar',
  PHP: 'Philippine Peso',
  PLN: 'Polish Zloty',
  RON: 'Romanian Leu',
  RUB: 'Russian Ruble',
  SEK: 'Swedish Krona',
  SGD: 'Singapore Dollar',
  THB: 'Thai Baht',
  TRY: 'Turkish Lira',
  ZAR: 'South African Rand',
  EUR: 'Euro',
};
const fromSelect = document.querySelector('[name="from_currency"]');
const fromInput = document.querySelector('[name="from_amount"]');
const toSelect = document.querySelector('[name="to_currency"]');
const toOutput = document.querySelector('.to_amount');
const form = document.querySelector('.app form');
const endpoint = 'https://api.exchangeratesapi.io/latest';
const ratesByBase = {};

async function fetchRates(base = 'EUR') {
  const res = fetch(`${endpoint}?base=${base}`);
  const rates = await (await res).json();
  // console.log(rates);
  return rates;
}

async function convert(amount, from, to) {
  // avoid fetching rates each time you write a number. Create object ratesByBase.
  // first check if we have the rates to convert from that currency
  if(!ratesByBase[from]) {
    console.log(`We don't have ${from} to convert to ${to}. So let's go to get it!`);
  }

  const rates = await fetchRates(from);
  console.log(rates);

  // store them for the next time
  ratesByBase[from] = rates;

  // convert that amount that was passed in
  const rate = ratesByBase[from].rates[to];
  const convertedAmount = rate * amount;
  console.log(`${amount} ${from} is ${convertedAmount} in ${to}.`);
  return convertedAmount;
}

function generateOptions(options) {
    return Object.entries(options)
        .map(
            ([currencyCode, currencyName]) =>
            `<option value="${currencyCode}">${currencyCode} - ${currencyName}</option>`
        )
        .join('');
}

function formatCurrency(amount, currency) {
  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

async function handleInput(e) {
  const rawAmount = await convert(
    fromInput.value,
    fromSelect.value,
    toSelect.value
  );
  console.log(rawAmount);
  toOutput.textContent = formatCurrency(rawAmount, toSelect.value);
}

const optionsHTML = generateOptions(currencies);
// populate the options:
fromSelect.innerHTML = optionsHTML;
toSelect.innerHTML = optionsHTML;

// event listeners
form.addEventListener('input', handleInput);