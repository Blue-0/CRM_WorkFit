import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import DailySportSleepLayer from "../components/sante/DailySportSleepLayer";

const DailySportSleepPage = () => {
  const userId = localStorage.getItem('user_id');

  return (
    <MasterLayout>
      <Breadcrumb title='Sport & Sommeil' />
      <DailySportSleepLayer userId={userId} />
    </MasterLayout>
  );
};

export default DailySportSleepPage;
