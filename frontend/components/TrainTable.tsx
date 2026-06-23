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

export default function TrainTable({ trains, user, onEdit, onDelete }: Props) {
  const canDelete = user?.role === UserRoles.Admin;

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Train #</th>
            <th>Direction</th>
            <th>Station</th>
            <th>Departure</th>
            <th>Arrival</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {trains.map((train) => (
            <tr key={train.id}>
              <td data-label="Train #">{train.trainNumber}</td>
              <td data-label="Direction">{train.direction}</td>
              <td data-label="Station">{train.station}</td>
              <td data-label="Departure">{formatTrainDateTime(train.departureTime)}</td>
              <td data-label="Arrival">{formatTrainDateTime(train.arrivalTime)}</td>
              <td data-label="Actions">
                {user ? (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button className="button secondary" onClick={() => onEdit(train)}>
                      Edit
                    </button>
                    {canDelete && (
                      <button className="button" onClick={() => onDelete(train.id)}>
                        Delete
                      </button>
                    )}
                  </div>
                ) : (
                  <span>Login to manage</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
