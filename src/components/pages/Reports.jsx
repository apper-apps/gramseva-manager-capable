import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { residentService } from "@/services/api/residentService";
import { familyService } from "@/services/api/familyService";
import { issueService } from "@/services/api/issueService";
import { activityService } from "@/services/api/activityService";
import { toast } from "react-toastify";

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReportData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [residents, families, issues, activities] = await Promise.all([
        residentService.getAll(),
        familyService.getAll(),
        issueService.getAll(),
        activityService.getAll()
      ]);

// Calculate demographics
      const demographics = residents.reduce((acc, resident) => {
        acc.total++;
        acc.male += resident.gender === "Male" ? 1 : 0;
        acc.female += resident.gender === "Female" ? 1 : 0;
        acc.children += resident.age < 18 ? 1 : 0;
        acc.adults += resident.age >= 18 && resident.age < 60 ? 1 : 0;
        acc.elderly += resident.age >= 60 ? 1 : 0;
        acc.bpl += resident.bplStatus ? 1 : 0;
        
        // Category counts
        acc.categories[resident.category] = (acc.categories[resident.category] || 0) + 1;
        
        return acc;
      }, {
        total: 0,
        male: 0,
        female: 0,
        children: 0,
        adults: 0,
        elderly: 0,
        bpl: 0,
        categories: {}
      });

      // Calculate issue statistics
      const issueStats = issues.reduce((acc, issue) => {
        acc.total++;
        acc.categories[issue.category] = (acc.categories[issue.category] || 0) + 1;
        acc.status[issue.status] = (acc.status[issue.status] || 0) + 1;
        acc.priority[issue.priority] = (acc.priority[issue.priority] || 0) + 1;
        return acc;
      }, {
        total: 0,
        categories: {},
        status: {},
        priority: {}
      });

      // Calculate activity statistics
      const activityStats = activities.reduce((acc, activity) => {
        acc.total++;
        acc.types[activity.type] = (acc.types[activity.type] || 0) + 1;
        acc.totalParticipants += activity.attendeeIds.length;
        return acc;
      }, {
        total: 0,
        types: {},
        totalParticipants: 0
      });

      // Calculate family statistics
      const familyStats = {
        total: families.length,
        averageSize: families.length > 0 ? (residents.length / families.length).toFixed(1) : 0,
        withElectricity: families.filter(f => f.electricityConnection).length,
        withWater: families.filter(f => f.waterConnection).length,
        withSanitation: families.filter(f => f.sanitationFacility).length
      };

      setReportData({
        demographics,
        issueStats,
        activityStats,
        familyStats,
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
    loadReportData();
  }, []);

  const generateReport = (type) => {
    if (!reportData) return;
    
    let reportContent = "";
    const currentDate = format(new Date(), "MMMM dd, yyyy");
    
    switch (type) {
      case "census":
        reportContent = `
VILLAGE CENSUS REPORT
Generated on: ${currentDate}

POPULATION OVERVIEW:
• Total Residents: ${reportData.demographics.total}
• Total Families: ${reportData.familyStats.total}
• Average Family Size: ${reportData.familyStats.averageSize}

DEMOGRAPHIC BREAKDOWN:
• Male: ${reportData.demographics.male} (${((reportData.demographics.male / reportData.demographics.total) * 100).toFixed(1)}%)
• Female: ${reportData.demographics.female} (${((reportData.demographics.female / reportData.demographics.total) * 100).toFixed(1)}%)
• Children (0-17): ${reportData.demographics.children}
• Adults (18-59): ${reportData.demographics.adults}
• Elderly (60+): ${reportData.demographics.elderly}
• BPL Families: ${reportData.demographics.bpl}

CATEGORY DISTRIBUTION:
${Object.entries(reportData.demographics.categories).map(([category, count]) => 
  `• ${category}: ${count}`
).join('\n')}

INFRASTRUCTURE:
• Houses with Electricity: ${reportData.familyStats.withElectricity}/${reportData.familyStats.total}
• Houses with Water Connection: ${reportData.familyStats.withWater}/${reportData.familyStats.total}
• Houses with Sanitation: ${reportData.familyStats.withSanitation}/${reportData.familyStats.total}
        `;
        break;
        
      case "issues":
        reportContent = `
VILLAGE ISSUES SUMMARY REPORT
Generated on: ${currentDate}

ISSUE OVERVIEW:
• Total Issues Reported: ${reportData.issueStats.total}
• Open Issues: ${reportData.issueStats.status.Open || 0}
• In Progress: ${reportData.issueStats.status["In Progress"] || 0}
• Resolved Issues: ${reportData.issueStats.status.Resolved || 0}

ISSUES BY CATEGORY:
${Object.entries(reportData.issueStats.categories).map(([category, count]) => 
  `• ${category}: ${count}`
).join('\n')}

PRIORITY BREAKDOWN:
• High Priority: ${reportData.issueStats.priority.High || 0}
• Medium Priority: ${reportData.issueStats.priority.Medium || 0}
• Low Priority: ${reportData.issueStats.priority.Low || 0}

RESOLUTION RATE: ${reportData.issueStats.total > 0 ? 
  ((reportData.issueStats.status.Resolved || 0) / reportData.issueStats.total * 100).toFixed(1) : 0}%
        `;
        break;
        
      case "activities":
        reportContent = `
VILLAGE ACTIVITIES REPORT
Generated on: ${currentDate}

ACTIVITY OVERVIEW:
• Total Activities Organized: ${reportData.activityStats.total}
• Total Participants: ${reportData.activityStats.totalParticipants}
• Average Participation: ${reportData.activityStats.total > 0 ? 
  (reportData.activityStats.totalParticipants / reportData.activityStats.total).toFixed(1) : 0} per activity

ACTIVITIES BY TYPE:
${Object.entries(reportData.activityStats.types).map(([type, count]) => 
  `• ${type}: ${count}`
).join('\n')}

PARTICIPATION RATE: ${reportData.demographics.total > 0 ? 
  ((reportData.activityStats.totalParticipants / reportData.demographics.total) * 100).toFixed(1) : 0}% of total population
        `;
        break;
    }

    // Create and download the report
    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}_report_${format(new Date(), "yyyy-MM-dd")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} report downloaded successfully`);
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadReportData} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Generate comprehensive reports for village administration</p>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Population"
          value={reportData.demographics.total}
          icon="Users"
          gradient={true}
        />
        <StatCard
          title="Total Families"
          value={reportData.familyStats.total}
          icon="Home"
          change={`Avg ${reportData.familyStats.averageSize} members`}
          changeType="neutral"
        />
        <StatCard
          title="Active Issues"
          value={(reportData.issueStats.status.Open || 0) + (reportData.issueStats.status["In Progress"] || 0)}
          icon="AlertCircle"
          change={`${reportData.issueStats.status.Resolved || 0} resolved`}
          changeType="positive"
        />
        <StatCard
          title="Total Activities"
          value={reportData.activityStats.total}
          icon="Calendar"
          change={`${reportData.activityStats.totalParticipants} participants`}
          changeType="positive"
        />
      </div>

      {/* Report Generation Section */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Generate Reports</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="Users" size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Census Report</h3>
                <p className="text-sm text-gray-600">Demographic and population data</p>
              </div>
            </div>
            <Button
              onClick={() => generateReport("census")}
              variant="outline"
              className="w-full"
            >
              <ApperIcon name="Download" size={16} />
              Generate Census Report
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="AlertCircle" size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Issues Summary</h3>
                <p className="text-sm text-gray-600">Reported issues and resolution status</p>
              </div>
            </div>
            <Button
              onClick={() => generateReport("issues")}
              variant="outline"
              className="w-full"
            >
              <ApperIcon name="Download" size={16} />
              Generate Issues Report
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="Calendar" size={24} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Activities Report</h3>
                <p className="text-sm text-gray-600">Community events and participation</p>
              </div>
            </div>
            <Button
              onClick={() => generateReport("activities")}
              variant="outline"
              className="w-full"
            >
              <ApperIcon name="Download" size={16} />
              Generate Activities Report
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Quick Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Demographic Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Male</span>
              <span className="font-medium">{reportData.demographics.male} ({((reportData.demographics.male / reportData.demographics.total) * 100).toFixed(1)}%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Female</span>
              <span className="font-medium">{reportData.demographics.female} ({((reportData.demographics.female / reportData.demographics.total) * 100).toFixed(1)}%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Children (0-17)</span>
              <span className="font-medium">{reportData.demographics.children}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Adults (18-59)</span>
              <span className="font-medium">{reportData.demographics.adults}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Elderly (60+)</span>
              <span className="font-medium">{reportData.demographics.elderly}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">BPL Families</span>
              <span className="font-medium">{reportData.demographics.bpl}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Infrastructure Coverage</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Electricity Connection</span>
              <span className="font-medium">{reportData.familyStats.withElectricity}/{reportData.familyStats.total} families</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Water Connection</span>
              <span className="font-medium">{reportData.familyStats.withWater}/{reportData.familyStats.total} families</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Sanitation Facility</span>
              <span className="font-medium">{reportData.familyStats.withSanitation}/{reportData.familyStats.total} families</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Family Size</span>
              <span className="font-medium">{reportData.familyStats.averageSize} members</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Reports;