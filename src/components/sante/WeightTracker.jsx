import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const API_URL = 'http://localhost:3001';

const WeightTracker = () => {
  const [weightData, setWeightData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeightHistory = async () => {
      try {
        const response = await fetch(`${API_URL}/api/health/weight-history`);
        if (response.ok) {
          const data = await response.json();
          setWeightData(data);
        }
      } catch (error) {
        console.error('Erreur fetch weight history:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWeightHistory();
  }, []);

  // Préparer les données pour le graphique
  const categories = weightData.map(d => `S${d.week_number}`);
  const weights = weightData.map(d => parseFloat(d.avg_weight) || 0);

  const chartSeries = [
    {
      name: 'Poids (kg)',
      data: weights.length > 0 ? weights : [75, 74.5, 74.8, 74.2, 73.9, 73.5, 73.8, 73.2, 72.9, 72.5, 72.8, 72.3]
    }
  ];

  const chartOptions = {
    chart: {
      height: 300,
      type: 'area',
      toolbar: { show: false },
      zoom: { enabled: false },
      dropShadow: {
        enabled: true,
        top: 6,
        left: 0,
        blur: 4,
        color: '#45B369',
        opacity: 0.2
      }
    },
    colors: ['#45B369'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 100]
      }
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    markers: {
      size: 4,
      strokeWidth: 2,
      hover: { size: 7 }
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 4,
      row: {
        colors: ['transparent'],
        opacity: 0.5
      }
    },
    xaxis: {
      categories: categories.length > 0 ? categories : ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10', 'S11', 'S12'],
      labels: {
        style: { fontSize: '12px', colors: '#6B7280' }
      },
      axisBorder: { show: false }
    },
    yaxis: {
      labels: {
        formatter: (value) => `${value} kg`,
        style: { fontSize: '12px', colors: '#6B7280' }
      },
      min: (min) => Math.floor(min - 2),
      max: (max) => Math.ceil(max + 2)
    },
    tooltip: {
      y: {
        formatter: (value) => `${value.toFixed(1)} kg`
      }
    }
  };

  return (
    <div className='card h-100'>
      <div className='card-body'>
        <div className='d-flex flex-wrap align-items-center justify-content-between mb-20'>
          <h6 className='text-lg mb-0 fw-semibold'>📊 Évolution du Poids</h6>
          <select
            className='form-select bg-base form-select-sm w-auto'
            defaultValue='12weeks'
          >
            <option value='12weeks'>12 Semaines</option>
            <option value='6months'>6 Mois</option>
            <option value='1year'>1 An</option>
          </select>
        </div>
        
        {loading ? (
          <div className='d-flex justify-content-center align-items-center' style={{ height: 300 }}>
            <div className='spinner-border text-primary' role='status'>
              <span className='visually-hidden'>Chargement...</span>
            </div>
          </div>
        ) : (
          <ReactApexChart
            options={chartOptions}
            series={chartSeries}
            type='area'
            height={300}
          />
        )}
      </div>
    </div>
  );
};

export default WeightTracker;
