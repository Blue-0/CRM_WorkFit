import { useAuth } from "../context/AuthContext";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import DailyDietLayer from "../components/sante/DailyDietLayer";

const DailyDietPage = () => {
  const { user } = useAuth();
  const userId = user?.id;

  return (
    <MasterLayout>
      <Breadcrumb title='Alimentation Quotidienne' />
      <DailyDietLayer userId={userId} />
    </MasterLayout>
  );
};

export default DailyDietPage;
