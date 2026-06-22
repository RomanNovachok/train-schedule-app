import { Train } from '../lib/api';
import { UserInfo } from '../lib/auth';

type Props = {
  trains: Train[];
  user: UserInfo | null;
  onEdit: (train: Train) => void;
  onDelete: (id: number) => void;
};

export default function TrainTable({ trains, user, onEdit, onDelete }: Props) {
  const isAdmin = user?.role === 'ADMIN';

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
              <td data-label="Departure">{new Date(train.departureTime).toLocaleString()}</td>
              <td data-label="Arrival">{new Date(train.arrivalTime).toLocaleString()}</td>
              <td data-label="Actions">
                {user ? (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button className="button secondary" onClick={() => onEdit(train)}>
                      Edit
                    </button>
                    {isAdmin && (
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
