import { useState, useEffect } from 'react';
import { Icon } from "@iconify/react";

const API_URL = 'http://localhost:3001';

const emptyForm = {
  date: new Date().toISOString().split('T')[0],
  week_number: '', workout_desc: '', duration_min: '', steps: '',
  sleep_hours: '', bedtime: '', wake_time: '', nap_start: '', nap_end: '', feeling: ''
};

const DailySportSleepLayer = ({ userId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/health/daily-sport-sleep`, { headers: { 'x-user-id': userId } });
      if (response.ok) setData(await response.json());
    } catch (error) { console.error('Erreur fetch:', error); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (userId) fetchData(); }, [userId]);

  const openAdd = () => { setEditId(null); setForm({ ...emptyForm }); setShowModal(true); };
  const openEdit = (row) => {
    setEditId(row.id);
    const f = { ...emptyForm };
    Object.keys(f).forEach(k => { if (k === 'date') f[k] = row.date?.split('T')[0] || ''; else if (row[k] != null) f[k] = row[k]; });
    setForm(f); setShowDetail(null); setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const url = editId ? `${API_URL}/api/health/daily-sport-sleep/${editId}` : `${API_URL}/api/health/daily-sport-sleep`;
      const response = await fetch(url, {
        method: editId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
        body: JSON.stringify(form)
      });
      if (response.ok) { setShowModal(false); fetchData(); }
    } catch (error) { console.error('Erreur save:', error); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ?')) return;
    try { await fetch(`${API_URL}/api/health/daily-sport-sleep/${id}`, { method: 'DELETE', headers: { 'x-user-id': userId } }); setShowDetail(null); fetchData(); }
    catch (error) { console.error('Erreur delete:', error); }
  };

  const setField = (f, v) => setForm(prev => ({ ...prev, [f]: v }));
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }) : '-';
  const formatDateLong = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) : '-';

  const getSleepBadge = (hours) => {
    const h = parseFloat(hours) || 0;
    if (h >= 7.5) return { icon: 'mdi:sleep', colorClass: 'text-success-main', badgeClass: 'bg-success-focus text-success-main' };
    if (h >= 6) return { icon: 'mdi:sleep', colorClass: 'text-warning-main', badgeClass: 'bg-warning-focus text-warning-main' };
    return { icon: 'mdi:sleep-off', colorClass: 'text-danger-main', badgeClass: 'bg-danger-focus text-danger-main' };
  };

  const getWorkoutBadgeClass = (desc) => {
    if (!desc || desc.toLowerCase().includes('repos')) return 'bg-secondary-focus text-secondary-main';
    if (desc.toLowerCase().includes('cardio') || desc.toLowerCase().includes('course')) return 'bg-warning-focus text-warning-main';
    return 'bg-primary-focus text-primary-main';
  };

  // Stats rapides
  const thisWeek = data.filter(d => (Date.now() - new Date(d.date).getTime()) / 86400000 <= 7);
  const avgSleep = thisWeek.length > 0
    ? (thisWeek.reduce((a, b) => a + (parseFloat(b.sleep_hours) || 0), 0) / thisWeek.length).toFixed(1)
    : '0';
  const totalSteps = thisWeek.reduce((a, b) => a + (parseInt(b.steps) || 0), 0);
  const totalSport = thisWeek.reduce((a, b) => a + (parseInt(b.duration_min) || 0), 0);

  const kpiCards = [
    { label: 'Sommeil Moyen', value: `${avgSleep}h`, icon: 'mdi:sleep', bgColor: 'bg-purple', gradientClass: 'bg-gradient-start-2' },
    { label: 'Pas (7j)', value: totalSteps > 0 ? totalSteps.toLocaleString('fr-FR') : '0', icon: 'mdi:walk', bgColor: 'bg-cyan', gradientClass: 'bg-gradient-start-1' },
    { label: 'Sport (7j)', value: `${totalSport} min`, icon: 'mdi:dumbbell', bgColor: 'bg-warning-main', gradientClass: 'bg-gradient-start-3' },
    { label: 'Total Entrées', value: data.length, icon: 'mdi:notebook-outline', bgColor: 'bg-success-main', gradientClass: 'bg-gradient-start-4' }
  ];

  return (
    <>
      {/* KPIs — pattern UnitCountOne */}
      <div className='row row-cols-xxxl-4 row-cols-lg-2 row-cols-sm-2 row-cols-1 gy-4'>
        {loading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className='col'>
              <div className='card shadow-none border h-100'>
                <div className='card-body p-20'>
                  <div className='placeholder-glow'>
                    <span className='placeholder col-6'></span>
                    <span className='placeholder col-4 mt-2'></span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          kpiCards.map((kpi, index) => (
            <div key={index} className='col'>
              <div className={`card shadow-none border ${kpi.gradientClass} h-100`}>
                <div className='card-body p-20'>
                  <div className='d-flex flex-wrap align-items-center justify-content-between gap-3'>
                    <div>
                      <p className='fw-medium text-primary-light mb-1'>{kpi.label}</p>
                      <h6 className='mb-0'>{kpi.value}</h6>
                    </div>
                    <div className={`w-50-px h-50-px ${kpi.bgColor} rounded-circle d-flex justify-content-center align-items-center`}>
                      <Icon icon={kpi.icon} className='text-white text-2xl mb-0' />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Journal — DailyLogsTable pattern */}
      <div className='card mt-24'>
        <div className='card-header d-flex flex-wrap align-items-center justify-content-between gap-3'>
          <h6 className='text-lg mb-0 fw-semibold'>🏋️ Journal Sport & Sommeil</h6>
          <button onClick={openAdd} className='btn btn-primary-600 btn-sm d-flex align-items-center gap-2'>
            <Icon icon='mdi:plus' /> Ajouter
          </button>
        </div>
        <div className='card-body p-0'>
          {loading ? (
            <div className='d-flex justify-content-center align-items-center py-5'>
              <div className='spinner-border text-primary' role='status'>
                <span className='visually-hidden'>Chargement...</span>
              </div>
            </div>
          ) : data.length === 0 ? (
            <div className='text-center py-40'>
              <h6 className='text-secondary-light fw-normal'>Aucune activité enregistrée</h6>
              <p className='text-sm text-secondary-light'>Commence à suivre ton sport et sommeil</p>
            </div>
          ) : (
            <div className='d-flex flex-column gap-0'>
              {data.map(row => {
                const sleepInfo = getSleepBadge(row.sleep_hours);
                return (
                  <div key={row.id}
                    className='d-flex align-items-center justify-content-between gap-3 px-24 py-16 border-bottom'
                    style={{ cursor: 'pointer', transition: 'background 0.15s' }}
                    onClick={() => setShowDetail(row)}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bs-gray-100, #f8f9fa)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    {/* Date */}
                    <div className='d-flex align-items-center gap-12'>
                      <div className='flex-shrink-0'>
                        <div className='w-40-px h-40-px bg-primary-50 rounded-circle d-flex justify-content-center align-items-center'>
                          <span className='fw-bold text-primary-600 text-sm'>
                            {new Date(row.date).getDate()}
                          </span>
                        </div>
                      </div>
                      <div className='flex-grow-1'>
                        <h6 className='text-md mb-0 fw-medium text-primary-light'>{formatDate(row.date)}</h6>
                        {row.feeling && <span className='text-sm text-secondary-light fw-normal'>{row.feeling}</span>}
                      </div>
                    </div>

                    {/* Workout badge */}
                    <div className='d-none d-sm-flex align-items-center gap-8'>
                      {row.workout_desc && (
                        <span className={`px-12 py-6 rounded-pill fw-medium text-sm ${getWorkoutBadgeClass(row.workout_desc)}`}>
                          {row.workout_desc}
                        </span>
                      )}
                      {row.duration_min && (
                        <span className='text-sm text-secondary-light fw-medium'>⏱️ {row.duration_min} min</span>
                      )}
                    </div>

                    {/* Sleep + Steps */}
                    <div className='d-flex align-items-center gap-12'>
                      {row.sleep_hours && (
                        <div className='d-flex align-items-center gap-2'>
                          <Icon icon={sleepInfo.icon} className={`text-xl ${sleepInfo.colorClass}`} />
                          <span className='fw-medium text-sm'>{parseFloat(row.sleep_hours).toFixed(1)}h</span>
                        </div>
                      )}
                      {row.steps && (
                        <span className='text-sm text-secondary-light d-none d-md-inline'>
                          {parseInt(row.steps).toLocaleString('fr-FR')} pas
                        </span>
                      )}
                      <Icon icon='solar:alt-arrow-right-linear' className='text-secondary-light text-xl' />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetail && (
        <div className='modal fade show d-block' tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowDetail(null)}>
          <div className='modal-dialog modal-dialog-centered modal-dialog-scrollable' onClick={e => e.stopPropagation()}>
            <div className='modal-content radius-12'>
              <div className='modal-header border-bottom bg-base py-16 px-24'>
                <h6 className='text-lg fw-semibold mb-0'>📅 {formatDateLong(showDetail.date)}</h6>
                <button type='button' className='btn-close' onClick={() => setShowDetail(null)}></button>
              </div>
              <div className='modal-body p-24'>
                {/* Sport */}
                <h6 className='text-md fw-semibold mb-12'>🏋️ Sport</h6>
                <div className='d-flex flex-column gap-12 mb-24'>
                  <div className='d-flex align-items-center justify-content-between'>
                    <span className='text-sm text-primary-light'>Entraînement</span>
                    {showDetail.workout_desc ? (
                      <span className={`px-12 py-6 rounded-pill fw-medium text-sm ${getWorkoutBadgeClass(showDetail.workout_desc)}`}>
                        {showDetail.workout_desc}
                      </span>
                    ) : <span className='text-secondary-light text-sm'>-</span>}
                  </div>
                  <div className='d-flex align-items-center justify-content-between'>
                    <span className='text-sm text-primary-light'>Durée</span>
                    <span className='fw-medium text-sm'>{showDetail.duration_min ? `${showDetail.duration_min} min` : '-'}</span>
                  </div>
                  <div className='d-flex align-items-center justify-content-between'>
                    <span className='text-sm text-primary-light'>Pas</span>
                    <span className='fw-medium text-sm'>{showDetail.steps ? parseInt(showDetail.steps).toLocaleString('fr-FR') : '-'}</span>
                  </div>
                </div>

                {/* Sommeil */}
                <h6 className='text-md fw-semibold mb-12'>😴 Sommeil</h6>
                <div className='d-flex flex-column gap-12 mb-16'>
                  {showDetail.sleep_hours && (
                    <div className='d-flex align-items-center justify-content-between'>
                      <span className='text-sm text-primary-light'>Heures</span>
                      <div className='d-flex align-items-center gap-2'>
                        <Icon icon={getSleepBadge(showDetail.sleep_hours).icon}
                          className={`text-xl ${getSleepBadge(showDetail.sleep_hours).colorClass}`} />
                        <span className='fw-bold'>{parseFloat(showDetail.sleep_hours).toFixed(1)}h</span>
                      </div>
                    </div>
                  )}
                  {(showDetail.bedtime || showDetail.wake_time) && (
                    <div className='d-flex align-items-center justify-content-between'>
                      <span className='text-sm text-primary-light'>🌙 Coucher → ☀️ Lever</span>
                      <span className='fw-medium text-sm'>{showDetail.bedtime || '?'} → {showDetail.wake_time || '?'}</span>
                    </div>
                  )}
                  {(showDetail.nap_start || showDetail.nap_end) && (
                    <div className='d-flex align-items-center justify-content-between'>
                      <span className='text-sm text-primary-light'>💤 Sieste</span>
                      <span className='fw-medium text-sm'>{showDetail.nap_start || '?'} → {showDetail.nap_end || '?'}</span>
                    </div>
                  )}
                </div>

                {showDetail.feeling && (
                  <div className='card shadow-none border'>
                    <div className='card-body p-16'>
                      <h6 className='text-sm fw-semibold text-warning-main mb-4'>😊 Feeling</h6>
                      <p className='text-sm text-primary-light mb-0'>{showDetail.feeling}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className='modal-footer border-top px-24 py-16'>
                <button onClick={() => openEdit(showDetail)}
                  className='btn btn-outline-info-600 btn-sm d-flex align-items-center gap-2 flex-grow-1 justify-content-center'>
                  <Icon icon='mdi:pencil' /> Modifier
                </button>
                <button onClick={() => handleDelete(showDetail.id)}
                  className='btn btn-outline-danger btn-sm d-flex align-items-center gap-2 flex-grow-1 justify-content-center'>
                  <Icon icon='mdi:delete' /> Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showModal && (
        <div className='modal fade show d-block' tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowModal(false)}>
          <div className='modal-dialog modal-dialog-centered modal-dialog-scrollable' onClick={e => e.stopPropagation()}>
            <div className='modal-content radius-12'>
              <div className='modal-header border-bottom bg-base py-16 px-24'>
                <h6 className='text-lg fw-semibold mb-0'>{editId ? '✏️ Modifier' : '➕ Nouvelle entrée'}</h6>
                <button type='button' className='btn-close' onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className='modal-body p-24' style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                  <div className='row gy-3 mb-20'>
                    <div className='col-sm-7'>
                      <label className='form-label fw-semibold text-primary-light text-sm'>📅 Date</label>
                      <input type='date' className='form-control radius-8' value={form.date} onChange={e => setField('date', e.target.value)} required />
                    </div>
                    <div className='col-sm-5'>
                      <label className='form-label fw-semibold text-primary-light text-sm'>Semaine</label>
                      <input type='number' className='form-control radius-8' placeholder='Nº' value={form.week_number} onChange={e => setField('week_number', e.target.value)} />
                    </div>
                  </div>

                  <h6 className='text-md fw-semibold mb-12'>🏋️ Sport</h6>
                  <div className='row gy-3 mb-20'>
                    <div className='col-12'>
                      <label className='form-label fw-semibold text-primary-light text-sm'>Entraînement</label>
                      <input type='text' className='form-control radius-8' placeholder='Pecs, Cardio, Jambes...' value={form.workout_desc} onChange={e => setField('workout_desc', e.target.value)} />
                    </div>
                    <div className='col-sm-6'>
                      <label className='form-label fw-semibold text-primary-light text-sm'>⏱️ Durée (min)</label>
                      <input type='number' className='form-control radius-8' placeholder='60' value={form.duration_min} onChange={e => setField('duration_min', e.target.value)} />
                    </div>
                    <div className='col-sm-6'>
                      <label className='form-label fw-semibold text-primary-light text-sm'>👟 Pas</label>
                      <input type='number' className='form-control radius-8' placeholder='8000' value={form.steps} onChange={e => setField('steps', e.target.value)} />
                    </div>
                  </div>

                  <h6 className='text-md fw-semibold mb-12'>😴 Sommeil</h6>
                  <div className='row gy-3 mb-20'>
                    <div className='col-sm-4'>
                      <label className='form-label fw-semibold text-primary-light text-sm'>Heures</label>
                      <input type='number' step='0.5' className='form-control radius-8' placeholder='7.5' value={form.sleep_hours} onChange={e => setField('sleep_hours', e.target.value)} />
                    </div>
                    <div className='col-sm-4'>
                      <label className='form-label fw-semibold text-primary-light text-sm'>🌙 Coucher</label>
                      <input type='time' className='form-control radius-8' value={form.bedtime} onChange={e => setField('bedtime', e.target.value)} />
                    </div>
                    <div className='col-sm-4'>
                      <label className='form-label fw-semibold text-primary-light text-sm'>☀️ Lever</label>
                      <input type='time' className='form-control radius-8' value={form.wake_time} onChange={e => setField('wake_time', e.target.value)} />
                    </div>
                    <div className='col-sm-6'>
                      <label className='form-label fw-semibold text-primary-light text-sm'>💤 Sieste début</label>
                      <input type='time' className='form-control radius-8' value={form.nap_start} onChange={e => setField('nap_start', e.target.value)} />
                    </div>
                    <div className='col-sm-6'>
                      <label className='form-label fw-semibold text-primary-light text-sm'>💤 Sieste fin</label>
                      <input type='time' className='form-control radius-8' value={form.nap_end} onChange={e => setField('nap_end', e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className='form-label fw-semibold text-primary-light text-sm'>😊 Feeling</label>
                    <input type='text' className='form-control radius-8' placeholder='Comment te sens-tu ?' value={form.feeling} onChange={e => setField('feeling', e.target.value)} />
                  </div>
                </div>
                <div className='modal-footer border-top px-24 py-16'>
                  <button type='button' className='btn btn-secondary-600 radius-8 flex-grow-1' onClick={() => setShowModal(false)}>Annuler</button>
                  <button type='submit' className='btn btn-primary-600 radius-8 flex-grow-1 d-flex align-items-center justify-content-center gap-2' disabled={saving}>
                    {saving && <span className='spinner-border spinner-border-sm'></span>}
                    {editId ? 'Enregistrer' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DailySportSleepLayer;
