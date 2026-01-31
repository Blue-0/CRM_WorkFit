import { useState, useEffect } from 'react';
import { Icon } from "@iconify/react";

const API_URL = 'http://localhost:3001';

const DailyLogsTable = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`${API_URL}/api/health/daily-logs`);
        if (response.ok) {
          const data = await response.json();
          setLogs(data);
        }
      } catch (error) {
        console.error('Erreur fetch daily logs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  // Données par défaut si pas de données API
  const defaultLogs = [
    { date: '2026-01-31', workout_type: 'Jambes', sleep_hours: 7.5, feeling_notes: 'Bonne énergie 💪' },
    { date: '2026-01-30', workout_type: 'Repos', sleep_hours: 8.0, feeling_notes: 'Récupération' },
    { date: '2026-01-29', workout_type: 'Dos', sleep_hours: 6.5, feeling_notes: 'Fatigue légère' },
    { date: '2026-01-28', workout_type: 'Cardio', sleep_hours: 7.0, feeling_notes: '30min course' },
    { date: '2026-01-27', workout_type: 'Pecs/Épaules', sleep_hours: 7.5, feeling_notes: 'PR bench!' }
  ];

  const displayLogs = logs.length > 0 ? logs : defaultLogs;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const getWorkoutBadgeClass = (type) => {
    if (!type || type === 'Repos') return 'bg-secondary-focus text-secondary-main';
    if (type === 'Cardio') return 'bg-warning-focus text-warning-main';
    return 'bg-primary-focus text-primary-main';
  };

  const getSleepIcon = (hours) => {
    if (hours >= 7.5) return { icon: 'mdi:sleep', color: 'text-success-main' };
    if (hours >= 6) return { icon: 'mdi:sleep', color: 'text-warning-main' };
    return { icon: 'mdi:sleep-off', color: 'text-danger-main' };
  };

  return (
    <div className='card'>
      <div className='card-header d-flex flex-wrap align-items-center justify-content-between gap-3'>
        <h6 className='text-lg mb-0 fw-semibold'>📋 Journal Quotidien</h6>
        <button className='btn btn-primary-600 btn-sm d-flex align-items-center gap-2'>
          <Icon icon='mdi:plus' />
          Ajouter
        </button>
      </div>
      <div className='card-body p-0'>
        {loading ? (
          <div className='d-flex justify-content-center align-items-center py-5'>
            <div className='spinner-border text-primary' role='status'>
              <span className='visually-hidden'>Chargement...</span>
            </div>
          </div>
        ) : (
          <div className='table-responsive'>
            <table className='table table-hover mb-0'>
              <thead className='bg-neutral-100'>
                <tr>
                  <th className='px-24 py-16 text-sm fw-semibold text-secondary-light'>Date</th>
                  <th className='px-24 py-16 text-sm fw-semibold text-secondary-light'>Entraînement</th>
                  <th className='px-24 py-16 text-sm fw-semibold text-secondary-light'>Sommeil</th>
                  <th className='px-24 py-16 text-sm fw-semibold text-secondary-light'>Notes</th>
                </tr>
              </thead>
              <tbody>
                {displayLogs.map((log, index) => {
                  const sleepInfo = getSleepIcon(log.sleep_hours);
                  return (
                    <tr key={index}>
                      <td className='px-24 py-16'>
                        <span className='fw-medium text-primary-light'>{formatDate(log.date)}</span>
                      </td>
                      <td className='px-24 py-16'>
                        <span className={`px-12 py-6 rounded-pill fw-medium text-sm ${getWorkoutBadgeClass(log.workout_type)}`}>
                          {log.workout_type || 'Repos'}
                        </span>
                      </td>
                      <td className='px-24 py-16'>
                        <div className='d-flex align-items-center gap-2'>
                          <Icon icon={sleepInfo.icon} className={`text-xl ${sleepInfo.color}`} />
                          <span className='fw-medium'>{log.sleep_hours?.toFixed(1)}h</span>
                        </div>
                      </td>
                      <td className='px-24 py-16'>
                        <span className='text-secondary-light text-sm'>{log.feeling_notes || '-'}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyLogsTable;
