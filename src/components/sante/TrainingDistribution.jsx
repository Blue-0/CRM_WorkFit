import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const API_URL = 'http://localhost:3001';

const TrainingDistribution = ({ userId }) => {
  const [trainingData, setTrainingData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainingDistribution = async () => {
      try {
        const response = await fetch(`${API_URL}/api/health/training-distribution`, {
          headers: { 'x-user-id': userId }
        });
        if (response.ok) {
          const data = await response.json();
          setTrainingData(data);
        }
      } catch (error) {
        console.error('Erreur fetch training distribution:', error);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchTrainingDistribution();
  }, [userId]);

  // Données par défaut si pas de données API
  const defaultData = [
    { workout_type: 'Jambes', count: 8 },
    { workout_type: 'Dos', count: 6 },
    { workout_type: 'Pecs/Épaules', count: 7 },
    { workout_type: 'Bras', count: 5 },
    { workout_type: 'Cardio', count: 4 },
    { workout_type: 'Full Body', count: 3 }
  ];

  const data = trainingData.length > 0 ? trainingData : defaultData;
  const categories = data.map(d => d.workout_type);
  const values = data.map(d => parseInt(d.count));

  const chartSeries = [{
    name: 'Séances',
    data: values
  }];

  const chartOptions = {
    chart: {
      type: 'bar',
      height: 300,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        barHeight: '60%',
        distributed: true
      }
    },
    colors: ['#487FFF', '#45B369', '#FF9F29', '#F97316', '#8B5CF6', '#EC4899'],
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val} séances`,
      style: {
        fontSize: '12px',
        fontWeight: 600
      },
      offsetX: 5
    },
    legend: { show: false },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 4,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } }
    },
    xaxis: {
      categories: categories,
      labels: {
        style: { fontSize: '12px', colors: '#6B7280' }
      }
    },
    yaxis: {
      labels: {
        style: { fontSize: '13px', colors: '#374151', fontWeight: 500 }
      }
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} séances ce mois`
      }
    }
  };

  return (
    <div className='card h-100'>
      <div className='card-body'>
        <div className='d-flex flex-wrap align-items-center justify-content-between mb-20'>
          <h6 className='text-lg mb-0 fw-semibold'>💪 Répartition Entraînements</h6>
          <select
            className='form-select bg-base form-select-sm w-auto'
            defaultValue='month'
          >
            <option value='week'>Cette Semaine</option>
            <option value='month'>Ce Mois</option>
            <option value='quarter'>3 Mois</option>
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
            type='bar'
            height={300}
          />
        )}
      </div>
    </div>
  );
};

export default TrainingDistribution;
