import { FormEvent, useState } from 'react';
import { TrainInput } from '../lib/api';

type Props = {
  initial?: Partial<TrainInput>;
  onCancel: () => void;
  onSubmit: (data: TrainInput) => void;
};

function toDateTimeLocal(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function formatSqlDate(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  const hours = String(value.getHours()).padStart(2, '0');
  const minutes = String(value.getMinutes()).padStart(2, '0');
  const seconds = String(value.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function toSqlDateTime(value: string) {
  if (!value) {
    return '';
  }

  const dateTimeLocal = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
  const dateTimeLocalSeconds = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;

  if (dateTimeLocalSeconds.test(value)) {
    return value.replace('T', ' ');
  }
  if (dateTimeLocal.test(value)) {
    return `${value.replace('T', ' ')}:00`;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return formatSqlDate(date);
}

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
    if (!form.trainNumber.trim()) {
      setError('Train number is required');
      return;
    }
    if (form.trainNumber.trim().length > 50) {
      setError('Train number must be at most 50 characters.');
      return;
    }
    if (!form.departureTime || !form.arrivalTime) {
      setError('Departure and arrival times are required');
      return;
    }
    if (new Date(form.arrivalTime) < new Date(form.departureTime)) {
      setError('Arrival time must be same or after departure time');
      return;
    }
    const departureTime = toSqlDateTime(form.departureTime);
    const arrivalTime = toSqlDateTime(form.arrivalTime);
    if (!departureTime || !arrivalTime) {
      console.error('TrainForm invalid time values', { departureTime: form.departureTime, arrivalTime: form.arrivalTime });
      setError('Departure and arrival times must be valid dates.');
      return;
    }
    const payload: TrainInput = {
      ...form,
      departureTime,
      arrivalTime,
    };
    console.log('TrainForm submit payload', payload);
    setError(null);
    onSubmit(payload);
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
