import { DetailItem, DetailItemUIType } from './DetailItem';

export interface DescriptionDetailItemUIType extends DetailItemUIType {
  description: string;
}

export const DescriptionDetailItem = ({
  title,
  description,
  ...props
}: DescriptionDetailItemUIType) => {
  return (
    <DetailItem title={title || 'Description'} {...props}>
      {description}
    </DetailItem>
  );
};
