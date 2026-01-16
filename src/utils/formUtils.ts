export function normaliseInput(input: string): string {
  return input.replace(/\s+/g, ' ').trim();
}

export function isEmailValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normaliseInput(email));
}

export function isMessageValid(message: string): boolean {
  return normaliseInput(message).length > 10;
}
