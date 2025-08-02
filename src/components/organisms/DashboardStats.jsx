import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { residentService } from "@/services/api/residentService";
import { familyService } from "@/services/api/familyService";
import { issueService } from "@/services/api/issueService";
import { activityService } from "@/services/api/activityService";

const DashboardStats = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = async () => {
    try {
      setLoading(true);
      setError("");

      const [residents, families, issues, activities] = await Promise.all([
        residentService.getAll(),
        familyService.getAll(),
        issueService.getAll(),
        activityService.getAll()
      ]);

      const activeIssues = issues.filter(issue => issue.status !== "Resolved");
      const upcomingActivities = activities.filter(activity => 
        new Date(activity.date) > new Date() && activity.status === "Upcoming"
      );

      setStats({
        totalResidents: residents.length,
        totalFamilies: families.length,
        activeIssues: activeIssues.length,
        upcomingActivities: upcomingActivities.length,
        residents,
        families,
        issues,
        activities
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadStats} />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <StatCard
          title="Total Residents"
          value={stats.totalResidents}
          icon="Users"
          gradient={true}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <StatCard
          title="Total Families"
          value={stats.totalFamilies}
          icon="Home"
          change="+2 this month"
          changeType="positive"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <StatCard
          title="Active Issues"
          value={stats.activeIssues}
          icon="AlertCircle"
          change={stats.activeIssues > 3 ? "High" : "Normal"}
          changeType={stats.activeIssues > 3 ? "negative" : "positive"}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <StatCard
          title="Upcoming Activities"
          value={stats.upcomingActivities}
          icon="Calendar"
          change="Next 30 days"
          changeType="neutral"
        />
      </motion.div>
    </div>
  );
};

export default DashboardStats;