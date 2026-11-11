/** "R34 999" — manual grouping so the server and browser always render the same text. */
export function formatZar(amount: number) {
  return `R${String(Math.round(amount)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`;
}
