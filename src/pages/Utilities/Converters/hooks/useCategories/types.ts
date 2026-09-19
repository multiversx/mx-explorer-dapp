import { ConverterType } from '../../components/Converter/types';

export interface CategoryType {
  name: string;
  identifier: string;
  converters: ConverterType[];
}
