import React, { ReactNode } from 'react';

interface TabProps {
  id: string;
  label: string;
  children: ReactNode;
}

interface TabsProps {
  activeTab: string;
  onChange: (tabId: string) => void;
  children: ReactNode;
}

export const Tab: React.FC<TabProps> = ({ children }) => {
  return <div>{children}</div>;
};

export const Tabs: React.FC<TabsProps> = ({ activeTab, onChange, children }) => {
  // Lọc ra các children có type là Tab
  const tabs = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === Tab
  ) as React.ReactElement<TabProps>[];

  return (
    <div>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = tab.props.id === activeTab;
            return (
              <button
                key={tab.props.id}
                onClick={() => onChange(tab.props.id)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    isActive
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                {tab.props.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-4">
        {/* Chỉ hiển thị tab đang active */}
        {tabs.find((tab) => tab.props.id === activeTab)}
      </div>
    </div>
  );
}; 