import { Train } from '../lib/api';
import { UserInfo } from '../lib/auth';
import { UserRoles } from '../lib/user-roles';
import { formatTrainDateTime } from '../utils/date';

type Props = {
  trains: Train[];
  user: UserInfo | null;
  onEdit: (train: Train) => void;
  onDelete: (id: number) => void;
};

const secondaryButtonClass =
  'inline-flex items-center justify-center rounded-2xl bg-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-300';
const primaryButtonClass =
  'inline-flex items-center justify-center rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700';

export default function TrainTable({ trains, user, onEdit, onDelete }: Props) {
  const canDelete = user?.role === UserRoles.Admin;

  return (
    <>
      <div className="hidden overflow-hidden rounded-[20px] border border-slate-200 md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse bg-white">
            <thead>
              <tr className="bg-slate-100/90 text-left text-sm font-semibold text-slate-600">
                <th className="px-5 py-4">Train #</th>
                <th className="px-5 py-4">Direction</th>
                <th className="px-5 py-4">Station</th>
                <th className="px-5 py-4">Departure</th>
                <th className="px-5 py-4">Arrival</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trains.map((train) => (
                <tr key={train.id} className="border-t border-slate-200 text-sm text-slate-700">
                  <td className="px-5 py-4 font-medium text-slate-950">{train.trainNumber}</td>
                  <td className="px-5 py-4">{train.direction}</td>
                  <td className="px-5 py-4">{train.station}</td>
                  <td className="px-5 py-4">{formatTrainDateTime(train.departureTime)}</td>
                  <td className="px-5 py-4">{formatTrainDateTime(train.arrivalTime)}</td>
                  <td className="px-5 py-4">
                    {user ? (
                      <div className="flex flex-wrap gap-2">
                        <button className={secondaryButtonClass} onClick={() => onEdit(train)}>
                          Edit
                        </button>
                        {canDelete && (
                          <button className={primaryButtonClass} onClick={() => onDelete(train.id)}>
                            Delete
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-500">Login to manage</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 md:hidden">
        {trains.map((train) => (
          <article
            key={train.id}
            className="rounded-[20px] border border-slate-200 bg-slate-50/80 p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
          >
            <div className="mb-4">
              <div className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-600">Train</div>
              <div className="mt-1 text-lg font-semibold text-slate-950">{train.trainNumber}</div>
            </div>

            <dl className="grid gap-3 text-sm text-slate-700">
              <div className="flex items-center justify-between gap-4">
                <dt className="font-medium text-slate-500">Direction</dt>
                <dd className="text-right text-slate-950">{train.direction}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="font-medium text-slate-500">Station</dt>
                <dd className="text-right text-slate-950">{train.station}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="font-medium text-slate-500">Departure</dt>
                <dd className="text-right text-slate-950">{formatTrainDateTime(train.departureTime)}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="font-medium text-slate-500">Arrival</dt>
                <dd className="text-right text-slate-950">{formatTrainDateTime(train.arrivalTime)}</dd>
              </div>
            </dl>

            <div className="mt-4 flex flex-wrap gap-2">
              {user ? (
                <>
                  <button className={secondaryButtonClass} onClick={() => onEdit(train)}>
                    Edit
                  </button>
                  {canDelete && (
                    <button className={primaryButtonClass} onClick={() => onDelete(train.id)}>
                      Delete
                    </button>
                  )}
                </>
              ) : (
                <span className="text-sm text-slate-500">Login to manage</span>
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
