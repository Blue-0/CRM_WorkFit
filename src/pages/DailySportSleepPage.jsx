import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import DailySportSleepLayer from "../components/sante/DailySportSleepLayer";
import WorkoutGenerator from "../components/sante/WorkoutGenerator";

const DailySportSleepPage = () => {
  const userId = localStorage.getItem('user_id');

  return (
    <MasterLayout>
      <Breadcrumb title='Sport & Sommeil' />
      {/* <DailySportSleepLayer userId={userId} /> */}
      <WorkoutGenerator userId={userId} />
    </MasterLayout>
  );
};

export default DailySportSleepPage;
