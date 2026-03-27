import { useState, useEffect, useMemo } from 'react';
import { Icon } from "@iconify/react";
import FoodSearchAutocomplete from "./FoodSearchAutocomplete";


const API_URL = import.meta.env.VITE_API_URL || '';

const RATING_LABELS = {
  breakfast_rating: 'Petit-déjeuner',
  snack_am_rating: 'Collation Matin',
  lunch_rating: 'Déjeuner',
  snack_pm_rating: 'Collation Après-midi',
  dinner_rating: 'Dîner',
  hydration_rating: 'Hydratation'
};

const RATING_ICONS = [
  { icon: 'material-symbols:star', colorClass: 'text-neutral-400' },
  { icon: 'material-symbols:star', colorClass: 'text-warning-300' },
  { icon: 'material-symbols:star', colorClass: 'text-warning-600' },
  { icon: 'material-symbols:star', colorClass: 'text-warning-600' }
];

const MEAL_TYPES = ['petit_dejeuner', 'collation_am', 'dejeuner', 'collation_pm', 'diner'];
const MEAL_TYPE_LABELS = {
  petit_dejeuner: 'Petit-déj',
  collation_am: 'Collation AM',
  dejeuner: 'Déjeuner',
  collation_pm: 'Collation PM',
  diner: 'Dîner'
};

const STAR_ARRAY = [0, 1, 2];
const STAR_INPUT_ARRAY = [0, 1, 2, 3];

const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }) : '-';
const formatDateLong = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) : '-';

const avgRating = (row) => {
  const vals = [row.breakfast_rating, row.lunch_rating, row.dinner_rating, row.hydration_rating].map(v => parseInt(v) || 0);
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
};

const emptyForm = {
  date: new Date().toISOString().split('T')[0],
  week_number: '',
  breakfast_rating: 2, snack_am_rating: 2, lunch_rating: 2,
  snack_pm_rating: 2, dinner_rating: 2, hydration_rating: 2,
  objectif_text: '', craquage_exces: '', feeling: '', items: []
};

