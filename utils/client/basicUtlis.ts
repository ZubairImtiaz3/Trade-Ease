// Format the amount
export const formatedCurrency = (
  amount: number | null,
  currencyCode: string = "PKR"
): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
  }).format(amount || 0);
};
