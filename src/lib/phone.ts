export function toLocalPhone(input: string) {
  return "0" + input.replace(/\D/g, "").replace(/^0/, "");
}

export function isValidPhone(input: string) {
  return /^05\d{8}$/.test(toLocalPhone(input));
}