const DailyDietLayer = ({ userId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/health/daily-diet`, {
        headers: { 'x-user-id': userId }
      });
      if (response.ok) setData(await response.json());
    } catch (error) { console.error('Erreur fetch daily-diet:', error); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (userId) fetchData(); }, [userId]);

  const openAdd = () => { setEditId(null); setForm({ ...emptyForm }); setShowModal(true); };
  const openEdit = (row) => {
    setEditId(row.id);
    setForm({
      date: row.date?.split('T')[0] || '',
      week_number: row.week_number || '',
      breakfast_rating: row.breakfast_rating ?? 2, snack_am_rating: row.snack_am_rating ?? 2,
      lunch_rating: row.lunch_rating ?? 2, snack_pm_rating: row.snack_pm_rating ?? 2,
      dinner_rating: row.dinner_rating ?? 2, hydration_rating: row.hydration_rating ?? 2,
      objectif_text: row.objectif_text || '', craquage_exces: row.craquage_exces || '',
      feeling: row.feeling || '', items: row.items || []
    });
    setShowDetail(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const url = editId ? `${API_URL}/api/health/daily-diet/${editId}` : `${API_URL}/api/health/daily-diet`;
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
    if (!window.confirm('Supprimer cette entrée ?')) return;
    try {
      await fetch(`${API_URL}/api/health/daily-diet/${id}`, { method: 'DELETE', headers: { 'x-user-id': userId } });
      setShowDetail(null); fetchData();
    } catch (error) { console.error('Erreur delete:', error); }
  };

  const setRating = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const setField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const addItem = () => setForm(prev => ({
    ...prev, items: [...prev.items, { meal_type: 'petit_dejeuner', item_text: '', product_id: null, image_url: '', calories: null, proteins: null, carbohydrates: null, fats: null, quantity: 100, unit: 'g', sort_order: prev.items.length }]
  }));
  const updateItem = (i, field, value) => setForm(prev => {
    const items = [...prev.items]; items[i] = { ...items[i], [field]: value }; return { ...prev, items };
  });

  const handleFoodSelect = (i, productData) => setForm(prev => {
    const items = [...prev.items];
    items[i] = {
      ...items[i],
      item_text: productData.item_text,
      product_id: productData.product_id,
      image_url: productData.image_url,
      calories: productData.calories,
      proteins: productData.proteins,
      carbohydrates: productData.carbohydrates,
      fats: productData.fats,
      quantity: productData.quantity || 100,
      unit: productData.unit || 'g'
    };
    return { ...prev, items };
  });
  const removeItem = (i) => setForm(prev => ({ ...prev, items: prev.items.filter((_, idx) => idx !== i) }));

  // Star rendering following DefaultStarRatings pattern
  const renderStars = (n) => {
    const val = parseInt(n) || 0;
    return (
      <ul className='d-flex align-items-center gap-2' style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {STAR_ARRAY.map(i => (
          <li key={i} className={`${i < val ? 'text-warning-600' : 'text-neutral-400'} text-xl line-height-1`}>
            <Icon icon='material-symbols:star' />
          </li>
        ))}
      </ul>
    );
  };

  // Star input (interactive) following RatingStar pattern
  const StarInput = ({ field, value }) => (
    <div className='mb-16'>
      <label className='form-label fw-semibold text-primary-light text-sm mb-8'>{RATING_LABELS[field]}</label>
      <ul className='d-flex align-items-center gap-8' style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {STAR_INPUT_ARRAY.map(i => (
          <li key={i}
            className={`${i <= value ? 'text-warning-600' : 'text-neutral-400'} text-2xl line-height-1`}
            style={{ cursor: 'pointer' }}
            onClick={() => setRating(field, i)}>
            <Icon icon='material-symbols:star' />
          </li>
        ))}
      </ul>
    </div>
  );

  const processedData = useMemo(() => {
    return data.map(row => {
      const dateObj = new Date(row.date);
      return {
        ...row,
        calculatedAvgRating: avgRating(row),
        formattedDate: formatDate(row.date),
        dayOfMonth: dateObj.getDate()
      };
    });
  }, [data]);

  // KPI cards following HealthKPIs / UnitCountOne pattern
  const thisWeek = useMemo(() => {
    return processedData.filter(d => (Date.now() - new Date(d.date).getTime()) / 86400000 <= 7);
  }, [processedData]);

  const kpiCards = useMemo(() => [
    {
      label: 'Total Entrées', value: processedData.length,
      icon: 'mdi:notebook-outline', bgColor: 'bg-cyan', gradientClass: 'bg-gradient-start-1'
    },
    {
      label: 'Cette Semaine', value: thisWeek.length,
      icon: 'mdi:calendar-week', bgColor: 'bg-purple', gradientClass: 'bg-gradient-start-2'
    },
    {
      label: 'Dernière Saisie', value: processedData.length > 0 ? processedData[0].formattedDate : '-',
      icon: 'mdi:calendar-check', bgColor: 'bg-info', gradientClass: 'bg-gradient-start-3'
    },
    {
      label: 'Humeur Moy.',
      value: processedData.length > 0 ? `${processedData[0].calculatedAvgRating}/3` : '-',
      icon: 'mdi:emoticon-happy-outline', bgColor: 'bg-success-main', gradientClass: 'bg-gradient-start-4'
    }
  ], [processedData, thisWeek]);

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

      {/* Journal — pattern card + DailyLogsTable */}
      <div className='card mt-24'>
        <div className='card-header d-flex flex-wrap align-items-center justify-content-between gap-3'>
          <h6 className='text-lg mb-0 fw-semibold'>📋 Journal Alimentaire</h6>
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
          ) : processedData.length === 0 ? (
            <div className='text-center py-40'>
              <h6 className='text-secondary-light fw-normal'>Aucun journal alimentaire enregistré</h6>
              <p className='text-sm text-secondary-light'>Commence à suivre ton alimentation quotidienne</p>
            </div>
          ) : (
            <div className='d-flex flex-column gap-0'>
              {processedData.map(row => (
                <div key={row.id}
                  className='d-flex align-items-center justify-content-between gap-3 px-24 py-16 border-bottom cursor-pointer'
                  style={{ cursor: 'pointer', transition: 'background 0.15s' }}
                  onClick={() => setShowDetail(row)}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bs-gray-100, #f8f9fa)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  {/* Date + Day */}
                  <div className='d-flex align-items-center gap-12'>
                    <div className='flex-shrink-0'>
                      <div className='w-40-px h-40-px bg-primary-50 rounded-circle d-flex justify-content-center align-items-center'>
                        <span className='fw-bold text-primary-600 text-sm'>
                          {row.dayOfMonth}
                        </span>
                      </div>
                    </div>
                    <div className='flex-grow-1'>
                      <h6 className='text-md mb-0 fw-medium text-primary-light'>{row.formattedDate}</h6>
                      {row.feeling && <span className='text-sm text-secondary-light fw-normal'>{row.feeling}</span>}
                    </div>
                  </div>

                  {/* Ratings */}
                  <div className='d-none d-md-flex align-items-center gap-12'>
                    <div className='text-center'>
                      <span className='text-xs text-secondary-light d-block'>Petit-déj</span>
                      {renderStars(row.breakfast_rating)}
                    </div>
                    <div className='text-center'>
                      <span className='text-xs text-secondary-light d-block'>Déjeuner</span>
                      {renderStars(row.lunch_rating)}
                    </div>
                    <div className='text-center'>
                      <span className='text-xs text-secondary-light d-block'>Dîner</span>
                      {renderStars(row.dinner_rating)}
                    </div>
                  </div>

                  {/* Mobile: avg badge */}
                  <div className='d-flex d-md-none'>
                    <span className={`px-12 py-6 rounded-pill fw-medium text-sm ${row.calculatedAvgRating >= 2 ? 'bg-success-focus text-success-main' : row.calculatedAvgRating >= 1 ? 'bg-warning-focus text-warning-main' : 'bg-danger-focus text-danger-main'}`}>
                      {row.calculatedAvgRating}/3
                    </span>
                  </div>

                  {/* Badges + Actions */}
                  <div className='d-flex align-items-center gap-8'>
                    {row.craquage_exces && (
                      <span className='bg-danger-focus text-danger-main px-10 py-4 radius-8 fw-medium text-sm d-none d-lg-inline'>
                        🍫 Excès
                      </span>
                    )}
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
                <h6 className='text-lg fw-semibold mb-0'>📅 {formatDateLong(showDetail.date)}</h6>
                <button type='button' className='btn-close' onClick={() => setShowDetail(null)}></button>
              </div>
              <div className='modal-body p-24'>
                {/* Ratings grid */}
                <h6 className='text-md fw-semibold mb-16'>Évaluations</h6>
                <div className='d-flex flex-column gap-12 mb-24'>
                  {Object.entries(RATING_LABELS).map(([key, label]) => (
                    <div key={key} className='d-flex align-items-center justify-content-between gap-3'>
                      <span className='text-sm text-primary-light fw-medium'>{label}</span>
                      {renderStars(showDetail[key])}
                    </div>
                  ))}
                </div>

                {/* Info cards */}
                {showDetail.objectif_text && (
                  <div className='card shadow-none border mb-12'>
                    <div className='card-body p-16'>
                      <h6 className='text-sm fw-semibold text-primary-600 mb-4'>🎯 Objectif du jour</h6>
                      <p className='text-sm text-primary-light mb-0'>{showDetail.objectif_text}</p>
                    </div>
                  </div>
                )}
                {showDetail.feeling && (
                  <div className='card shadow-none border mb-12'>
                    <div className='card-body p-16'>
                      <h6 className='text-sm fw-semibold text-warning-main mb-4'>😊 Feeling</h6>
                      <p className='text-sm text-primary-light mb-0'>{showDetail.feeling}</p>
                    </div>
                  </div>
                )}
                {showDetail.craquage_exces && (
                  <div className='card shadow-none border border-danger-200 mb-12'>
                    <div className='card-body p-16'>
                      <h6 className='text-sm fw-semibold text-danger-main mb-4'>🍫 Craquage / Excès</h6>
                      <p className='text-sm text-primary-light mb-0'>{showDetail.craquage_exces}</p>
                    </div>
                  </div>
                )}

                {/* Diet items */}

                {showDetail.items && showDetail.items.length > 0 && (
                  <>
                    <div className='d-flex align-items-center justify-content-between mb-12 mt-16'>
                      <h6 className='text-md fw-semibold mb-0'>🍴 Détails repas</h6>
                      <div className='d-flex align-items-center gap-12 flex-wrap'>
                        <span className='bg-primary-50 text-primary-600 px-8 py-4 radius-4 text-xs fw-medium'>
                          Kcal: {Math.round(showDetail.items.reduce((acc, it) => acc + ((parseFloat(it.calories) || 0) * (parseFloat(it.quantity) || 100) / 100), 0))}
                        </span>
                        <span className='bg-neutral-100 text-neutral-600 px-8 py-4 radius-4 text-xs fw-medium'>
                          P: {Math.round(showDetail.items.reduce((acc, it) => acc + ((parseFloat(it.proteins) || 0) * (parseFloat(it.quantity) || 100) / 100), 0))}g
                        </span>
                        <span className='bg-neutral-100 text-neutral-600 px-8 py-4 radius-4 text-xs fw-medium'>
                          G: {Math.round(showDetail.items.reduce((acc, it) => acc + ((parseFloat(it.carbohydrates) || 0) * (parseFloat(it.quantity) || 100) / 100), 0))}g
                        </span>
                        <span className='bg-neutral-100 text-neutral-600 px-8 py-4 radius-4 text-xs fw-medium'>
                          L: {Math.round(showDetail.items.reduce((acc, it) => acc + ((parseFloat(it.fats) || 0) * (parseFloat(it.quantity) || 100) / 100), 0))}g
                        </span>
                      </div>
                    </div>

                    <div className='d-flex flex-column gap-12'>
                      {showDetail.items.map((item, i) => {
                        const qttyMultiplier = (parseFloat(item.quantity) || 100) / 100;
                        const hasNutritionInfo = item.calories !== null && item.calories !== undefined;

                        return (
                        <div key={i} className='d-flex align-items-center gap-12 bg-neutral-50 p-12 radius-8 border border-neutral-200'>
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.item_text} className='radius-4 flex-shrink-0' style={{ width: 48, height: 48, objectFit: 'cover' }} />
                          ) : (
                            <div className='bg-neutral-200 radius-4 d-flex justify-content-center align-items-center text-neutral-500 flex-shrink-0' style={{ width: 48, height: 48 }}>
                              <Icon icon='mdi:food-apple' width='24' height='24' />
                            </div>
                          )}

                          <div className='flex-grow-1 overflow-hidden'>
                            <div className='d-flex align-items-center justify-content-between gap-8 mb-4'>
                              <div className='d-flex align-items-center gap-8'>
                                <span className='bg-primary-focus text-primary-main px-8 py-2 radius-4 fw-medium text-xs'>
                                  {MEAL_TYPE_LABELS[item.meal_type] || item.meal_type}
                                </span>
                                <h6 className='text-sm fw-medium mb-0 text-truncate text-primary-light' style={{ maxWidth: '160px' }}>{item.item_text}</h6>
                              </div>
                              <span className='text-xs fw-medium text-neutral-500 whitespace-nowrap'>{item.quantity || 100}{item.unit || 'g'}</span>
                            </div>

                            {hasNutritionInfo ? (
                              <div className='d-flex align-items-center gap-8 flex-wrap mt-8'>
                                <span className='text-xs text-primary-main bg-primary-50 px-6 py-2 radius-4 fw-medium'>
                                  {Math.round((parseFloat(item.calories) || 0) * qttyMultiplier)} kcal
                                </span>
                                {item.proteins !== null && <span className='text-xs text-neutral-500'>P: {Math.round((parseFloat(item.proteins) || 0) * qttyMultiplier)}g</span>}
                                {item.carbohydrates !== null && <span className='text-xs text-neutral-500'>G: {Math.round((parseFloat(item.carbohydrates) || 0) * qttyMultiplier)}g</span>}
                                {item.fats !== null && <span className='text-xs text-neutral-500'>L: {Math.round((parseFloat(item.fats) || 0) * qttyMultiplier)}g</span>}
                              </div>
                            ) : (
                              <div className='mt-8'>
                                <span className='text-xs text-neutral-400 fst-italic'>Aucune donnée nutritionnelle</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )})}
                    </div>
                  </>
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
                      <input type='date' className='form-control radius-8' value={form.date}
                        onChange={e => setField('date', e.target.value)} required />
                    </div>
                    <div className='col-sm-5'>
                      <label className='form-label fw-semibold text-primary-light text-sm'>Semaine</label>
                      <input type='number' className='form-control radius-8' placeholder='Nº'
                        value={form.week_number} onChange={e => setField('week_number', e.target.value)} />
                    </div>
                  </div>

                  <h6 className='text-md fw-semibold mb-16'>📊 Évaluations</h6>
                  <div className='row gy-0'>
                    {Object.keys(RATING_LABELS).map(field => (
                      <div className='col-sm-6' key={field}>
                        <StarInput field={field} value={form[field]} />
                      </div>
                    ))}
                  </div>

                  <div className='row gy-3 mb-20'>
                    <div className='col-12'>
                      <label className='form-label fw-semibold text-primary-light text-sm'>🎯 Objectif du jour</label>
                      <input type='text' className='form-control radius-8' placeholder='Ex: Manger plus de légumes'
                        value={form.objectif_text} onChange={e => setField('objectif_text', e.target.value)} />
                    </div>
                    <div className='col-sm-6'>
                      <label className='form-label fw-semibold text-primary-light text-sm'>🍫 Craquage</label>
                      <input type='text' className='form-control radius-8' placeholder='Ex: Chocolat'
                        value={form.craquage_exces} onChange={e => setField('craquage_exces', e.target.value)} />
                    </div>
                    <div className='col-sm-6'>
                      <label className='form-label fw-semibold text-primary-light text-sm'>😊 Feeling</label>
                      <input type='text' className='form-control radius-8' placeholder='Énergie...'
                        value={form.feeling} onChange={e => setField('feeling', e.target.value)} />
                    </div>
                  </div>

                  {/* Items */}
                  <div className='d-flex align-items-center justify-content-between mb-12'>
                    <h6 className='text-md fw-semibold mb-0'>🍴 Repas</h6>
                    <button type='button' onClick={addItem} className='btn btn-primary-600 btn-sm d-flex align-items-center gap-1'>
                      <Icon icon='mdi:plus' /> Aliment
                    </button>
                  </div>
                  <div className='d-flex flex-column gap-8'>
                    {form.items.map((item, idx) => (
                      <div key={idx} className='d-flex flex-column gap-8 mb-16 p-16 bg-neutral-50 radius-8 border border-neutral-200'>
                        <div className='d-flex align-items-center justify-content-between gap-12'>
                          <div className='d-flex align-items-center gap-8 flex-grow-1'>
                            <select className='form-select radius-8 bg-white' style={{ maxWidth: 140 }}
                              value={item.meal_type} onChange={e => updateItem(idx, 'meal_type', e.target.value)}>
                              {MEAL_TYPES.map(mt => <option key={mt} value={mt}>{MEAL_TYPE_LABELS[mt]}</option>)}
                            </select>
                            <div className='flex-grow-1 position-relative'>
                              <FoodSearchAutocomplete
                                value={item.item_text}
                                onChange={(val) => updateItem(idx, 'item_text', val)}
                                onSelect={(product) => handleFoodSelect(idx, product)}
                              />
                            </div>
                          </div>
                          <button type='button' onClick={() => removeItem(idx)}
                            className='w-32-px h-32-px d-inline-flex justify-content-center align-items-center bg-danger-100 text-danger-600 bg-hover-danger-600 text-hover-white text-md rounded-circle flex-shrink-0'>
                            <Icon icon='mdi:close' />
                          </button>
                        </div>

                        {/* Nutrition inputs for the selected item */}
                        <div className='d-flex align-items-center gap-12 flex-wrap'>
                          <div className='d-flex align-items-center gap-4 bg-white px-8 py-4 radius-4 border'>
                            <input type="number" className="form-control form-control-sm border-0 bg-transparent text-end p-0" style={{width: 50}} value={item.quantity || ''} onChange={e => updateItem(idx, 'quantity', e.target.value)} placeholder="0" />
                            <select className="form-select form-select-sm border-0 bg-transparent p-0 text-primary-light" style={{width: 40, paddingRight: '20px!important', backgroundPosition: 'right 0.2rem center'}} value={item.unit || 'g'} onChange={e => updateItem(idx, 'unit', e.target.value)}>
                              <option value="g">g</option>
                              <option value="ml">ml</option>
                              <option value="unité">u</option>
                            </select>
                          </div>
                          <div className='d-flex align-items-center gap-4 bg-white px-8 py-4 radius-4 border'>
                            <span className="text-xs text-primary-light">Kcal:</span>
                            <input type="number" className="form-control form-control-sm border-0 bg-transparent text-end p-0" style={{width: 40}} value={item.calories || ''} onChange={e => updateItem(idx, 'calories', e.target.value)} placeholder="0" />
                          </div>
                          <div className='d-flex align-items-center gap-4 bg-white px-8 py-4 radius-4 border'>
                            <span className="text-xs text-neutral-500">P:</span>
                            <input type="number" className="form-control form-control-sm border-0 bg-transparent text-end p-0" style={{width: 30}} value={item.proteins || ''} onChange={e => updateItem(idx, 'proteins', e.target.value)} placeholder="0" />
                          </div>
                          <div className='d-flex align-items-center gap-4 bg-white px-8 py-4 radius-4 border'>
                            <span className="text-xs text-neutral-500">G:</span>
                            <input type="number" className="form-control form-control-sm border-0 bg-transparent text-end p-0" style={{width: 30}} value={item.carbohydrates || ''} onChange={e => updateItem(idx, 'carbohydrates', e.target.value)} placeholder="0" />
                          </div>
                          <div className='d-flex align-items-center gap-4 bg-white px-8 py-4 radius-4 border'>
                            <span className="text-xs text-neutral-500">L:</span>
                            <input type="number" className="form-control form-control-sm border-0 bg-transparent text-end p-0" style={{width: 30}} value={item.fats || ''} onChange={e => updateItem(idx, 'fats', e.target.value)} placeholder="0" />
                          </div>
                        </div>
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

export default DailyDietLayer;
