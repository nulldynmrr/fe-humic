"use client";
import React from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaCalendarAlt,
  FaNewspaper,
  FaBullhorn,
  FaBriefcase,
  FaUserFriends,
  FaQuoteRight,
  FaHandshake,
} from "react-icons/fa";

const Dashboard = () => {
  const stats = [
    {
      label: "Total Users",
      value: "1,234",
      icon: FaUsers,
      color: "text-blue-600",
    },
    {
      label: "Agenda Items",
      value: "56",
      icon: FaCalendarAlt,
      color: "text-green-600",
    },
    {
      label: "News Articles",
      value: "23",
      icon: FaNewspaper,
      color: "text-purple-600",
    },
    {
      label: "Announcements",
      value: "12",
      icon: FaBullhorn,
      color: "text-orange-600",
    },
    { label: "Projects", value: "8", icon: FaBriefcase, color: "text-red-600" },
    {
      label: "Team Members",
      value: "45",
      icon: FaUserFriends,
      color: "text-indigo-600",
    },
    {
      label: "Testimonials",
      value: "34",
      icon: FaQuoteRight,
      color: "text-pink-600",
    },
    {
      label: "Partnerships",
      value: "15",
      icon: FaHandshake,
      color: "text-teal-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
      </div>

      <p className="text-gray-600 dark:text-gray-400">
        Welcome to the Humic Admin Dashboard. Manage your content and monitor
        your site's performance.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <Icon className={`text-2xl ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                New user registered
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Article published
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Event scheduled
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
              Create new article
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
              Schedule event
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
              Add team member
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
