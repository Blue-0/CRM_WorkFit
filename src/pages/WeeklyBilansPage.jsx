import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import WeeklyBilansLayer from "../components/sante/WeeklyBilansLayer";

const WeeklyBilansPage = () => {
  const userId = localStorage.getItem('user_id');

  return (
    <MasterLayout>
      <Breadcrumb title='Bilans Hebdomadaires' />
      <WeeklyBilansLayer userId={userId} />
    </MasterLayout>
  );
};

export default WeeklyBilansPage;
