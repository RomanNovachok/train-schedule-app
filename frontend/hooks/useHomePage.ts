import { useEffect, useState } from 'react';
import { clearToken, decodeUser, getToken, UserInfo } from '../lib/auth';
import {
  createTrain,
  deleteTrain,
  getTrains,
  Train,
  TrainInput,
  updateTrain,
} from '../lib/api';

export function useHomePage() {
  const [trains, setTrains] = useState<Train[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [editing, setEditing] = useState<Train | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setUser(decodeUser(token));
    }

    void fetchTrains();
  }, []);

  async function fetchTrains() {
    setLoading(true);
    setError(null);
    try {
      const data = await getTrains();
      setTrains(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(data: TrainInput) {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) throw new Error('Authentication token missing');
      await createTrain(token, data);
      setIsFormOpen(false);
      await fetchTrains();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(data: TrainInput) {
    if (!user || !editing) return;

    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) throw new Error('Authentication token missing');
      await updateTrain(token, editing.id, data);
      setEditing(null);
      setIsFormOpen(false);
      await fetchTrains();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) throw new Error('Authentication token missing');
      await deleteTrain(token, id);
      await fetchTrains();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setIsFormOpen(true);
  }

  function openEdit(train: Train) {
    setEditing(train);
    setIsFormOpen(true);
  }

  function closeForm() {
    setEditing(null);
    setIsFormOpen(false);
  }

  function handleLogout() {
    clearToken();
    setUser(null);
  }

  return {
    closeForm,
    editing,
    error,
    handleCreate,
    handleDelete,
    handleLogout,
    handleUpdate,
    isFormOpen,
    loading,
    openCreate,
    openEdit,
    trains,
    user,
  };
}
