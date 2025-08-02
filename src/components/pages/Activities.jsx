import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, isFuture, isPast } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import FilterDropdown from "@/components/molecules/FilterDropdown";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { activityService } from "@/services/api/activityService";
import { toast } from "react-toastify";

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const loadActivities = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await activityService.getAll();
      setActivities(data);
      setFilteredActivities(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  useEffect(() => {
    let filtered = activities;

    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.organizerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter) {
      filtered = filtered.filter(activity => activity.type === typeFilter);
    }

    if (statusFilter) {
      if (statusFilter === "Upcoming") {
        filtered = filtered.filter(activity => 
          isFuture(new Date(activity.date)) && activity.status === "Upcoming"
        );
      } else if (statusFilter === "Completed") {
        filtered = filtered.filter(activity => 
          isPast(new Date(activity.date)) || activity.status === "Completed"
        );
      }
    }

    setFilteredActivities(filtered);
  }, [activities, searchTerm, typeFilter, statusFilter]);

  const handleDeleteActivity = async (activityId) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      try {
        await activityService.delete(activityId);
        await loadActivities();
        toast.success("Activity deleted successfully");
      } catch (error) {
        toast.error("Failed to delete activity");
      }
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "Health Camp": return "Heart";
      case "Festival": return "Sparkles";
      case "SHG Meeting": return "Users";
      case "Community Gathering": return "Users2";
      case "Training": return "GraduationCap";
      default: return "Calendar";
    }
  };

  const getStatusBadge = (activity) => {
    const activityDate = new Date(activity.date);
    const now = new Date();
    
    if (activity.status === "Completed" || isPast(activityDate)) {
      return <Badge variant="success">Completed</Badge>;
    } else if (isFuture(activityDate)) {
      return <Badge variant="info">Upcoming</Badge>;
    } else {
      return <Badge variant="warning">Today</Badge>;
    }
  };

  const typeOptions = [
    { value: "", label: "All Types" },
    { value: "Health Camp", label: "Health Camp" },
    { value: "Festival", label: "Festival" },
    { value: "SHG Meeting", label: "SHG Meeting" },
    { value: "Community Gathering", label: "Community Gathering" },
    { value: "Training", label: "Training" }
  ];

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "Upcoming", label: "Upcoming" },
    { value: "Completed", label: "Completed" }
  ];

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadActivities} />;

  const upcomingActivities = filteredActivities.filter(activity => 
    isFuture(new Date(activity.date)) && activity.status === "Upcoming"
  );
  
  const completedActivities = filteredActivities.filter(activity => 
    isPast(new Date(activity.date)) || activity.status === "Completed"
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activities</h1>
          <p className="text-gray-600">Manage village events, meetings, and community activities</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search activities by title, description, or organizer..."
            onSearch={setSearchTerm}
          />
        </div>
        <div className="flex gap-2">
          <FilterDropdown
            options={typeOptions}
            value={typeFilter}
            onChange={setTypeFilter}
            placeholder="Filter by type"
          />
          <FilterDropdown
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Filter by status"
          />
        </div>
      </div>

      {filteredActivities.length === 0 ? (
        <Empty
          title="No activities found"
          description="Activities and events will appear here when they are created"
          icon="Calendar"
        />
      ) : (
        <div className="space-y-8">
          {/* Upcoming Activities */}
          {upcomingActivities.length > 0 && (statusFilter === "" || statusFilter === "Upcoming") && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Activities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingActivities.map((activity, index) => (
                  <motion.div
                    key={activity.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                          <ApperIcon name={getActivityIcon(activity.type)} size={20} className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                          <p className="text-sm text-gray-500">{activity.type}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {getStatusBadge(activity)}
                        <button
                          onClick={() => handleDeleteActivity(activity.Id)}
                          className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors duration-200"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{activity.description}</p>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <ApperIcon name="Calendar" size={14} />
                        <span>{format(new Date(activity.date), "MMM dd, yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ApperIcon name="Clock" size={14} />
                        <span>{activity.time} - {activity.endTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ApperIcon name="MapPin" size={14} />
                        <span>{activity.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ApperIcon name="User" size={14} />
                        <span>{activity.organizerName}</span>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-3 mt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Attendees</span>
                        <span className="font-medium text-primary">
                          {activity.attendeeIds.length}{activity.maxParticipants ? `/${activity.maxParticipants}` : ''}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Activities */}
          {completedActivities.length > 0 && (statusFilter === "" || statusFilter === "Completed") && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Past Activities</h2>
              <div className="space-y-4">
                {completedActivities.map((activity, index) => (
                  <motion.div
                    key={activity.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="card hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <ApperIcon name={getActivityIcon(activity.type)} size={20} className="text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                          <p className="text-sm text-gray-500 mb-2">{activity.type}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <ApperIcon name="Calendar" size={14} />
                              <span>{format(new Date(activity.date), "MMM dd, yyyy")}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ApperIcon name="MapPin" size={14} />
                              <span>{activity.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ApperIcon name="Users" size={14} />
                              <span>{activity.attendeeIds.length} attended</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {getStatusBadge(activity)}
                        <button
                          onClick={() => handleDeleteActivity(activity.Id)}
                          className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors duration-200"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default Activities;