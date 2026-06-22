import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import AuthBanner from '../components/AuthBanner';
import TrainTable from '../components/TrainTable';
import TrainForm from '../components/TrainForm';
import { getToken, decodeUser, clearToken, UserInfo } from '../lib/auth';
import { createTrain, deleteTrain, getTrains, Train, TrainInput, updateTrain } from '../lib/api';

export default function Home() {
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
    fetchTrains();
  }, []);

  const fetchTrains = async () => {
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
  };

  const handleCreate = async (data: TrainInput) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) throw new Error('Authentication token missing');
      await createTrain(token, data);
      setIsFormOpen(false);
      fetchTrains();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data: TrainInput) => {
    if (!user || !editing) return;
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) throw new Error('Authentication token missing');
      await updateTrain(token, editing.id, data);
      setEditing(null);
      setIsFormOpen(false);
      fetchTrains();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) throw new Error('Authentication token missing');
      await deleteTrain(token, id);
      fetchTrains();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setIsFormOpen(true);
  };

  const openEdit = (train: Train) => {
    setEditing(train);
    setIsFormOpen(true);
  };

  const handleLogout = () => {
    clearToken();
    setUser(null);
  };

  return (
    <Layout user={user}>
      <div className="grid" style={{ gap: 20 }}>
        <AuthBanner user={user} onLogout={handleLogout} />
        {user && (
          <div className="card header-row">
            <div>
              <strong>Manage train records</strong>
              <p style={{ margin: 0 }}>Add and edit trains for the public schedule.</p>
            </div>
            <div>
              <button className="button" onClick={openCreate}>
                Add train
              </button>
            </div>
          </div>
        )}
        {isFormOpen && (
          <TrainForm
            initial={editing ? {
              trainNumber: editing.trainNumber,
              direction: editing.direction,
              station: editing.station,
              departureTime: editing.departureTime,
              arrivalTime: editing.arrivalTime,
            } : undefined}
            onCancel={() => setIsFormOpen(false)}
            onSubmit={editing ? handleUpdate : handleCreate}
          />
        )}

        <div className="card">
          <div className="header-row">
            <div>
              <h2>Train schedule</h2>
            </div>
          </div>
          {loading && <div>Loading schedule…</div>}
          {error && (
            <div className="error" style={{ whiteSpace: 'pre-line' }}>
              {error}
            </div>
          )}
          <TrainTable trains={trains} user={user} onEdit={openEdit} onDelete={handleDelete} />
        </div>
      </div>
    </Layout>
  );
}
