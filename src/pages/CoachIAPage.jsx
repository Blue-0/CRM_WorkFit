import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import WorkoutChatLayer from "../components/sante/WorkoutChatLayer";

const CoachIAPage = () => {
  const userId = localStorage.getItem('user_id');

  return (
    <MasterLayout>
      <Breadcrumb title='Coach IA' />
      <WorkoutChatLayer userId={userId} />
    </MasterLayout>
  );
};

export default CoachIAPage;
