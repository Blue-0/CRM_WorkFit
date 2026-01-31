import { useState, useEffect } from 'react';
import { Icon } from "@iconify/react";

const API_URL = 'http://localhost:3001';

const HealthKPIs = () => {
  const [kpis, setKpis] = useState({
    avg_weight: 0,
    total_steps: 0,
    avg_sleep_hours: 0,
    total_sport_min: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const response = await fetch(`${API_URL}/api/health/kpis`);
        if (response.ok) {
          const data = await response.json();
          setKpis(data);
        }
      } catch (error) {
        console.error('Erreur fetch KPIs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchKPIs();
  }, []);

  const kpiCards = [
    {
      label: 'Poids Actuel',
      value: `${kpis.avg_weight?.toFixed(1) || '0'} kg`,
      icon: 'healthicons:weight',
      bgColor: 'bg-success-main',
      gradientClass: 'bg-gradient-start-4',
      trend: '+0.5 kg',
      trendUp: false
    },
    {
      label: 'Total Pas (Semaine)',
      value: kpis.total_steps?.toLocaleString() || '0',
      icon: 'mdi:walk',
      bgColor: 'bg-cyan',
      gradientClass: 'bg-gradient-start-1',
      trend: '+2,500',
      trendUp: true
    },
    {
      label: 'Sommeil Moyen',
      value: `${kpis.avg_sleep_hours?.toFixed(1) || '0'} h`,
      icon: 'mdi:sleep',
      bgColor: 'bg-purple',
      gradientClass: 'bg-gradient-start-2',
      trend: '+0.3 h',
      trendUp: true
    },
    {
      label: 'Sport (Semaine)',
      value: `${kpis.total_sport_min || 0} min`,
      icon: 'mdi:dumbbell',
      bgColor: 'bg-warning-main',
      gradientClass: 'bg-gradient-start-3',
      trend: '+45 min',
      trendUp: true
    }
  ];

  if (loading) {
    return (
      <div className='row row-cols-xxxl-4 row-cols-lg-2 row-cols-sm-2 row-cols-1 gy-4'>
        {[1, 2, 3, 4].map(i => (
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
        ))}
      </div>
    );
  }

  return (
    <div className='row row-cols-xxxl-4 row-cols-lg-2 row-cols-sm-2 row-cols-1 gy-4'>
      {kpiCards.map((kpi, index) => (
        <div key={index} className='col'>
          <div className={`card shadow-none border ${kpi.gradientClass} h-100`}>
            <div className='card-body p-20'>
              <div className='d-flex flex-wrap align-items-center justify-content-between gap-3'>
                <div>
                  <p className='fw-medium text-primary-light mb-1'>{kpi.label}</p>
                  <h6 className='mb-0'>{kpi.value}</h6>
                </div>
                <div className={`w-50-px h-50-px ${kpi.bgColor} rounded-circle d-flex justify-content-center align-items-center`}>
                  <Icon
                    icon={kpi.icon}
                    className='text-white text-2xl mb-0'
                  />
                </div>
              </div>
              <p className='fw-medium text-sm text-primary-light mt-12 mb-0 d-flex align-items-center gap-2'>
                <span className={`d-inline-flex align-items-center gap-1 ${kpi.trendUp ? 'text-success-main' : 'text-danger-main'}`}>
                  <Icon icon={kpi.trendUp ? 'bxs:up-arrow' : 'bxs:down-arrow'} className='text-xs' />
                  {kpi.trend}
                </span>
                vs semaine dernière
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HealthKPIs;
