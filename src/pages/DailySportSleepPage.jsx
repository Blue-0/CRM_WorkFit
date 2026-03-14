import { useAuth } from "../context/AuthContext";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import DailySportSleepLayer from "../components/sante/DailySportSleepLayer";
import WorkoutGenerator from "../components/sante/WorkoutGenerator";

const DailySportSleepPage = () => {
  const { user } = useAuth();
  const userId = user?.id;

  return (
    <MasterLayout>
      <Breadcrumb title='Sport & Sommeil' />
      {/* <DailySportSleepLayer userId={userId} /> */}
      <WorkoutGenerator userId={userId} />
    </MasterLayout>
  );
};

export default DailySportSleepPage;
