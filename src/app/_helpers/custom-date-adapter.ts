import { NativeDateAdapter } from '@angular/material';
import * as moment from 'moment';

export class CustomDateAdapter extends NativeDateAdapter {
  format(date: Date): string {
    moment.locale('pl');
    const formatString = 'DD.MM.YYYY';
    return moment(date).format(formatString);
  }
}
