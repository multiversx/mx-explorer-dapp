export const capitalize = (str: string) => {
  const arr = str.split(' ');

  const output = arr.reduce<string[]>((acc, curr) => {
    acc.push(curr.charAt(0).toUpperCase() + curr.slice(1));
    return acc;
  }, []);

  return output.join(' ');
};
