export const getChartFilteredData = ({
  data,
  filter,
  category,
  id,
}: {
  data: any;
  filter?: string;
  category?: string;
  id?: string;
}) => {
  if (category) {
    if (filter) {
      if (id) {
        return data[category][id][filter] ?? [];
      }

      return data[category][filter] ?? [];
    }

    return data[category] ?? [];
  }

  if (filter) {
    return data[filter] ?? [];
  }

  return data ?? [];
};
