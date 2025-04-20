
import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { format } from 'date-fns';
import BlockedDatesCard from '@/components/Dashboard/BlockedDatesCard';
import { useCalendarData } from '@/hooks/useCalendarData';
import { Calendar, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const BlockedDates = () => {
  const { getGroupedProjects } = useCalendarData(new Date());
  const groupedProjects = getGroupedProjects();
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const handleCardClick = (projectId: string, projectName: string) => {
    // In a real app, you could navigate to a project detail page
    toast.success(`Viewing details for ${projectName}`, {
      icon: <CheckCircle2 className="h-4 w-4" />,
      position: "top-center"
    });
  };

  const filteredProjects = selectedFilter 
    ? groupedProjects.filter(({ project }) => project.id === selectedFilter) 
    : groupedProjects;

  const totalBlockedDates = groupedProjects.reduce((acc, { dates }) => acc + dates.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 md:p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-8 h-8 text-blue-500" />
              <span>Blocked Dates</span>
            </h1>
            <p className="text-gray-600 mt-1">
              {totalBlockedDates} dates blocked across {groupedProjects.length} projects
            </p>
          </motion.div>

          {groupedProjects.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-2"
            >
              <button
                onClick={() => setSelectedFilter(null)}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-full transition-all",
                  selectedFilter === null
                    ? "bg-blue-500 text-white font-medium"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-blue-200"
                )}
              >
                All Projects
              </button>
              {groupedProjects.map(({ project }) => (
                <button
                  key={project.id}
                  onClick={() => setSelectedFilter(project.id)}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-full transition-all flex items-center gap-1",
                    selectedFilter === project.id
                      ? "bg-blue-500 text-white font-medium"
                      : "bg-white text-gray-700 border border-gray-200 hover:border-blue-200"
                  )}
                >
                  <span 
                    className="w-2 h-2 rounded-full inline-block" 
                    style={{ backgroundColor: project.color || '#000000' }}
                  />
                  {project.name}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {filteredProjects.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {filteredProjects.map(({ project, dates }) => (
              <motion.div key={project.id} variants={item}>
                <BlockedDatesCard
                  project={project}
                  dates={dates}
                  onClick={() => handleCardClick(project.id, project.name)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm"
          >
            <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No blocked dates found</p>
            <p className="text-gray-400 mt-2">Add some projects to your calendar to see them here</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default BlockedDates;
