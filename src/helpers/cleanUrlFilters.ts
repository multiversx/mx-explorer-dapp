export const cleanUrlFilters = (filters?: Record<string, any>) => {
  if (!filters) {
    return {};
  }

  return Object.entries(filters).reduce(
    (a: Record<string, any>, [k, v]) =>
      v === undefined || String(v) === '' ? a : ((a[k] = v), a),
    {}
  );
};
