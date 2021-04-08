const usdValue = ({ amount, usd }: { amount: string; usd: number }) => {
  const sum = (parseFloat(amount) * usd).toFixed(2);
  return parseFloat(sum).toLocaleString('en', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
};

export default usdValue;
