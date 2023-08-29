import { DetailItem, DetailItemType } from './DetailItem';

export interface DescriptionDetailItemType extends DetailItemType {
  description: string;
}

export const DescriptionDetailItem = ({
  title,
  description,
  ...props
}: DescriptionDetailItemType) => {
  return (
    <DetailItem title={title || 'Description'} {...props}>
      {description}
    </DetailItem>
  );
};
