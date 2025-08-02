import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import FilterDropdown from "@/components/molecules/FilterDropdown";
import { residentService } from "@/services/api/residentService";
import { toast } from "react-toastify";

const IssueModal = ({ isOpen, onClose, onSave, issue = null, mode = "add" }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "Water",
    description: "",
    priority: "Medium",
    reporterId: "",
    reporterName: "",
    ward: "",
    street: "",
    dueDate: ""
  });

  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadResidents();
      if (issue && mode === "edit") {
        setFormData({
          title: issue.title || "",
          category: issue.category || "Water",
          description: issue.description || "",
          priority: issue.priority || "Medium",
          reporterId: issue.reporterId?.toString() || "",
          reporterName: issue.reporterName || "",
          ward: issue.ward || "",
          street: issue.street || "",
          dueDate: issue.dueDate ? issue.dueDate.split("T")[0] : ""
        });
      } else {
        setFormData({
          title: "",
          category: "Water",
          description: "",
          priority: "Medium",
          reporterId: "",
          reporterName: "",
          ward: "",
          street: "",
          dueDate: ""
        });
      }
    }
  }, [isOpen, issue, mode]);

  const loadResidents = async () => {
    try {
      const residentList = await residentService.getAll();
      setResidents(residentList);
    } catch (error) {
      toast.error("Failed to load residents");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const selectedReporter = residents.find(r => r.Id.toString() === formData.reporterId);
      
      const submitData = {
        ...formData,
        reporterId: formData.reporterId ? parseInt(formData.reporterId) : null,
        reporterName: selectedReporter ? selectedReporter.name : formData.reporterName,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
      };

      await onSave(submitData);
      onClose();
      toast.success(`Issue ${mode === "add" ? "reported" : "updated"} successfully`);
    } catch (error) {
      toast.error(`Failed to ${mode} issue: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === "reporterId") {
      const selectedResident = residents.find(r => r.Id.toString() === value);
      if (selectedResident) {
        setFormData(prev => ({
          ...prev,
          reporterName: selectedResident.name,
          ward: selectedResident.ward || "",
          street: selectedResident.street || ""
        }));
      }
    }
  };

  const categoryOptions = [
    { value: "Water", label: "Water" },
    { value: "Sanitation", label: "Sanitation" },
    { value: "Roads", label: "Roads" },
    { value: "Electricity", label: "Electricity" },
    { value: "Healthcare", label: "Healthcare" },
    { value: "Education", label: "Education" },
    { value: "Other", label: "Other" }
  ];

  const priorityOptions = [
    { value: "High", label: "High" },
    { value: "Medium", label: "Medium" },
    { value: "Low", label: "Low" }
  ];

  const residentOptions = residents.map(resident => ({
    value: resident.Id.toString(),
    label: `${resident.name} (${resident.houseNumber})`
  }));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {mode === "add" ? "Report New Issue" : "Edit Issue"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ApperIcon name="X" size={20} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter issue title"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FilterDropdown
                  label="Category *"
                  options={categoryOptions}
                  value={formData.category}
                  onChange={(value) => handleInputChange("category", value)}
                />

                <FilterDropdown
                  label="Priority"
                  options={priorityOptions}
                  value={formData.priority}
                  onChange={(value) => handleInputChange("priority", value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe the issue in detail"
                  rows={4}
                  className="input-field resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FilterDropdown
                  label="Reporter"
                  options={residentOptions}
                  value={formData.reporterId}
                  onChange={(value) => handleInputChange("reporterId", value)}
                  placeholder="Select reporter"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reporter Name
                  </label>
                  <Input
                    value={formData.reporterName}
                    onChange={(e) => handleInputChange("reporterName", e.target.value)}
                    placeholder="Enter reporter name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ward
                  </label>
                  <Input
                    value={formData.ward}
                    onChange={(e) => handleInputChange("ward", e.target.value)}
                    placeholder="e.g., Ward 1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street
                  </label>
                  <Input
                    value={formData.street}
                    onChange={(e) => handleInputChange("street", e.target.value)}
                    placeholder="Enter street name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange("dueDate", e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading && <ApperIcon name="Loader2" size={16} className="animate-spin" />}
                  {mode === "add" ? "Report Issue" : "Update Issue"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default IssueModal;