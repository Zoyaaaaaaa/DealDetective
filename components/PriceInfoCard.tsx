'use client'
import Image from "next/image";
import { motion } from 'framer-motion';

interface Props {
  title: string;
  iconSrc: string;
  value: string;
  trend?: 'up' | 'down' | 'neutral';
}

const PriceInfoCard = ({ title, iconSrc, value, trend }: Props) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-blue-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-50 rounded-lg">
            <Image 
              src={iconSrc} 
              alt={title} 
              width={24} 
              height={24}
              className="opacity-75"
            />
          </div>
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        </div>
        
        {trend && (
          <div className={`flex items-center ${getTrendColor()}`}>
            {trend === 'up' ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            ) : trend === 'down' ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            ) : null}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {trend && (
          <span className={`text-sm font-medium ${getTrendColor()}`}>
            {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}
          </span>
        )}
      </div>

      <div className="mt-4 h-1 w-full bg-gray-100 rounded">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1 }}
          className={`h-full rounded ${
            trend === 'up' 
              ? 'bg-green-500' 
              : trend === 'down' 
                ? 'bg-red-500' 
                : 'bg-blue-500'
          }`}
        />
      </div>
    </motion.div>
  );
};

export default PriceInfoCard;