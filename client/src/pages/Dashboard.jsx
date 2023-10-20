import ListingDashboard from '../components/ListingDashboard';
import UserDashboard from '../components/UserDashboard';

export default function Dashboard() {
  const token = localStorage.getItem('token');
  console.log(token);
  return (
    <div>
      <div className="flex w-full items-center mt-7">
        <h1 className="text-3xl text-slate-700 mx-auto font-semibold">Admin Dashboard</h1>
      </div>
      <div className="mx-7">
        <ListingDashboard />
      </div>
      <div className="mx-7">
        <UserDashboard />
      </div>
    </div>
  );
}
