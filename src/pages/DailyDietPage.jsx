import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import DailyDietLayer from "../components/sante/DailyDietLayer";

const DailyDietPage = () => {
  const userId = localStorage.getItem('user_id');

  return (
    <MasterLayout>
      <Breadcrumb title='Alimentation Quotidienne' />
      <DailyDietLayer userId={userId} />
    </MasterLayout>
  );
};

export default DailyDietPage;
