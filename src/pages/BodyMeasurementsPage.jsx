import { useAuth } from "../context/AuthContext";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import BodyMeasurementsLayer from "../components/sante/BodyMeasurementsLayer";

const BodyMeasurementsPage = () => {
  const { user } = useAuth();
  const userId = user?.id;

  return (
    <MasterLayout>
      <Breadcrumb title='Mensurations Corporelles' />
      <BodyMeasurementsLayer userId={userId} />
    </MasterLayout>
  );
};

export default BodyMeasurementsPage;
