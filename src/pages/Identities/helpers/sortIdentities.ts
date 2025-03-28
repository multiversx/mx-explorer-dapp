import BigNumber from 'bignumber.js';
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

    switch (field) {
      case SortIdentitesFieldEnum.name:
        const filteredNames = sortArray.filter((identity) => identity.name);

        filteredNames.sort((a, b) => {
          return a.name.toLowerCase() > b.name.toLowerCase()
            ? sortParams[0]
            : sortParams[1];
        });

        return [...filteredNames];

      case SortIdentitesFieldEnum.validators:
        return sortArray.sort((a, b) => {
          const aValidators = new BigNumber(a.validators);
          const bValidators = new BigNumber(b.validators);

          if (aValidators.isEqualTo(bValidators)) {
            return new BigNumber(a.locked).isGreaterThan(b.locked)
              ? sortParams[0]
              : sortParams[1];
          }

          return aValidators.isGreaterThan(bValidators)
            ? sortParams[0]
            : sortParams[1];
        });

      default:
        return sortArray.sort((a: any, b: any) =>
          parseFloat(a[field]) > parseFloat(b[field])
            ? sortParams[0]
            : sortParams[1]
        );
    }
  }

  return sortArray;
};
