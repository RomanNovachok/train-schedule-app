import { UserRole } from './user-roles';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

async function request<T>(path: string, options: RequestInit = {}) {
  const response = await fetch(`${apiUrl}${path}`, {
    cache: 'no-store',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let body: any = null;
  try {
    body = JSON.parse(text);
  } catch {}

  if (!response.ok) {
    let message = `Request failed: ${response.status} ${response.statusText}`;
    if (body?.message) {
      message = Array.isArray(body.message) ? body.message.join('\n') : String(body.message);
    } else if (body?.error) {
      message = String(body.error);
    } else if (text) {
      message = text;
    }

    console.error('API error response', {
      path,
      status: response.status,
      statusText: response.statusText,
      body,
      text,
    });
    throw new Error(message);
  }

  return body as T;
}

export type AuthResponse = {
  accessToken: string;
  user: { id: number; email: string; role: UserRole };
};

export type Train = {
  id: number;
  trainNumber: string;
  direction: string;
  station: string;
  departureTime: string;
  arrivalTime: string;
};

export type TrainInput = {
  trainNumber: string;
  direction: string;
  station: string;
  departureTime: string;
  arrivalTime: string;
};

export async function getTrains() {
  return request<Train[]>('/trains');
}

export async function register(email: string, password: string) {
  return request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function login(email: string, password: string) {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
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

function normalizeTrainInput(data: TrainInput) {
  const normalizeDate = (value: string) => {
    if (!value) return value;
    const dateTimeLocal = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
    const dateTimeLocalSeconds = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
    if (dateTimeLocalSeconds.test(value)) {
      return value.replace('T', ' ');
    }
    if (dateTimeLocal.test(value)) {
      return `${value.replace('T', ' ')}:00`;
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return formatSqlDate(date);
  };

  return {
    ...data,
    departureTime: normalizeDate(data.departureTime),
    arrivalTime: normalizeDate(data.arrivalTime),
  };
}

export async function createTrain(token: string, data: TrainInput) {
  const payload = normalizeTrainInput(data);
  return request<Train>('/trains', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function updateTrain(token: string, id: number, data: Partial<TrainInput>) {
  const normalizeDate = (value?: string) => {
    if (!value) return value;
    const dateTimeLocal = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
    const dateTimeLocalSeconds = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
    if (dateTimeLocalSeconds.test(value)) return value.replace('T', ' ');
    if (dateTimeLocal.test(value)) return `${value.replace('T', ' ')}:00`;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return formatSqlDate(date);
  };

  const normalized = {
    ...data,
    ...(data.departureTime ? { departureTime: normalizeDate(data.departureTime) } : {}),
    ...(data.arrivalTime ? { arrivalTime: normalizeDate(data.arrivalTime) } : {}),
  };

  return request<Train>(`/trains/${id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(normalized),
  });
}

export async function deleteTrain(token: string, id: number) {
  return request<{ id: number }>(`/trains/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}
