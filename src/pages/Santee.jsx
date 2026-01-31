import React from 'react';
import MasterLayout from "../masterLayout/MasterLayout";
import HealthKPIs from "../components/sante/HealthKPIs";
import WeightTracker from "../components/sante/WeightTracker";
import TrainingDistribution from "../components/sante/TrainingDistribution";
import DietCompliance from "../components/sante/DietCompliance";
import DailyLogsTable from "../components/sante/DailyLogsTable";

const Santee = () => {
  return (
    <MasterLayout>
      {/* Breadcrumb */}
      <div className='d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24'>
        <h6 className='fw-semibold mb-0'>🏋️ Tableau de Bord Santé</h6>
        <ul className='d-flex align-items-center gap-2'>
          <li className='fw-medium'>
            <a href='/' className='d-flex align-items-center gap-1 hover-text-primary'>
              <span className='text-secondary-light'>Dashboard</span>
            </a>
          </li>
          <li>-</li>
          <li className='fw-medium text-primary-600'>Santé</li>
        </ul>
      </div>

      {/* KPIs Row */}
      <HealthKPIs />

      {/* Charts Section */}
      <section className='row gy-4 mt-1'>
        
        {/* Graphique principal : Évolution du poids */}
        <div className="col-xxl-8 col-lg-12">
          <WeightTracker />
        </div>

        {/* Graphique secondaire : Compliance diète */}
        <div className="col-xxl-4 col-lg-6">
          <DietCompliance />
        </div>

        {/* Répartition des types d'entrainements */}
        <div className="col-xxl-6 col-lg-6">
          <TrainingDistribution />
        </div>

        {/* Tableau détaillé des logs */}
        <div className="col-xxl-6 col-lg-12">
          <DailyLogsTable />
        </div>

      </section>
    </MasterLayout>
  );
};

export default Santee;