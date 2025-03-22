import React from 'react';

interface ActionButton {
  label: string;
  icon?: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

interface PageHeaderProps {
  title: string;
  description?: string;
  actionButtons?: ActionButton[];
}

const renderIcon = (icon?: string) => {
  switch (icon) {
    case 'print':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
        </svg>
      );
    case 'settings':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      );
    default:
      return null;
  }
};

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description, 
  actionButtons = [] 
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
        
        {actionButtons.length > 0 && (
          <div className="mt-4 sm:mt-0 flex space-x-3">
            {actionButtons.map((button, index) => (
              <button
                key={index}
                onClick={button.onClick}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
                  ${button.variant === 'secondary' 
                    ? 'bg-gray-600 hover:bg-gray-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                  }`}
              >
                {button.icon && (
                  <span className="mr-2">
                    {renderIcon(button.icon)}
                  </span>
                )}
                {button.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 