import ApperIcon from "@/components/ApperIcon";

const Header = ({ title, village = "Gram Panchayat", onMenuToggle }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <ApperIcon name="Menu" size={20} className="text-gray-600" />
          </button>
          
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              GramSeva Manager
            </h1>
            <p className="text-sm text-gray-600">{village}</p>
          </div>
        </div>
<div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
            <ApperIcon name="MapPin" size={16} />
            <span>{village}</span>
          </div>
          
          <button
            onClick={() => {
              const { ApperUI } = window.ApperSDK;
              ApperUI.logout();
            }}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ApperIcon name="LogOut" size={16} />
            <span>Logout</span>
          </button>
          
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <ApperIcon name="User" size={16} className="text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;