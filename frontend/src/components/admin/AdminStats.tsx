import React from "react";
import Link from "next/link";

interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon: React.ReactNode;
  color: "blue" | "green" | "yellow" | "indigo" | "red" | "purple";
  link?: {
    text: string;
    href: string;
  };
}

const colorClasses = {
  blue: {
    bg: "bg-blue-500",
    link: "text-blue-600 hover:text-blue-900",
  },
  green: {
    bg: "bg-green-500",
    link: "text-green-600 hover:text-green-900",
  },
  yellow: {
    bg: "bg-yellow-500",
    link: "text-yellow-600 hover:text-yellow-900",
  },
  indigo: {
    bg: "bg-indigo-500",
    link: "text-indigo-600 hover:text-indigo-900",
  },
  red: {
    bg: "bg-red-500",
    link: "text-red-600 hover:text-red-900",
  },
  purple: {
    bg: "bg-purple-500",
    link: "text-purple-600 hover:text-purple-900",
  },
};

export function StatCard({
  title,
  value,
  description,
  icon,
  color,
  link,
}: StatCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div
            className={`flex-shrink-0 ${colorClasses[color].bg} rounded-md p-3`}
          >
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {value}
                </div>
                {description && (
                  <div className="ml-2 text-sm text-gray-500">
                    {description}
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
      {link && (
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <Link
              href={link.href}
              className={`font-medium ${colorClasses[color].link}`}
            >
              {link.text}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default StatCard;
