import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const DietCompliance = () => {
  const [complianceData, setComplianceData] = useState({
    good: 18,
    medium: 8,
    bad: 4
  });

  // Simulation de données - À remplacer par un vrai endpoint API
  useEffect(() => {
    // TODO: Créer un endpoint pour calculer la compliance diète
    // Basé sur feeling_notes ou un nouveau champ dans daily_logs
  }, []);

  const total = complianceData.good + complianceData.medium + complianceData.bad;
  const goodPercent = Math.round((complianceData.good / total) * 100);
  const mediumPercent = Math.round((complianceData.medium / total) * 100);
  const badPercent = Math.round((complianceData.bad / total) * 100);

  const chartSeries = [complianceData.good, complianceData.medium, complianceData.bad];

  const chartOptions = {
    chart: {
      type: 'donut',
      height: 280
    },
    colors: ['#45B369', '#FF9F29', '#EF4444'],
    labels: ['Bon', 'Moyen', 'Mauvais'],
    legend: {
      show: true,
      position: 'bottom',
      fontSize: '13px',
      labels: { colors: '#374151' },
      markers: { width: 12, height: 12, radius: 6 }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '14px',
              color: '#6B7280'
            },
            value: {
              show: true,
              fontSize: '24px',
              fontWeight: 700,
              color: '#111827',
              formatter: (val) => `${val} jours`
            },
            total: {
              show: true,
              label: 'Total',
              fontSize: '14px',
              color: '#6B7280',
              formatter: () => `${total} jours`
            }
          }
        }
      }
    },
    dataLabels: { enabled: false },
    stroke: { width: 0 },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: { height: 250 },
        legend: { position: 'bottom' }
      }
    }]
  };

  return (
    <div className='card h-100'>
      <div className='card-body'>
        <h6 className='text-lg mb-16 fw-semibold'>🥗 Compliance Diète</h6>
        
        <ReactApexChart
          options={chartOptions}
          series={chartSeries}
          type='donut'
          height={280}
        />

        <div className='mt-20'>
          <div className='d-flex justify-content-between align-items-center mb-12'>
            <div className='d-flex align-items-center gap-2'>
              <span className='w-12-px h-12-px rounded-circle bg-success-main'></span>
              <span className='text-sm text-secondary-light'>Bon ({goodPercent}%)</span>
            </div>
            <span className='fw-semibold text-sm'>{complianceData.good} jours</span>
          </div>
          <div className='d-flex justify-content-between align-items-center mb-12'>
            <div className='d-flex align-items-center gap-2'>
              <span className='w-12-px h-12-px rounded-circle bg-warning-main'></span>
              <span className='text-sm text-secondary-light'>Moyen ({mediumPercent}%)</span>
            </div>
            <span className='fw-semibold text-sm'>{complianceData.medium} jours</span>
          </div>
          <div className='d-flex justify-content-between align-items-center'>
            <div className='d-flex align-items-center gap-2'>
              <span className='w-12-px h-12-px rounded-circle bg-danger-main'></span>
              <span className='text-sm text-secondary-light'>Mauvais ({badPercent}%)</span>
            </div>
            <span className='fw-semibold text-sm'>{complianceData.bad} jours</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietCompliance;
