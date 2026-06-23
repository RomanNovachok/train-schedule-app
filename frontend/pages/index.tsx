import Layout from '../components/Layout';
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
      <div className="grid min-w-0 gap-5 lg:gap-6">
        {user && (
          <section
            className="min-w-0 rounded-[20px] border border-slate-200 bg-white px-5 py-5 shadow-[0_12px_32px_rgba(15,23,42,0.05)] sm:px-6"
            aria-labelledby="manage-trains-heading"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-2xl">
                <div className="text-sm text-slate-600">
                  Logged in as <strong className="text-slate-950">{user.email}</strong> ({user.role})
                </div>
                <div className="mt-2 text-sm leading-6 text-slate-700">
                  {user.role === 'ADMIN'
                    ? 'Admin access: you can add, edit, and delete train records.'
                    : 'You can add and edit train records. Delete access is available only for admins.'}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 sm:justify-end">
                <button
                  className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  onClick={openCreate}
                >
                  Add train
                </button>
                <button
                  className="inline-flex items-center justify-center rounded-2xl bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>

            <div className="mt-5 border-t border-slate-200 pt-5">
              <h1 id="manage-trains-heading" className="text-[1.9rem] font-semibold tracking-tight text-slate-950">
                Manage train records
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Add and edit trains for the public schedule.
              </p>
            </div>
          </section>
        )}

        {!user && (
          <section
            className="min-w-0 rounded-[20px] border border-slate-200 bg-white px-5 py-4 text-sm leading-6 text-slate-700 shadow-[0_12px_32px_rgba(15,23,42,0.05)] sm:px-6"
            aria-label="Authentication status"
          >
            Log in to add or edit train records. Only admins can delete records.
          </section>
        )}

        {isFormOpen && (
          <section className="min-w-0" aria-labelledby="train-form-heading">
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

        <section
          className="min-w-0 rounded-[20px] border border-slate-200 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.05)] sm:p-6"
          aria-labelledby="train-schedule-heading"
        >
          <header className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="train-schedule-heading" className="text-2xl font-semibold text-slate-950">
                Train schedule
              </h2>
              <p className="text-sm text-slate-500">Sorted by departure time, with role-based actions.</p>
            </div>
            {loading && <p className="text-sm font-medium text-slate-500">Loading schedule...</p>}
          </header>

          {error && (
            <p
              className="mb-5 whitespace-pre-line rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
              role="alert"
            >
              {error}
            </p>
          )}

          <TrainTable trains={trains} user={user} onEdit={openEdit} onDelete={handleDelete} />
        </section>
      </div>
    </Layout>
  );
}
