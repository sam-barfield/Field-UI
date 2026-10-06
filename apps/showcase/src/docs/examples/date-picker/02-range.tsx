// title: Date range with presets
import { useState } from 'react';
import { DateRangePicker, type DateRange } from '@sam.barfield/field-react';

export default function DateRangeBasic() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return (
    <div className="example-col">
      <DateRangePicker label="Billing period" value={range} onChange={setRange} maxDate={new Date()} />
    </div>
  );
}
