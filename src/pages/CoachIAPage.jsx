import { useAuth } from "../context/AuthContext";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import WorkoutChatLayer from "../components/sante/WorkoutChatLayer";

const CoachIAPage = () => {
  const { user } = useAuth();
  const userId = user?.id;

  return (
    <MasterLayout>
      <Breadcrumb title='Coach IA' />
      <WorkoutChatLayer userId={userId} />
    </MasterLayout>
  );
};

export default CoachIAPage;
