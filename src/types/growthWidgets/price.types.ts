import { SliceType, TrendEnum } from 'types/general.types';
import { GrowthChartDataType } from 'types/growthWidgets/chart.types';

export interface GrowthPriceType {
  currentPrice: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
}

export interface GrowthPriceSliceType extends SliceType {
  unprocessed: GrowthPriceType;

  currentPrice: string;
  priceChange24h: string;
  marketCap: string;
  volume24h: string;
  priceChangeTrend: TrendEnum;

  price7d: GrowthChartDataType[];
  price30d: GrowthChartDataType[];
  priceAll: GrowthChartDataType[];
}
