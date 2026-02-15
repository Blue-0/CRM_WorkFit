import { useState, useEffect } from 'react';
import { Icon } from "@iconify/react";

const API_URL = 'http://localhost:3001';

const MEASUREMENT_FIELDS = [
  { key: 'weight_kg', label: 'Poids', unit: 'kg', icon: 'healthicons:weight', bgColor: 'bg-primary-600' },
  { key: 'shoulders_cm', label: 'Épaules', unit: 'cm', icon: 'mdi:human-handsup', bgColor: 'bg-info' },
  { key: 'chest_cm', label: 'Poitrine', unit: 'cm', icon: 'mdi:human', bgColor: 'bg-success-main' },
  { key: 'waist_cm', label: 'Taille', unit: 'cm', icon: 'mdi:human-male', bgColor: 'bg-warning-main' },
  { key: 'abs_cm', label: 'Abdos', unit: 'cm', icon: 'mdi:stomach', bgColor: 'bg-orange' },
  { key: 'hips_cm', label: 'Hanches', unit: 'cm', icon: 'mdi:human-female', bgColor: 'bg-danger-main' },
  { key: 'bicep_left_cm', label: 'Biceps G', unit: 'cm', icon: 'mdi:arm-flex', bgColor: 'bg-purple' },
  { key: 'bicep_right_cm', label: 'Biceps D', unit: 'cm', icon: 'mdi:arm-flex', bgColor: 'bg-purple' },
  { key: 'thigh_left_cm', label: 'Cuisse G', unit: 'cm', icon: 'mdi:human-male-height-variant', bgColor: 'bg-cyan' },
  { key: 'thigh_right_cm', label: 'Cuisse D', unit: 'cm', icon: 'mdi:human-male-height-variant', bgColor: 'bg-cyan' }
];

const emptyForm = {
  date: new Date().toISOString().split('T')[0], week_number: '',
  weight_kg: '', shoulders_cm: '', chest_cm: '', waist_cm: '', abs_cm: '', hips_cm: '',
  bicep_left_cm: '', bicep_right_cm: '', thigh_left_cm: '', thigh_right_cm: ''
};

