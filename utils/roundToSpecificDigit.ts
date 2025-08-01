export function roundToSpecifiedDigit(num: number, digits: number) {
  const factor = 10 ** (num.toString().length - digits);
  return Math.round(num / factor) * factor;
}
