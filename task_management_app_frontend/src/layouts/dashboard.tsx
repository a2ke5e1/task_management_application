import { Link } from "react-router";
import { Outlet } from "react-router";

const DashboardLayout = () => {
  return (
    <div className="flex flex-row gap-4">
      <div className="flex flex-col gap-4 items-start">
        <Link to="/tasks">Tasks</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/teams">Teams</Link>
      </div>
      <Outlet />
    </div>
  );
};

export default DashboardLayout;