const BodyMeasurementsLayer = ({ userId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/health/body-measurements-list`, { headers: { 'x-user-id': userId } });
      if (response.ok) setData(await response.json());
    } catch (error) { console.error('Erreur fetch:', error); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (userId) fetchData(); }, [userId]);

  const openAdd = () => { setEditId(null); setForm({ ...emptyForm }); setShowModal(true); };
  const openEdit = (row) => {
    setEditId(row.id);
    const f = { ...emptyForm };
    f.date = row.date?.split('T')[0] || '';
    Object.keys(f).forEach(k => { if (k !== 'date' && row[k] != null) f[k] = row[k]; });
    setForm(f); setShowDetail(null); setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const url = editId ? `${API_URL}/api/health/body-measurements/${editId}` : `${API_URL}/api/health/body-measurements`;
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
    try { await fetch(`${API_URL}/api/health/body-measurements/${id}`, { method: 'DELETE', headers: { 'x-user-id': userId } }); setShowDetail(null); fetchData(); }
    catch (error) { console.error('Erreur delete:', error); }
  };

  const setField = (f, v) => setForm(prev => ({ ...prev, [f]: v }));
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }) : '-';
  const formatDateLong = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) : '-';

  // Delta vs previous measurement
  const getDelta = (current, index, key) => {
    if (index >= data.length - 1) return null;
    const prev = data[index + 1];
    if (!current[key] || !prev[key]) return null;
    const diff = parseFloat(current[key]) - parseFloat(prev[key]);
    if (diff === 0) return null;
    return diff;
  };

  // Count filled measurements
  const filledCount = (row) => MEASUREMENT_FIELDS.filter(f => row[f.key]).length;

  // KPIs
  const kpiCards = [
    { label: 'Total Mesures', value: data.length, icon: 'mdi:tape-measure', bgColor: 'bg-cyan', gradientClass: 'bg-gradient-start-1' },
    { label: 'Dernière Prise', value: data.length > 0 ? formatDate(data[0]?.date) : '-', icon: 'mdi:calendar-check', bgColor: 'bg-purple', gradientClass: 'bg-gradient-start-2' },
    {
      label: 'Poids Actuel',
      value: data.find(d => d.weight_kg) ? `${data.find(d => d.weight_kg).weight_kg} kg` : '-',
      icon: 'healthicons:weight', bgColor: 'bg-success-main', gradientClass: 'bg-gradient-start-4'
    },
    {
      label: 'Tour de Taille',
      value: data.find(d => d.waist_cm) ? `${data.find(d => d.waist_cm).waist_cm} cm` : '-',
      icon: 'mdi:ruler', bgColor: 'bg-warning-main', gradientClass: 'bg-gradient-start-3'
    }
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

      {/* Journal */}
      <div className='card mt-24'>
        <div className='card-header d-flex flex-wrap align-items-center justify-content-between gap-3'>
          <h6 className='text-lg mb-0 fw-semibold'>📏 Suivi Mensurations</h6>
          <button onClick={openAdd} className='btn btn-primary-600 btn-sm d-flex align-items-center gap-2'>
            <Icon icon='mdi:plus' /> Ajouter
          </button>
        </div>
        <div className='card-body p-0'>
          {loading ? (
            <div className='d-flex justify-content-center align-items-center py-5'>
              <div className='spinner-border text-primary' role='status'><span className='visually-hidden'>Chargement...</span></div>
            </div>
          ) : data.length === 0 ? (
            <div className='text-center py-40'>
              <h6 className='text-secondary-light fw-normal'>Aucune mensuration enregistrée</h6>
              <p className='text-sm text-secondary-light'>Enregistre tes mensurations pour suivre ta progression</p>
            </div>
          ) : (
            <div className='d-flex flex-column gap-0'>
              {data.map((row, index) => {
                const weightDelta = getDelta(row, index, 'weight_kg');
                return (
                  <div key={row.id}
                    className='d-flex align-items-center justify-content-between gap-3 px-24 py-16 border-bottom'
                    style={{ cursor: 'pointer', transition: 'background 0.15s' }}
                    onClick={() => setShowDetail({ ...row, _index: index })}
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
                        {row.weight_kg && (
                          <span className='text-sm fw-semibold' style={{ color: '#6366f1' }}>
                            ⚖️ {row.weight_kg} kg
                            {weightDelta !== null && (
                              <span className={`ms-4 text-xs ${weightDelta < 0 ? 'text-success-main' : 'text-danger-main'}`}>
                                <Icon icon={weightDelta < 0 ? 'bxs:down-arrow' : 'bxs:up-arrow'} className='text-xs' />
                                {' '}{Math.abs(weightDelta).toFixed(1)}
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quick badges */}
                    <div className='d-none d-md-flex align-items-center gap-8 flex-wrap'>
                      {row.waist_cm && (
                        <span className='bg-warning-focus text-warning-main px-10 py-4 radius-8 fw-medium text-sm'>
                          Taille: {row.waist_cm}
                        </span>
                      )}
                      {row.chest_cm && (
                        <span className='bg-success-focus text-success-main px-10 py-4 radius-8 fw-medium text-sm'>
                          Poitrine: {row.chest_cm}
                        </span>
                      )}
                      {row.hips_cm && (
                        <span className='bg-danger-focus text-danger-main px-10 py-4 radius-8 fw-medium text-sm'>
                          Hanches: {row.hips_cm}
                        </span>
                      )}
                    </div>

                    <div className='d-flex align-items-center gap-8'>
                      <span className='bg-primary-focus text-primary-main px-10 py-4 radius-8 fw-medium text-sm d-md-none'>
                        {filledCount(row)} mesures
                      </span>
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
                <div>
                  <h6 className='text-lg fw-semibold mb-0'>📏 {formatDateLong(showDetail.date)}</h6>
                  {showDetail.week_number && <small className='text-secondary-light'>Semaine {showDetail.week_number}</small>}
                </div>
                <button type='button' className='btn-close' onClick={() => setShowDetail(null)}></button>
              </div>
              <div className='modal-body p-24'>
                <div className='d-flex flex-column gap-12'>
                  {MEASUREMENT_FIELDS.map(f => {
                    const val = showDetail[f.key];
                    const delta = getDelta(showDetail, showDetail._index, f.key);
                    return (
                      <div key={f.key} className='d-flex align-items-center justify-content-between gap-3'>
                        <div className='d-flex align-items-center gap-8'>
                          <div className={`w-32-px h-32-px ${f.bgColor} rounded-circle d-flex justify-content-center align-items-center`}>
                            <Icon icon={f.icon} className='text-white text-md' />
                          </div>
                          <span className='text-sm text-primary-light fw-medium'>{f.label}</span>
                        </div>
                        <div className='d-flex align-items-center gap-8'>
                          <span className='fw-bold text-sm'>{val ? `${val} ${f.unit}` : '-'}</span>
                          {delta !== null && (
                            <span className={`d-inline-flex align-items-center gap-1 text-xs fw-medium ${delta < 0 ? 'text-success-main' : 'text-danger-main'}`}>
                              <Icon icon={delta < 0 ? 'bxs:down-arrow' : 'bxs:up-arrow'} className='text-xs' />
                              {Math.abs(delta).toFixed(1)}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
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
                <h6 className='text-lg fw-semibold mb-0'>{editId ? '✏️ Modifier' : '➕ Nouvelles mensurations'}</h6>
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

                  <h6 className='text-md fw-semibold mb-12'>📏 Mesures</h6>
                  <div className='row gy-3'>
                    {MEASUREMENT_FIELDS.map(f => (
                      <div className='col-sm-6' key={f.key}>
                        <label className='form-label fw-semibold text-primary-light text-sm mb-4'>
                          {f.label} ({f.unit})
                        </label>
                        <input type='number' step='0.1' className='form-control radius-8'
                          placeholder={f.key === 'weight_kg' ? '75.5' : '85'}
                          value={form[f.key]} onChange={e => setField(f.key, e.target.value)} />
                      </div>
                    ))}
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

export default BodyMeasurementsLayer;
