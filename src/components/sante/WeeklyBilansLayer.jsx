import { useState, useEffect } from 'react';
import { Icon } from "@iconify/react";

const API_URL = 'http://localhost:3001';

const RATING_FIELDS = [
  { key: 'rating_petits_dejeuners', label: 'Petit-déj' },
  { key: 'rating_collations_matin', label: 'Collation AM' },
  { key: 'rating_dejeuners', label: 'Déjeuner' },
  { key: 'rating_collations_aprem', label: 'Collation PM' },
  { key: 'rating_diners', label: 'Dîner' },
  { key: 'rating_hydratation', label: 'Hydratation' }
];

const emptyForm = {
  week_number: '', total_sport_time: '', total_sport_min: '', avg_sport_min_per_day: '',
  total_steps: '', avg_steps_per_day: '',
  rating_petits_dejeuners: 2, rating_collations_matin: 2, rating_dejeuners: 2,
  rating_collations_aprem: 2, rating_diners: 2, rating_hydratation: 2,
  avg_sleep_hours: '', weight_kg: '', bilan_text: ''
};

const WeeklyBilansLayer = ({ userId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/health/weekly-bilans`, { headers: { 'x-user-id': userId } });
      if (response.ok) setData(await response.json());
    } catch (error) { console.error('Erreur fetch:', error); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (userId) fetchData(); }, [userId]);

  const openAdd = () => { setEditId(null); setForm({ ...emptyForm }); setShowModal(true); };
  const openEdit = (row) => {
    setEditId(row.id);
    const f = { ...emptyForm };
    Object.keys(f).forEach(k => { if (row[k] != null) f[k] = row[k]; });
    setForm(f); setShowDetail(null); setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const url = editId ? `${API_URL}/api/health/weekly-bilans/${editId}` : `${API_URL}/api/health/weekly-bilans`;
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
    if (!window.confirm('Supprimer ce bilan ?')) return;
    try { await fetch(`${API_URL}/api/health/weekly-bilans/${id}`, { method: 'DELETE', headers: { 'x-user-id': userId } }); setShowDetail(null); fetchData(); }
    catch (error) { console.error('Erreur delete:', error); }
  };

  const setField = (f, v) => setForm(prev => ({ ...prev, [f]: v }));

  const avgRating = (row) => {
    const vals = RATING_FIELDS.map(f => parseInt(row[f.key]) || 0);
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  };

  // Star rendering following DefaultStarRatings pattern
  const renderStars = (n) => {
    const val = parseInt(n) || 0;
    return (
      <ul className='d-flex align-items-center gap-2' style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {[0, 1, 2].map(i => (
          <li key={i} className={`${i < val ? 'text-warning-600' : 'text-neutral-400'} text-xl line-height-1`}>
            <Icon icon='material-symbols:star' />
          </li>
        ))}
      </ul>
    );
  };

  // Star input following RatingStar pattern
  const StarInput = ({ field, value }) => (
    <div className='mb-16'>
      <label className='form-label fw-semibold text-primary-light text-sm mb-8'>
        {RATING_FIELDS.find(f => f.key === field)?.label}
      </label>
      <ul className='d-flex align-items-center gap-8' style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {[0, 1, 2, 3].map(i => (
          <li key={i}
            className={`${i <= value ? 'text-warning-600' : 'text-neutral-400'} text-2xl line-height-1`}
            style={{ cursor: 'pointer' }}
            onClick={() => setField(field, i)}>
            <Icon icon='material-symbols:star' />
          </li>
        ))}
      </ul>
    </div>
  );

  // KPIs
  const kpiCards = [
    { label: 'Total Bilans', value: data.length, icon: 'mdi:chart-box-outline', bgColor: 'bg-cyan', gradientClass: 'bg-gradient-start-1' },
    { label: 'Dernier Bilan', value: data.length > 0 ? `Sem. ${data[0]?.week_number}` : '-', icon: 'mdi:calendar-check', bgColor: 'bg-purple', gradientClass: 'bg-gradient-start-2' },
    { label: 'Dernier Poids', value: data.find(d => d.weight_kg) ? `${data.find(d => d.weight_kg).weight_kg} kg` : '-', icon: 'healthicons:weight', bgColor: 'bg-success-main', gradientClass: 'bg-gradient-start-4' },
    { label: 'Humeur Moy.', value: data.length > 0 ? `${avgRating(data[0])}/3` : '-', icon: 'mdi:emoticon-happy-outline', bgColor: 'bg-warning-main', gradientClass: 'bg-gradient-start-3' }
  ];

  return (
    <>
      {/* KPIs */}
      <div className='row row-cols-xxxl-4 row-cols-lg-2 row-cols-sm-2 row-cols-1 gy-4'>
        {loading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className='col'>
              <div className='card shadow-none border h-100'>
                <div className='card-body p-20'><div className='placeholder-glow'><span className='placeholder col-6'></span><span className='placeholder col-4 mt-2'></span></div></div>
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
          <h6 className='text-lg mb-0 fw-semibold'>📊 Bilans Hebdomadaires</h6>
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
              <h6 className='text-secondary-light fw-normal'>Aucun bilan hebdomadaire</h6>
              <p className='text-sm text-secondary-light'>Fais le point sur ta semaine</p>
            </div>
          ) : (
            <div className='d-flex flex-column gap-0'>
              {data.map(row => (
                <div key={row.id}
                  className='d-flex align-items-center justify-content-between gap-3 px-24 py-16 border-bottom'
                  style={{ cursor: 'pointer', transition: 'background 0.15s' }}
                  onClick={() => setShowDetail(row)}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bs-gray-100, #f8f9fa)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  {/* Week number */}
                  <div className='d-flex align-items-center gap-12'>
                    <div className='flex-shrink-0'>
                      <div className='w-40-px h-40-px bg-primary-600 rounded-circle d-flex justify-content-center align-items-center'>
                        <span className='fw-bold text-white text-sm'>S{row.week_number}</span>
                      </div>
                    </div>
                    <div className='flex-grow-1'>
                      <h6 className='text-md mb-0 fw-medium text-primary-light'>Semaine {row.week_number}</h6>
                      <span className='text-sm text-secondary-light fw-normal'>
                        {row.total_sport_time && `🏋️ ${row.total_sport_time}`}
                        {row.total_sport_time && row.avg_sleep_hours && ' • '}
                        {row.avg_sleep_hours && `😴 ${parseFloat(row.avg_sleep_hours).toFixed(1)}h`}
                      </span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className='d-none d-md-flex align-items-center gap-8 flex-wrap'>
                    {row.total_steps && (
                      <span className='bg-success-focus text-success-main px-10 py-4 radius-8 fw-medium text-sm'>
                        👟 {parseInt(row.total_steps).toLocaleString('fr-FR')}
                      </span>
                    )}
                    {row.weight_kg && (
                      <span className='bg-primary-focus text-primary-main px-10 py-4 radius-8 fw-medium text-sm'>
                        ⚖️ {row.weight_kg} kg
                      </span>
                    )}
                  </div>

                  {/* Rating + Arrow */}
                  <div className='d-flex align-items-center gap-8'>
                    <span className={`px-12 py-6 rounded-pill fw-medium text-sm ${avgRating(row) >= 2 ? 'bg-success-focus text-success-main' : avgRating(row) >= 1 ? 'bg-warning-focus text-warning-main' : 'bg-danger-focus text-danger-main'}`}>
                      {avgRating(row)}/3
                    </span>
                    <Icon icon='solar:alt-arrow-right-linear' className='text-secondary-light text-xl' />
                  </div>
                </div>
              ))}
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
                <h6 className='text-lg fw-semibold mb-0'>📊 Bilan Semaine {showDetail.week_number}</h6>
                <button type='button' className='btn-close' onClick={() => setShowDetail(null)}></button>
              </div>
              <div className='modal-body p-24'>
                {/* Sport */}
                <h6 className='text-md fw-semibold mb-12'>🏋️ Sport</h6>
                <div className='d-flex flex-column gap-8 mb-24'>
                  {[
                    ['Temps total', showDetail.total_sport_time],
                    ['Minutes totales', showDetail.total_sport_min],
                    ['Moy./jour', showDetail.avg_sport_min_per_day ? `${showDetail.avg_sport_min_per_day} min` : null]
                  ].map(([label, val]) => val && (
                    <div key={label} className='d-flex align-items-center justify-content-between'>
                      <span className='text-sm text-primary-light'>{label}</span>
                      <span className='fw-medium text-sm'>{val}</span>
                    </div>
                  ))}
                </div>

                {/* Steps & Sleep & Weight */}
                <h6 className='text-md fw-semibold mb-12'>📈 Métriques</h6>
                <div className='d-flex flex-column gap-8 mb-24'>
                  {[
                    ['👟 Pas totaux', showDetail.total_steps ? parseInt(showDetail.total_steps).toLocaleString('fr-FR') : null],
                    ['👟 Moy./jour', showDetail.avg_steps_per_day ? parseInt(showDetail.avg_steps_per_day).toLocaleString('fr-FR') : null],
                    ['😴 Sommeil moy.', showDetail.avg_sleep_hours ? `${parseFloat(showDetail.avg_sleep_hours).toFixed(1)}h` : null],
                    ['⚖️ Poids', showDetail.weight_kg ? `${showDetail.weight_kg} kg` : null]
                  ].map(([label, val]) => val && (
                    <div key={label} className='d-flex align-items-center justify-content-between'>
                      <span className='text-sm text-primary-light'>{label}</span>
                      <span className='fw-bold text-sm'>{val}</span>
                    </div>
                  ))}
                </div>

                {/* Ratings */}
                <h6 className='text-md fw-semibold mb-12'>⭐ Évaluations alimentation</h6>
                <div className='d-flex flex-column gap-8 mb-16'>
                  {RATING_FIELDS.map(f => (
                    <div key={f.key} className='d-flex align-items-center justify-content-between'>
                      <span className='text-sm text-primary-light'>{f.label}</span>
                      {renderStars(showDetail[f.key])}
                    </div>
                  ))}
                </div>

                {showDetail.bilan_text && (
                  <div className='card shadow-none border'>
                    <div className='card-body p-16'>
                      <h6 className='text-sm fw-semibold text-primary-600 mb-4'>📝 Commentaire</h6>
                      <p className='text-sm text-primary-light mb-0'>{showDetail.bilan_text}</p>
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
          <div className='modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg' onClick={e => e.stopPropagation()}>
            <div className='modal-content radius-12'>
              <div className='modal-header border-bottom bg-base py-16 px-24'>
                <h6 className='text-lg fw-semibold mb-0'>{editId ? '✏️ Modifier bilan' : '➕ Nouveau bilan'}</h6>
                <button type='button' className='btn-close' onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className='modal-body p-24' style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                  <div className='row gy-3 mb-20'>
                    <div className='col-sm-4'>
                      <label className='form-label fw-semibold text-primary-light text-sm'>📅 Semaine</label>
                      <input type='number' className='form-control radius-8' placeholder='Nº' value={form.week_number} onChange={e => setField('week_number', e.target.value)} required />
                    </div>
                    <div className='col-sm-4'>
                      <label className='form-label fw-semibold text-primary-light text-sm'>⚖️ Poids (kg)</label>
                      <input type='number' step='0.1' className='form-control radius-8' placeholder='75.5' value={form.weight_kg} onChange={e => setField('weight_kg', e.target.value)} />
                    </div>
                    <div className='col-sm-4'>
                      <label className='form-label fw-semibold text-primary-light text-sm'>😴 Sommeil moy. (h)</label>
                      <input type='number' step='0.5' className='form-control radius-8' placeholder='7.5' value={form.avg_sleep_hours} onChange={e => setField('avg_sleep_hours', e.target.value)} />
                    </div>
                  </div>

                  <h6 className='text-md fw-semibold mb-12'>🏋️ Sport</h6>
                  <div className='row gy-3 mb-20'>
                    <div className='col-sm-4'>
                      <label className='form-label fw-semibold text-primary-light text-sm'>Temps total</label>
                      <input type='text' className='form-control radius-8' placeholder='3h30' value={form.total_sport_time} onChange={e => setField('total_sport_time', e.target.value)} />
                    </div>
                    <div className='col-sm-4'>
                      <label className='form-label fw-semibold text-primary-light text-sm'>Total (min)</label>
                      <input type='number' className='form-control radius-8' placeholder='210' value={form.total_sport_min} onChange={e => setField('total_sport_min', e.target.value)} />
                    </div>
                    <div className='col-sm-4'>
                      <label className='form-label fw-semibold text-primary-light text-sm'>Moy./j (min)</label>
                      <input type='number' step='0.1' className='form-control radius-8' placeholder='30' value={form.avg_sport_min_per_day} onChange={e => setField('avg_sport_min_per_day', e.target.value)} />
                    </div>
                    <div className='col-sm-6'>
                      <label className='form-label fw-semibold text-primary-light text-sm'>👟 Pas totaux</label>
                      <input type='number' className='form-control radius-8' placeholder='56000' value={form.total_steps} onChange={e => setField('total_steps', e.target.value)} />
                    </div>
                    <div className='col-sm-6'>
                      <label className='form-label fw-semibold text-primary-light text-sm'>Moy./j</label>
                      <input type='number' className='form-control radius-8' placeholder='8000' value={form.avg_steps_per_day} onChange={e => setField('avg_steps_per_day', e.target.value)} />
                    </div>
                  </div>

                  <h6 className='text-md fw-semibold mb-12'>⭐ Évaluations</h6>
                  <div className='row gy-0'>
                    {RATING_FIELDS.map(f => (
                      <div className='col-sm-6' key={f.key}>
                        <StarInput field={f.key} value={form[f.key]} />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className='form-label fw-semibold text-primary-light text-sm'>📝 Bilan / Commentaire</label>
                    <textarea className='form-control radius-8' rows='2' placeholder='Résumé de la semaine...' value={form.bilan_text} onChange={e => setField('bilan_text', e.target.value)}></textarea>
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

export default WeeklyBilansLayer;
