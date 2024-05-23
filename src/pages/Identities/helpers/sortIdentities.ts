import { IdentityType, SortOrderEnum } from 'types';

export enum SortIdentitesFieldEnum {
  name = 'name',
  locked = 'locked',
  validators = 'validators'
}

export const sortIdentities = ({
  field,
  order,
  sortArray = []
}: {
  field?: SortIdentitesFieldEnum;
  order?: SortOrderEnum;
  sortArray: IdentityType[];
}) => {
  if (field && order) {
    const sortParams = order === SortOrderEnum.asc ? [1, -1] : [-1, 1];

    switch (true) {
      case field === SortIdentitesFieldEnum.name:
        const filteredNames = sortArray.filter((identity) => identity.name);

        filteredNames.sort((a, b) => {
          return a.name.toLowerCase() > b.name.toLowerCase()
            ? sortParams[0]
            : sortParams[1];
        });

        sortArray = [...filteredNames];
        break;

      default:
        sortArray.sort((a: any, b: any) =>
          parseFloat(a[field]) > parseFloat(b[field])
            ? sortParams[0]
            : sortParams[1]
        );
        break;
    }
  }

  return sortArray;
};
