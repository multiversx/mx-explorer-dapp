export const isEgldToken = (name?: string) => {
  if (!name) {
    return false;
  }
  return ['egld', 'xegld', 'wegld'].includes(name?.toLowerCase());
};
