import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: string;
}

interface TabsProps {
  activeTab: string;
  onChange: (tabId: string) => void;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, onChange, children }) => {
  // Filter out only valid Tab components
  const tabs = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === Tab
  ) as React.ReactElement[];

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="flex space-x-4 overflow-x-auto" aria-label="Tabs">
        {tabs.map((tab) => {
          const tabId = tab.props.id;
          const isActive = activeTab === tabId;
          
          return React.cloneElement(tab, {
            key: tabId,
            isActive,
            onClick: () => onChange(tabId),
          });
        })}
      </nav>
    </div>
  );
};

interface TabProps {
  id: string;
  label: string;
  icon?: string;
  isActive?: boolean;
  onClick?: () => void;
}

const renderIcon = (icon?: string) => {
  switch (icon) {
    case 'chart-pie':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
        </svg>
      );
    case 'clipboard-list':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path>
        </svg>
      );
    case 'archive':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"></path>
          <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd"></path>
        </svg>
      );
    case 'scissors':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M5.5 2a3.5 3.5 0 101.665 6.58L8.585 10l-1.42 1.42a3.5 3.5 0 101.414 1.414l8.128-8.127a1 1 0 00-1.414-1.414L10 8.586l-1.42-1.42A3.5 3.5 0 005.5 2zM4 5.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 9a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clipRule="evenodd"></path>
        </svg>
      );
    case 'truck':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path>
          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"></path>
        </svg>
      );
    case 'clipboard-check':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
        </svg>
      );
    case 'shield-check':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
        </svg>
      );
    default:
      return null;
  }
};

export const Tab: React.FC<TabProps> = ({ id, label, icon, isActive, onClick }) => {
  return (
    <button
      type="button"
      className={`
        flex items-center px-4 py-2 text-sm font-medium rounded-t-lg 
        ${isActive 
          ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-500 border-b-2 border-blue-600 dark:border-blue-500' 
          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
        }
      `}
      onClick={onClick}
      role="tab"
      aria-selected={isActive}
      aria-controls={`${id}-content`}
    >
      {icon && (
        <span className="mr-2">
          {renderIcon(icon)}
        </span>
      )}
      {label}
    </button>
  );
}; 