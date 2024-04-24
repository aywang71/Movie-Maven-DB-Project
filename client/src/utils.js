export const formatDate = (dateString) => {
    const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

export const formatMoney = (budget) => {
    const abs = Math.abs(Number(budget));
    return '$' + (
        abs >= 1.0e+9
        ? (abs / 1.0e+9).toFixed(1) + 'B'
        : abs >= 1.0e+6
        ? (abs / 1.0e+6).toFixed(1) + 'M'
        : abs >= 1.0e+3
        ? (abs / 1.0e+3).toFixed(1) + 'K'
        : abs
    );
};