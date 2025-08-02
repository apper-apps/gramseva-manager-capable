import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isMobileOpen, onMobileClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard", path: "/" },
    { id: "residents", label: "Residents", icon: "Users", path: "/residents" },
    { id: "families", label: "Families", icon: "Home", path: "/families" },
    { id: "issues", label: "Issues", icon: "AlertCircle", path: "/issues" },
    { id: "activities", label: "Activities", icon: "Calendar", path: "/activities" },
    { id: "reports", label: "Reports", icon: "FileText", path: "/reports" }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:block w-64 bg-white border-r border-gray-200 h-screen">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="Building2" size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Village Hub</h2>
            <p className="text-xs text-gray-500">Administration</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                whileHover={{ x: 4 }}
                className={`sidebar-item w-full ${isActive ? "active" : ""}`}
              >
                <ApperIcon name={item.icon} size={20} />
                <span className="ml-3 font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </nav>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onMobileClose}
        />
      )}
      
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isMobileOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-white z-50 shadow-lg"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Building2" size={20} className="text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Village Hub</h2>
                <p className="text-xs text-gray-500">Administration</p>
              </div>
            </div>
            
            <button
              onClick={onMobileClose}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <ApperIcon name="X" size={20} className="text-gray-600" />
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`sidebar-item w-full ${isActive ? "active" : ""}`}
                >
                  <ApperIcon name={item.icon} size={20} />
                  <span className="ml-3 font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </motion.div>
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;