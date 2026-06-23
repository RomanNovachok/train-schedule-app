import Layout from '../components/Layout';
import AuthBanner from '../components/AuthBanner';
import TrainTable from '../components/TrainTable';
import TrainForm from '../components/TrainForm';
import { useHomePage } from '../hooks/useHomePage';

export default function Home() {
  const {
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
  } = useHomePage();

  return (
    <Layout user={user}>
      <div className="grid page-content">
        <header className="page-header">
          <h1>Train Schedule</h1>
          <p>Browse the public schedule and manage train records based on your access level.</p>
        </header>

        <AuthBanner user={user} onLogout={handleLogout} />

        {user && (
          <section className="card header-row" aria-labelledby="manage-trains-heading">
            <div>
              <h2 id="manage-trains-heading">Manage train records</h2>
              <p style={{ margin: 0 }}>Add and edit trains for the public schedule.</p>
            </div>
            <div>
              <button className="button" onClick={openCreate}>
                Add train
              </button>
            </div>
          </section>
        )}

        {isFormOpen && (
          <section aria-labelledby="train-form-heading">
            <h2 id="train-form-heading" className="sr-only">
              {editing ? 'Edit train' : 'Add train'}
            </h2>
            <TrainForm
              key={editing ? `edit-${editing.id}` : 'create'}
              initial={
                editing
                  ? {
                      trainNumber: editing.trainNumber,
                      direction: editing.direction,
                      station: editing.station,
                      departureTime: editing.departureTime,
                      arrivalTime: editing.arrivalTime,
                    }
                  : undefined
              }
              onCancel={closeForm}
              onSubmit={editing ? handleUpdate : handleCreate}
            />
          </section>
        )}

        <section className="card" aria-labelledby="train-schedule-heading">
          <header className="header-row">
            <div>
              <h2 id="train-schedule-heading">Train schedule</h2>
            </div>
          </header>
          {loading && <p>Loading schedule...</p>}
          {error && (
            <p className="error" style={{ whiteSpace: 'pre-line' }} role="alert">
              {error}
            </p>
          )}
          <TrainTable trains={trains} user={user} onEdit={openEdit} onDelete={handleDelete} />
        </section>
      </div>
    </Layout>
  );
}
