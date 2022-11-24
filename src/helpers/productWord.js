export default function productWord(amountItem) {
  const words = ['товар', 'товара', 'товаров'];
  const num = amountItem % 10;
  if (amountItem > 10 && amountItem < 20) return words[2];
  if (num > 1 && num < 5) return words[1];
  if (num === 1) return words[0];
  return words[2];
}
