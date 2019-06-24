import * as moment from 'moment';
import { Tag } from '../../tag/interfaces/tag.interface';

export interface FilterInterface {
  selectedWarranty: string;
  categoryList: Tag[];
  selectedPriceFrom: number;
  selectedPriceTo: number;
  warrantyFrom: moment.Moment;
  warrantyTo: moment.Moment;
  purchaseDateFrom: moment.Moment;
  purchaseDateTo: moment.Moment;
  searchIdList?: string[];
}
