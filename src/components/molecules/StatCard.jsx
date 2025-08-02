import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon, 
  gradient = false,
  className = "" 
}) => {
  const changeColors = {
    positive: "text-green-600",
    negative: "text-red-600",
    neutral: "text-gray-600"
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className={`card ${gradient ? "bg-gradient-to-br from-primary to-secondary text-white" : ""} ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium ${gradient ? "text-blue-100" : "text-gray-600"} mb-1`}>
            {title}
          </p>
          <p className={`text-3xl font-bold ${gradient ? "text-white" : "text-gray-900"} mb-2`}>
            {value}
          </p>
          {change && (
            <div className="flex items-center gap-1">
              <ApperIcon 
                name={changeType === "positive" ? "TrendingUp" : changeType === "negative" ? "TrendingDown" : "Minus"} 
                size={16} 
                className={gradient ? "text-blue-100" : changeColors[changeType]}
              />
              <span className={`text-sm font-medium ${gradient ? "text-blue-100" : changeColors[changeType]}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            gradient ? "bg-white bg-opacity-20" : "bg-primary bg-opacity-10"
          }`}>
            <ApperIcon 
              name={icon} 
              size={24} 
              className={gradient ? "text-white" : "text-primary"}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;