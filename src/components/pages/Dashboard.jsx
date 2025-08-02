import { motion } from "framer-motion";
import DashboardStats from "@/components/organisms/DashboardStats";
import IssueChart from "@/components/organisms/IssueChart";
import RecentActivity from "@/components/organisms/RecentActivity";

const Dashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Village Dashboard</h1>
          <p className="text-gray-600">Overview of village administration and activities</p>
        </div>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IssueChart />
        <RecentActivity />
      </div>
    </motion.div>
  );
};

export default Dashboard;