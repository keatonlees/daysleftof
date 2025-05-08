export default function getDigitArray(number: number) {
  const arr = number
    .toString()
    .split("")
    .map((digit) => parseInt(digit, 10));

  if (arr.length < 2) arr.unshift(0);

  return arr;
}
