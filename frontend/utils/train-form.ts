import type { TrainInput } from '../lib/api';
import { compareDateTimeValues, toDateTimeLocal, toSqlDateTime } from './date';

export const TRAIN_DIRECTIONS = ['Northbound', 'Southbound'] as const;
export const TRAIN_STATIONS = ['Central Station', 'East Station'] as const;

type TrainFormPreparationResult =
  | { ok: false; error: string }
  | { ok: true; payload: TrainInput };

export function prepareTrainFormSubmission(form: TrainInput): TrainFormPreparationResult {
  if (!form.trainNumber.trim()) {
    return { ok: false, error: 'Train number is required' };
  }

  if (form.trainNumber.trim().length > 50) {
    return { ok: false, error: 'Train number must be at most 50 characters.' };
  }

  if (!form.departureTime || !form.arrivalTime) {
    return { ok: false, error: 'Departure and arrival times are required' };
  }

  const departureTime = toSqlDateTime(form.departureTime);
  const arrivalTime = toSqlDateTime(form.arrivalTime);

  if (!departureTime || !arrivalTime) {
    return { ok: false, error: 'Departure and arrival times must be valid dates.' };
  }

  if (compareDateTimeValues(arrivalTime, departureTime) < 0) {
    return { ok: false, error: 'Arrival time must be same or after departure time' };
  }

  return {
    ok: true,
    payload: {
      ...form,
      departureTime,
      arrivalTime,
    },
  };
}

export function buildTrainFormState(initial: Partial<TrainInput> = {}): TrainInput {
  return {
    trainNumber: initial.trainNumber ?? '',
    direction: initial.direction ?? TRAIN_DIRECTIONS[0],
    station: initial.station ?? TRAIN_STATIONS[0],
    departureTime: initial.departureTime ? toDateTimeLocal(initial.departureTime) : '',
    arrivalTime: initial.arrivalTime ? toDateTimeLocal(initial.arrivalTime) : '',
  };
}

export function normalizeTrainInput(data: TrainInput) {
  return {
    ...data,
    departureTime: toSqlDateTime(data.departureTime) || data.departureTime,
    arrivalTime: toSqlDateTime(data.arrivalTime) || data.arrivalTime,
  };
}

export function normalizePartialTrainInput(data: Partial<TrainInput>) {
  return {
    ...data,
    ...(data.departureTime
      ? { departureTime: toSqlDateTime(data.departureTime) || data.departureTime }
      : {}),
    ...(data.arrivalTime
      ? { arrivalTime: toSqlDateTime(data.arrivalTime) || data.arrivalTime }
      : {}),
  };
}
