import { useState } from 'react';
import type { TrainInput } from '../lib/api';
import {
  buildTrainFormState,
  prepareTrainFormSubmission,
  TRAIN_DIRECTIONS,
  TRAIN_STATIONS,
} from '../utils/train-form';

type Props = {
  initial?: Partial<TrainInput>;
  onCancel: () => void;
  onSubmit: (data: TrainInput) => void;
};

const inputClass =
  'block w-full min-w-0 max-w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100';

function getDatePart(value: string) {
  return value.split('T')[0] || '';
}

function getTimePart(value: string) {
  return value.split('T')[1] || '';
}

function updateDateTimeValue(currentValue: string, field: 'date' | 'time', nextValue: string) {
  const date = field === 'date' ? nextValue : getDatePart(currentValue);
  const time = field === 'time' ? nextValue : getTimePart(currentValue);

  if (!date && !time) {
    return '';
  }

  return `${date}T${time}`;
}

export default function TrainForm({ initial = {}, onCancel, onSubmit }: Props) {
  const [form, setForm] = useState<TrainInput>(buildTrainFormState(initial));
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof TrainInput, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const result = prepareTrainFormSubmission(form);

    if (!result.ok) {
      if (result.error === 'Departure and arrival times must be valid dates.') {
        console.error('TrainForm invalid time values', {
          departureTime: form.departureTime,
          arrivalTime: form.arrivalTime,
        });
      }

      setError(result.error);
      return;
    }

    console.log('TrainForm submit payload', result.payload);
    setError(null);
    onSubmit(result.payload);
  };

  return (
    <form
      className="grid min-w-0 gap-5 overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)]"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-slate-700">Train number</label>
        <input
          className={inputClass}
          value={form.trainNumber}
          onChange={(e) => handleChange('trainNumber', e.target.value)}
          placeholder="e.g. 101A"
          maxLength={50}
        />
      </div>

      <div className="grid min-w-0 gap-5 lg:grid-cols-2">
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-slate-700">Direction</label>
          <select
            className={inputClass}
            value={form.direction}
            onChange={(e) => handleChange('direction', e.target.value)}
          >
            {TRAIN_DIRECTIONS.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold text-slate-700">Station</label>
          <select
            className={inputClass}
            value={form.station}
            onChange={(e) => handleChange('station', e.target.value)}
          >
            {TRAIN_STATIONS.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid min-w-0 gap-5 lg:grid-cols-2">
        <div className="grid min-w-0 gap-3">
          <label className="text-sm font-semibold text-slate-700">Departure time</label>
          <div className="grid min-w-0 gap-3 min-[480px]:grid-cols-2">
            <input
              className={inputClass}
              type="date"
              value={getDatePart(form.departureTime)}
              onChange={(e) =>
                handleChange('departureTime', updateDateTimeValue(form.departureTime, 'date', e.target.value))
              }
            />
            <input
              className={inputClass}
              type="time"
              value={getTimePart(form.departureTime)}
              onChange={(e) =>
                handleChange('departureTime', updateDateTimeValue(form.departureTime, 'time', e.target.value))
              }
            />
          </div>
        </div>

        <div className="grid min-w-0 gap-3">
          <label className="text-sm font-semibold text-slate-700">Arrival time</label>
          <div className="grid min-w-0 gap-3 min-[480px]:grid-cols-2">
            <input
              className={inputClass}
              type="date"
              value={getDatePart(form.arrivalTime)}
              onChange={(e) =>
                handleChange('arrivalTime', updateDateTimeValue(form.arrivalTime, 'date', e.target.value))
              }
            />
            <input
              className={inputClass}
              type="time"
              value={getTimePart(form.arrivalTime)}
              onChange={(e) =>
                handleChange('arrivalTime', updateDateTimeValue(form.arrivalTime, 'time', e.target.value))
              }
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          type="submit"
        >
          Save
        </button>
        <button
          className="inline-flex items-center justify-center rounded-2xl bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
