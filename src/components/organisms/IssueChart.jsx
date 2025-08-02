import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ReactApexChart from "react-apexcharts";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { issueService } from "@/services/api/issueService";

const IssueChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadChartData = async () => {
    try {
      setLoading(true);
      setError("");

      const issues = await issueService.getAll();
      
      const categoryCount = issues.reduce((acc, issue) => {
        acc[issue.category] = (acc[issue.category] || 0) + 1;
        return acc;
      }, {});

      const categories = Object.keys(categoryCount);
      const counts = Object.values(categoryCount);

      setChartData({
        series: [{
          name: "Issues",
          data: counts
        }],
        options: {
          chart: {
            type: "bar",
            height: 350,
            toolbar: { show: false }
          },
          colors: ["#1e40af"],
          plotOptions: {
            bar: {
              borderRadius: 4,
              columnWidth: "60%"
            }
          },
          dataLabels: {
            enabled: false
          },
          xaxis: {
            categories: categories,
            labels: {
              style: {
                colors: "#374151",
                fontSize: "12px"
              }
            }
          },
          yaxis: {
            labels: {
              style: {
                colors: "#374151",
                fontSize: "12px"
              }
            }
          },
          grid: {
            borderColor: "#f3f4f6",
            strokeDashArray: 3
          },
          tooltip: {
            theme: "light"
          }
        }
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChartData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadChartData} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Issues by Category</h3>
      {chartData && (
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={350}
        />
      )}
    </motion.div>
  );
};

export default IssueChart;