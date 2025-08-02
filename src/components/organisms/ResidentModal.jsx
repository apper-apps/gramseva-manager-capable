import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import FilterDropdown from "@/components/molecules/FilterDropdown";
import { familyService } from "@/services/api/familyService";
import { toast } from "react-toastify";

const ResidentModal = ({ isOpen, onClose, onSave, resident = null, mode = "add" }) => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Male",
    houseNumber: "",
    occupation: "",
    familyId: "",
    familyRole: "Head",
    phoneNumber: "",
    aadhaarNumber: "",
    education: "",
    category: "General",
    religion: "Hindu",
    motherTongue: "Hindi",
    bplStatus: false,
    ward: "",
    street: ""
  });

  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadFamilies();
      if (resident && mode === "edit") {
        setFormData({
          name: resident.name || "",
          age: resident.age?.toString() || "",
          gender: resident.gender || "Male",
          houseNumber: resident.houseNumber || "",
          occupation: resident.occupation || "",
          familyId: resident.familyId || "",
          familyRole: resident.familyRole || "Head",
          phoneNumber: resident.phoneNumber || "",
          aadhaarNumber: resident.aadhaarNumber || "",
          education: resident.education || "",
          category: resident.category || "General",
          religion: resident.religion || "Hindu",
          motherTongue: resident.motherTongue || "Hindi",
          bplStatus: resident.bplStatus || false,
          ward: resident.ward || "",
          street: resident.street || ""
        });
      } else {
        setFormData({
          name: "",
          age: "",
          gender: "Male",
          houseNumber: "",
          occupation: "",
          familyId: "",
          familyRole: "Head",
          phoneNumber: "",
          aadhaarNumber: "",
          education: "",
          category: "General",
          religion: "Hindu",
          motherTongue: "Hindi",
          bplStatus: false,
          ward: "",
          street: ""
        });
      }
    }
  }, [isOpen, resident, mode]);

  const loadFamilies = async () => {
    try {
      const familyList = await familyService.getAll();
      setFamilies(familyList);
    } catch (error) {
      toast.error("Failed to load families");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.age || !formData.houseNumber.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        age: parseInt(formData.age),
        bplStatus: formData.bplStatus
      };

      await onSave(submitData);
      onClose();
      toast.success(`Resident ${mode === "add" ? "added" : "updated"} successfully`);
    } catch (error) {
      toast.error(`Failed to ${mode} resident: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" }
  ];

  const roleOptions = [
    { value: "Head", label: "Head" },
    { value: "Spouse", label: "Spouse" },
    { value: "Child", label: "Child" },
    { value: "Elderly", label: "Elderly" },
    { value: "Other", label: "Other" }
  ];

  const categoryOptions = [
    { value: "General", label: "General" },
    { value: "OBC", label: "OBC" },
    { value: "SC", label: "SC" },
    { value: "ST", label: "ST" }
  ];

  const religionOptions = [
    { value: "Hindu", label: "Hindu" },
    { value: "Islam", label: "Islam" },
    { value: "Christian", label: "Christian" },
    { value: "Sikh", label: "Sikh" },
    { value: "Buddhist", label: "Buddhist" },
    { value: "Other", label: "Other" }
  ];

  const familyOptions = families.map(family => ({
    value: family.familyId,
    label: `${family.familyName} (${family.familyId})`
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
                {mode === "add" ? "Add New Resident" : "Edit Resident"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ApperIcon name="X" size={20} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age *
                  </label>
                  <Input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    placeholder="Enter age"
                    min="1"
                    max="120"
                    required
                  />
                </div>

                <FilterDropdown
                  label="Gender"
                  options={genderOptions}
                  value={formData.gender}
                  onChange={(value) => handleInputChange("gender", value)}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    House Number *
                  </label>
                  <Input
                    value={formData.houseNumber}
                    onChange={(e) => handleInputChange("houseNumber", e.target.value)}
                    placeholder="e.g., H-001"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Occupation
                  </label>
                  <Input
                    value={formData.occupation}
                    onChange={(e) => handleInputChange("occupation", e.target.value)}
                    placeholder="Enter occupation"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <Input
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>

                <FilterDropdown
                  label="Family"
                  options={familyOptions}
                  value={formData.familyId}
                  onChange={(value) => handleInputChange("familyId", value)}
                  placeholder="Select family"
                />

                <FilterDropdown
                  label="Family Role"
                  options={roleOptions}
                  value={formData.familyRole}
                  onChange={(value) => handleInputChange("familyRole", value)}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Aadhaar Number
                  </label>
                  <Input
                    value={formData.aadhaarNumber}
                    onChange={(e) => handleInputChange("aadhaarNumber", e.target.value)}
                    placeholder="1234-5678-9012"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Education
                  </label>
                  <Input
                    value={formData.education}
                    onChange={(e) => handleInputChange("education", e.target.value)}
                    placeholder="Enter education level"
                  />
                </div>

                <FilterDropdown
                  label="Category"
                  options={categoryOptions}
                  value={formData.category}
                  onChange={(value) => handleInputChange("category", value)}
                />

                <FilterDropdown
                  label="Religion"
                  options={religionOptions}
                  value={formData.religion}
                  onChange={(value) => handleInputChange("religion", value)}
                />

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

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="bplStatus"
                  checked={formData.bplStatus}
                  onChange={(e) => handleInputChange("bplStatus", e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="bplStatus" className="text-sm font-medium text-gray-700">
                  BPL (Below Poverty Line)
                </label>
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
                  {mode === "add" ? "Add Resident" : "Update Resident"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ResidentModal;