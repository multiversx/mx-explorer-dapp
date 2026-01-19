export const cleanUrlFilters = (
  filters?: Record<string, any>,
  options?: { cleanBoolean?: boolean }
) => {
  if (!filters) {
    return {};
  }

  const { cleanBoolean } = options ?? {};

  return Object.entries(filters).reduce(
    (a: Record<string, any>, [k, v]) =>
      v === undefined || String(v) === '' || (cleanBoolean && v === false)
        ? a
        : ((a[k] = v), a),
    {}
  );
};
