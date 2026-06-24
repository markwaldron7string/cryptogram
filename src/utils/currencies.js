export const CURRENCIES = [
  { code: "usd", symbol: "$", label: "USD" },
  { code: "eur", symbol: "€", label: "EUR" },
  { code: "gbp", symbol: "£", label: "GBP" },
  { code: "jpy", symbol: "¥", label: "JPY" },
  { code: "cad", symbol: "C$", label: "CAD" },
  { code: "aud", symbol: "A$", label: "AUD" },
  { code: "chf", symbol: "Fr", label: "CHF" },
  { code: "cny", symbol: "¥", label: "CNY" },
  { code: "inr", symbol: "₹", label: "INR" },
  { code: "krw", symbol: "₩", label: "KRW" },
  { code: "sgd", symbol: "S$", label: "SGD" },
  { code: "hkd", symbol: "HK$", label: "HKD" },
  { code: "nok", symbol: "kr", label: "NOK" },
  { code: "sek", symbol: "kr", label: "SEK" },
  { code: "dkk", symbol: "kr", label: "DKK" },
  { code: "pln", symbol: "zł", label: "PLN" },
  { code: "brl", symbol: "R$", label: "BRL" },
  { code: "mxn", symbol: "MX$", label: "MXN" },
  { code: "try", symbol: "₺", label: "TRY" },
  { code: "rub", symbol: "₽", label: "RUB" },
  { code: "zar", symbol: "R", label: "ZAR" },
  { code: "thb", symbol: "฿", label: "THB" },
  { code: "aed", symbol: "د.إ", label: "AED" },
  { code: "ils", symbol: "₪", label: "ILS" },
  { code: "nzd", symbol: "NZ$", label: "NZD" },
  { code: "php", symbol: "₱", label: "PHP" },
  { code: "twd", symbol: "NT$", label: "TWD" },
  { code: "czk", symbol: "Kč", label: "CZK" },
  { code: "huf", symbol: "Ft", label: "HUF" },
  { code: "clp", symbol: "CLP$", label: "CLP" },
];

export const getCurrency = (code) =>
  CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];

export const PAGE_SIZE_OPTIONS = [25, 50, 100];
