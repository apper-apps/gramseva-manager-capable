import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import FilterDropdown from "@/components/molecules/FilterDropdown";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import IssueModal from "@/components/organisms/IssueModal";
import { issueService } from "@/services/api/issueService";
import { toast } from "react-toastify";

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [modalMode, setModalMode] = useState("add");

  const loadIssues = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await issueService.getAll();
      setIssues(data);
      setFilteredIssues(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
  }, []);

  useEffect(() => {
    let filtered = issues;

if (searchTerm) {
      filtered = filtered.filter(issue =>
        issue.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.reporterName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(issue => issue.status === statusFilter);
    }

    if (categoryFilter) {
      filtered = filtered.filter(issue => issue.category === categoryFilter);
    }

    setFilteredIssues(filtered);
  }, [issues, searchTerm, statusFilter, categoryFilter]);

  const handleAddIssue = () => {
    setSelectedIssue(null);
    setModalMode("add");
    setIsModalOpen(true);
  };

  const handleEditIssue = (issue) => {
    setSelectedIssue(issue);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleSaveIssue = async (issueData) => {
    if (modalMode === "add") {
      await issueService.create(issueData);
    } else {
      await issueService.update(selectedIssue.Id, issueData);
    }
    await loadIssues();
  };

  const handleStatusChange = async (issueId, newStatus) => {
    try {
      await issueService.updateStatus(issueId, newStatus);
      await loadIssues();
      toast.success("Issue status updated successfully");
    } catch (error) {
      toast.error("Failed to update issue status");
    }
  };

  const handleDeleteIssue = async (issueId) => {
    if (window.confirm("Are you sure you want to delete this issue?")) {
      try {
        await issueService.delete(issueId);
        await loadIssues();
        toast.success("Issue deleted successfully");
      } catch (error) {
        toast.error("Failed to delete issue");
      }
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Open": return "error";
      case "In Progress": return "warning";
      case "Resolved": return "success";
      default: return "default";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "text-red-600";
      case "Medium": return "text-yellow-600";
      case "Low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "Open", label: "Open" },
    { value: "In Progress", label: "In Progress" },
    { value: "Resolved", label: "Resolved" }
  ];

  const categoryOptions = [
    { value: "", label: "All Categories" },
    { value: "Water", label: "Water" },
    { value: "Sanitation", label: "Sanitation" },
    { value: "Roads", label: "Roads" },
    { value: "Electricity", label: "Electricity" },
    { value: "Healthcare", label: "Healthcare" },
    { value: "Education", label: "Education" },
    { value: "Other", label: "Other" }
  ];

  const statusChangeOptions = [
    { value: "Open", label: "Open" },
    { value: "In Progress", label: "In Progress" },
    { value: "Resolved", label: "Resolved" }
  ];

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadIssues} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Issues</h1>
          <p className="text-gray-600">Track and manage village issues and complaints</p>
        </div>
        <Button onClick={handleAddIssue} className="flex items-center gap-2">
          <ApperIcon name="Plus" size={16} />
          Report Issue
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search issues by title, description, or reporter..."
            onSearch={setSearchTerm}
          />
        </div>
        <div className="flex gap-2">
          <FilterDropdown
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Filter by status"
          />
          <FilterDropdown
            options={categoryOptions}
            value={categoryFilter}
            onChange={setCategoryFilter}
            placeholder="Filter by category"
          />
        </div>
      </div>

      {filteredIssues.length === 0 ? (
        <Empty
          title="No issues found"
          description="Start by reporting your first issue to track village problems"
          action={handleAddIssue}
          actionLabel="Report First Issue"
          icon="AlertCircle"
        />
      ) : (
        <div className="space-y-4">
          {filteredIssues.map((issue, index) => (
            <motion.div
              key={issue.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-3 h-3 rounded-full ${
                      issue.priority === "High" ? "bg-red-500" : 
                      issue.priority === "Medium" ? "bg-yellow-500" : "bg-green-500"
                    }`}></div>
                    <h3 className="text-lg font-semibold text-gray-900">{issue.title}</h3>
                    <Badge variant={getStatusBadgeVariant(issue.status)}>
                      {issue.status}
                    </Badge>
                  </div>

                  <p className="text-gray-600 mb-3 line-clamp-2">{issue.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <ApperIcon name="Tag" size={14} />
                      <span>{issue.category}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ApperIcon name="User" size={14} />
                      <span>{issue.reporterName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ApperIcon name="MapPin" size={14} />
                      <span>{issue.ward}, {issue.street}</span>
                    </div>
                    <div className={`flex items-center gap-1 font-medium ${getPriorityColor(issue.priority)}`}>
                      <ApperIcon name="Flag" size={14} />
                      <span>{issue.priority} Priority</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ApperIcon name="Calendar" size={14} />
                      <span>{format(new Date(issue.createdAt), "MMM dd, yyyy")}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <FilterDropdown
                    options={statusChangeOptions}
                    value={issue.status}
                    onChange={(newStatus) => handleStatusChange(issue.Id, newStatus)}
                    placeholder="Change status"
                  />
                  <button
                    onClick={() => handleEditIssue(issue)}
                    className="text-primary hover:text-primary-dark p-2 rounded hover:bg-blue-50 transition-colors duration-200"
                  >
                    <ApperIcon name="Edit2" size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteIssue(issue.Id)}
                    className="text-red-600 hover:text-red-900 p-2 rounded hover:bg-red-50 transition-colors duration-200"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </button>
                </div>
              </div>

              {issue.dueDate && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ApperIcon name="Clock" size={14} />
                    <span>Due: {format(new Date(issue.dueDate), "MMM dd, yyyy")}</span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <IssueModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveIssue}
        issue={selectedIssue}
        mode={modalMode}
      />
    </motion.div>
  );
};

export default Issues;