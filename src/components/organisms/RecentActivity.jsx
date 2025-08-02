import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { issueService } from "@/services/api/issueService";
import { activityService } from "@/services/api/activityService";

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRecentActivity = async () => {
    try {
      setLoading(true);
      setError("");

      const [issues, events] = await Promise.all([
        issueService.getAll(),
        activityService.getAll()
      ]);

const recentIssues = issues
        .sort((a, b) => new Date(b.ModifiedOn || b.CreatedOn) - new Date(a.ModifiedOn || a.CreatedOn))
        .slice(0, 3)
        .map(issue => ({
          id: issue.Id,
          type: "issue",
          title: issue.title,
          description: `Issue reported: ${issue.category}`,
          timestamp: issue.ModifiedOn || issue.CreatedOn,
          icon: "AlertCircle",
          color: issue.status === "Resolved" ? "text-green-600" : "text-red-600"
        }));

const recentEvents = events
        .sort((a, b) => new Date(b.CreatedOn) - new Date(a.CreatedOn))
        .slice(0, 2)
        .map(event => ({
          id: event.Id,
          type: "activity",
          title: event.title,
          description: `${event.type} scheduled`,
          timestamp: event.CreatedOn,
          icon: "Calendar",
          color: "text-blue-600"
        }));
      const combined = [...recentIssues, ...recentEvents]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);

      setActivities(combined);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecentActivity();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadRecentActivity} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      
      <div className="space-y-4">
{activities.map((activity, index) => (
          <motion.div
            key={activity.id ? `${activity.type || 'activity'}-${activity.id}` : `fallback-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center ${activity.color}`}>
              <ApperIcon name={activity.icon} size={16} />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {activity.title}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {activity.description}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {format(new Date(activity.timestamp), "MMM dd, HH:mm")}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecentActivity;