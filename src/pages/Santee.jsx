import React from 'react';
import { useAuth } from '../context/AuthContext';
import MasterLayout from "../masterLayout/MasterLayout";
import HealthKPIs from "../components/sante/HealthKPIs";
import WeightTracker from "../components/sante/WeightTracker";
import TrainingDistribution from "../components/sante/TrainingDistribution";
import DietCompliance from "../components/sante/DietCompliance";
import DailyLogsTable from "../components/sante/DailyLogsTable";
import { Icon } from "@iconify/react";

const Santee = () => {
  const { user, logout } = useAuth();
  const handleLogout = () => logout();

  if (!user) return null;

  return (
    <MasterLayout>
      {/* Breadcrumb */}
      <div className='d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24'>
        <div className="d-flex align-items-center gap-3">
          <h6 className='fw-semibold mb-0'>🏋️ Tableau de Bord Santé</h6>
          <span className="badge bg-primary-600 text-white rounded-pill px-16 py-8 d-flex align-items-center gap-2">
            <Icon icon="solar:user-circle-bold" />
            {user.email}
          </span>
        </div>
        
        <div className="d-flex align-items-center gap-3">
          <button 
            onClick={handleLogout}
            className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2"
          >
            <Icon icon="solar:logout-bold" />
            Déconnexion
          </button>
          <ul className='d-flex align-items-center gap-2 mb-0'>
            <li className='fw-medium'>
              <a href='/' className='d-flex align-items-center gap-1 hover-text-primary'>
                <span className='text-secondary-light'>Dashboard</span>
              </a>
            </li>
            <li>-</li>
            <li className='fw-medium text-primary-600'>Santé</li>
          </ul>
        </div>
      </div>

      {/* KPIs Row */}
      <HealthKPIs userId={user.id} />

      {/* Charts Section */}
      <section className='row gy-4 mt-1'>
        
        {/* Graphique principal : Évolution du poids */}
        <div className="col-xxl-8 col-lg-12">
          <WeightTracker userId={user.id} />
        </div>

        {/* Graphique secondaire : Compliance diète */}
        <div className="col-xxl-4 col-lg-6">
          <DietCompliance userId={user.id} />
        </div>

        {/* Répartition des types d'entrainements */}
        <div className="col-xxl-6 col-lg-6">
          <TrainingDistribution userId={user.id} />
        </div>

        {/* Tableau détaillé des logs */}
        <div className="col-xxl-6 col-lg-12">
          <DailyLogsTable userId={user.id} />
        </div>

      </section>
    </MasterLayout>
  );
};

export default Santee;