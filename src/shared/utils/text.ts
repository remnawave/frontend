export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function firstLetters(text: string) {
  return text
    .split(' ')
    .map((word) => word[0])
    .join('');
}
