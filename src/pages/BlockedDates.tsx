
import React from 'react';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { format, isSameMonth } from 'date-fns';
import BlockedDatesCard from '@/components/Dashboard/BlockedDatesCard';
import { useCalendarData } from '@/hooks/useCalendarData';

const BlockedDates = () => {
  const { getGroupedProjects } = useCalendarData(new Date());
  const groupedProjects = getGroupedProjects();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <h1 className="text-2xl font-semibold text-gray-900">
          Blocked Dates
        </h1>
        {groupedProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groupedProjects.map(({ project, dates }) => (
              <BlockedDatesCard
                key={project.id}
                project={project}
                dates={dates}
              />
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500">No blocked dates found</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default BlockedDates;
