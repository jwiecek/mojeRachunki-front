import * as moment from 'moment';

export interface FilterInterface {
  selectedWarranty: string;
  selectedCategory: string[];
  selectedPriceFrom: number;
  selectedPriceTo: number;
  resultCount: number;
  warrantyFrom: moment.Moment;
  warrantyTo: moment.Moment;
  purchaseDateFrom: moment.Moment;
  purchaseDateTo: moment.Moment;
  searchIdList?: string[];
}
