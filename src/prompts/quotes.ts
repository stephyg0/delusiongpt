const quotes = [
  "Revenue is temporary. Aura is forever.",
  "The market cannot reject what it has not yet developed language for.",
  "A roadmap is just a prophecy with columns.",
  "Retention begins when reality decides to stay.",
  "Your burn rate is only frightening to people without cinematic instincts.",
  "The best founders do not pivot. They rotate the universe slightly."
];

export function getDailyQuote(date = new Date()): string {
  const key = Number(`${date.getFullYear()}${date.getMonth()}${date.getDate()}`);
  return quotes[key % quotes.length];
}
