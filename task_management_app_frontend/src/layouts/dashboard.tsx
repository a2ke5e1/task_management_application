import { Outlet } from "react-router";
import {
  BottomNavigation,
  NavigationRail,
} from "../components/navigation-rail/navigation-rail";

const DashboardLayout = () => {
  return (
    <>
      <div className="flex flex-row">
        <div className="hidden sm:block">
          <NavigationRail />
        </div>
        <div className="bg-surface-container-lowest text-on-surface mt-4 mr-4 mb-20 ml-4 h-[calc(100vh-6rem)] w-full overflow-auto rounded-2xl p-4 sm:mb-4 sm:ml-[4.5rem] sm:h-[calc(100vh-2rem)]">
          <Outlet />
        </div>
      </div>
      <div className="block sm:hidden">
        <BottomNavigation />
      </div>
    </>
  );
};

export default DashboardLayout;
