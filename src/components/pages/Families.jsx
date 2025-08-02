import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { familyService } from "@/services/api/familyService";
import { residentService } from "@/services/api/residentService";
import { toast } from "react-toastify";

const Families = () => {
  const [families, setFamilies] = useState([]);
  const [residents, setResidents] = useState([]);
  const [filteredFamilies, setFilteredFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [familyData, residentData] = await Promise.all([
        familyService.getAll(),
        residentService.getAll()
      ]);
      setFamilies(familyData);
      setResidents(residentData);
      setFilteredFamilies(familyData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = families;

    if (searchTerm) {
      filtered = filtered.filter(family =>
        family.familyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        family.familyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        family.ward.toLowerCase().includes(searchTerm.toLowerCase()) ||
        family.street.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredFamilies(filtered);
  }, [families, searchTerm]);

  const getFamilyMembers = (family) => {
    return residents.filter(resident => 
      family.memberIds.includes(resident.Id)
    );
  };

  const getFamilyHead = (family) => {
    return residents.find(resident => resident.Id === family.headId);
  };

  const handleDeleteFamily = async (familyId) => {
    if (window.confirm("Are you sure you want to delete this family?")) {
      try {
        await familyService.delete(familyId);
        await loadData();
        toast.success("Family deleted successfully");
      } catch (error) {
        toast.error("Failed to delete family");
      }
    }
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Families</h1>
          <p className="text-gray-600">Manage family units and member relationships</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search families by name, ID, ward, or street..."
            onSearch={setSearchTerm}
          />
        </div>
      </div>

      {filteredFamilies.length === 0 ? (
        <Empty
          title="No families found"
          description="Families will appear here when residents are added to family units"
          icon="Home"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFamilies.map((family, index) => {
            const familyMembers = getFamilyMembers(family);
            const familyHead = getFamilyHead(family);
            
            return (
              <motion.div
                key={family.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                      <ApperIcon name="Home" size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{family.familyName}</h3>
                      <p className="text-sm text-gray-500">{family.familyId}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteFamily(family.Id)}
                    className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors duration-200"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </button>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ApperIcon name="MapPin" size={14} />
                    <span>{family.houseNumber}, {family.street}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ApperIcon name="Users" size={14} />
                    <span>{familyMembers.length} member{familyMembers.length !== 1 ? 's' : ''}</span>
                  </div>

                  {familyHead && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <ApperIcon name="Crown" size={14} />
                      <span>Head: {familyHead.name}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Family Members</h4>
                  <div className="space-y-2">
                    {familyMembers.slice(0, 3).map((member) => (
                      <div key={member.Id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{member.name}</span>
                        <span className="text-gray-500 capitalize">{member.familyRole}</span>
                      </div>
                    ))}
                    {familyMembers.length > 3 && (
                      <div className="text-sm text-gray-500 italic">
                        +{familyMembers.length - 3} more member{familyMembers.length - 3 !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <ApperIcon name="Zap" size={12} />
                      <span className={family.electricityConnection ? "text-green-600" : "text-red-600"}>
                        {family.electricityConnection ? "Connected" : "No Power"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ApperIcon name="Droplets" size={12} />
                      <span className={family.waterConnection ? "text-green-600" : "text-red-600"}>
                        {family.waterConnection ? "Connected" : "No Water"}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default Families;