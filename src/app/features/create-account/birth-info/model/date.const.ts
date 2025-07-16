import { DateOptionsModel } from "./add-date-of-birth-request.model";

export const Months: DateOptionsModel[] = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' }
];

export const Dates: DateOptionsModel[] = Array.from(
  { length: 31 },
  (_, i) => ({
    value: (i + 1).toString(),
    label: (i + 1).toString()
  })
)

export const Years: DateOptionsModel[] = Array.from(
  { length: 88 },
  (_, i) => {
    const year = new Date().getFullYear() - 13 - i;
    return {
      value: year.toString(),
      label: year.toString()
    };
  }
)