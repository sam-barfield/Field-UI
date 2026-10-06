// title: Single date
// description: minDate and maxDate compare by day, so passing new Date() keeps today selectable.
import { useState } from 'react';
import { DatePicker } from '@sam.barfield/field-react';

export default function DatePickerBasic() {
  const [date, setDate] = useState<Date | null>(null);
  return (
    <div className="example-col">
      <DatePicker label="Maintenance window" value={date} onChange={setDate} minDate={new Date()} helperText="Pick a day from today onwards." />
    </div>
  );
}
