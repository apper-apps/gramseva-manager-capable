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
import ResidentModal from "@/components/organisms/ResidentModal";
import { residentService } from "@/services/api/residentService";
import { toast } from "react-toastify";

const Residents = () => {
  const [residents, setResidents] = useState([]);
  const [filteredResidents, setFilteredResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResident, setSelectedResident] = useState(null);
  const [modalMode, setModalMode] = useState("add");

  const loadResidents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await residentService.getAll();
      setResidents(data);
      setFilteredResidents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResidents();
  }, []);

  useEffect(() => {
    let filtered = residents;

    if (searchTerm) {
      filtered = filtered.filter(resident =>
        resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resident.houseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resident.occupation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resident.familyId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (genderFilter) {
      filtered = filtered.filter(resident => resident.gender === genderFilter);
    }

    if (roleFilter) {
      filtered = filtered.filter(resident => resident.familyRole === roleFilter);
    }

    setFilteredResidents(filtered);
  }, [residents, searchTerm, genderFilter, roleFilter]);

  const handleAddResident = () => {
    setSelectedResident(null);
    setModalMode("add");
    setIsModalOpen(true);
  };

  const handleEditResident = (resident) => {
    setSelectedResident(resident);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleSaveResident = async (residentData) => {
    if (modalMode === "add") {
      await residentService.create(residentData);
    } else {
      await residentService.update(selectedResident.Id, residentData);
    }
    await loadResidents();
  };

  const handleDeleteResident = async (residentId) => {
    if (window.confirm("Are you sure you want to delete this resident?")) {
      try {
        await residentService.delete(residentId);
        await loadResidents();
        toast.success("Resident deleted successfully");
      } catch (error) {
        toast.error("Failed to delete resident");
      }
    }
  };

  const genderOptions = [
    { value: "", label: "All Genders" },
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" }
  ];

  const roleOptions = [
    { value: "", label: "All Roles" },
    { value: "Head", label: "Head" },
    { value: "Spouse", label: "Spouse" },
    { value: "Child", label: "Child" },
    { value: "Elderly", label: "Elderly" },
    { value: "Other", label: "Other" }
  ];

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadResidents} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Residents</h1>
          <p className="text-gray-600">Manage village resident profiles and information</p>
        </div>
        <Button onClick={handleAddResident} className="flex items-center gap-2">
          <ApperIcon name="Plus" size={16} />
          Add Resident
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search residents by name, house number, or occupation..."
            onSearch={setSearchTerm}
          />
        </div>
        <div className="flex gap-2">
          <FilterDropdown
            options={genderOptions}
            value={genderFilter}
            onChange={setGenderFilter}
            placeholder="Filter by gender"
          />
          <FilterDropdown
            options={roleOptions}
            value={roleFilter}
            onChange={setRoleFilter}
            placeholder="Filter by role"
          />
        </div>
      </div>

      {filteredResidents.length === 0 ? (
        <Empty
          title="No residents found"
          description="Start by adding your first resident to the system"
          action={handleAddResident}
          actionLabel="Add First Resident"
          icon="Users"
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resident
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    House & Family
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Demographics
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredResidents.map((resident, index) => (
                  <motion.tr
                    key={resident.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">
                          {resident.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {resident.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Age: {resident.age} • {resident.gender}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{resident.houseNumber}</div>
                      <div className="text-sm text-gray-500">
                        {resident.familyId && (
                          <>
                            {resident.familyId} ({resident.familyRole})
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{resident.phoneNumber || "N/A"}</div>
                      <div className="text-sm text-gray-500">{resident.occupation || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={resident.category === "General" ? "default" : "info"}>
                        {resident.category}
                      </Badge>
                      {resident.bplStatus && (
                        <Badge variant="warning" className="ml-2">
                          BPL
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditResident(resident)}
                          className="text-primary hover:text-primary-dark p-1 rounded hover:bg-blue-50 transition-colors duration-200"
                        >
                          <ApperIcon name="Edit2" size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteResident(resident.Id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors duration-200"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ResidentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveResident}
        resident={selectedResident}
        mode={modalMode}
      />
    </motion.div>
  );
};

export default Residents;