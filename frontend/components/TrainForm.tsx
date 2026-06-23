import { useState } from 'react';
import type { TrainInput } from '../lib/api';
import { toDateTimeLocal } from '../utils/date';
import { prepareTrainFormSubmission } from '../utils/train-form';

type Props = {
  initial?: Partial<TrainInput>;
  onCancel: () => void;
  onSubmit: (data: TrainInput) => void;
};

const directions = ['Northbound', 'Southbound'];
const stations = ['Central Station', 'East Station'];

export default function TrainForm({ initial = {}, onCancel, onSubmit }: Props) {
  const [form, setForm] = useState<TrainInput>({
    trainNumber: initial.trainNumber ?? '',
    direction: initial.direction ?? directions[0],
    station: initial.station ?? stations[0],
    departureTime: initial.departureTime ? toDateTimeLocal(initial.departureTime) : '',
    arrivalTime: initial.arrivalTime ? toDateTimeLocal(initial.arrivalTime) : '',
  });
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
    <form className="card grid" onSubmit={handleSubmit}>
      <div className="field">
        <label className="label">Train number</label>
        <input
          className="input"
          value={form.trainNumber}
          onChange={(e) => handleChange('trainNumber', e.target.value)}
          placeholder="e.g. 101A"
          maxLength={50}
        />
      </div>

      <div className="field">
        <label className="label">Direction</label>
        <select className="select" value={form.direction} onChange={(e) => handleChange('direction', e.target.value)}>
          {directions.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label className="label">Station</label>
        <select className="select" value={form.station} onChange={(e) => handleChange('station', e.target.value)}>
          {stations.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label className="label">Departure time</label>
        <input
          className="input"
          type="datetime-local"
          value={form.departureTime}
          onChange={(e) => handleChange('departureTime', e.target.value)}
        />
      </div>

      <div className="field">
        <label className="label">Arrival time</label>
        <input
          className="input"
          type="datetime-local"
          value={form.arrivalTime}
          onChange={(e) => handleChange('arrivalTime', e.target.value)}
        />
      </div>

      {error && <div className="error">{error}</div>}

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button className="button" type="submit">
          Save
        </button>
        <button className="button secondary" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
