import React, { ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
}

interface TabProps {
  id: string;
  label: string;
  children: ReactNode;
}

interface TabsProps {
  activeTab: string;
  onChange: (tabId: string) => void;
  children?: ReactNode;
  tabs?: TabItem[];
}

export const Tab: React.FC<TabProps> = ({ children }) => {
  return <div>{children}</div>;
};

export const Tabs: React.FC<TabsProps> = ({ activeTab, onChange, children, tabs }) => {
  // Nếu có tabs được truyền vào, sử dụng tabs
  // Nếu không, lọc ra các children có type là Tab
  const tabItems = tabs || [];
  const childTabs = React.Children.toArray(children || []).filter(
    (child) => React.isValidElement(child) && child.type === Tab
  ) as React.ReactElement<TabProps>[];

  // Tạo danh sách tab, ưu tiên tabs nếu được truyền vào
  const tabsToRender = tabs 
    ? tabItems 
    : childTabs.map(tab => ({ id: tab.props.id, label: tab.props.label }));

  // Debugging tabs
  console.log("Tabs to render:", tabsToRender);
  console.log("Active tab:", activeTab);
  console.log("Child tabs count:", childTabs.length);

  // Find active child tab
  const activeChildTab = childTabs.find((tab) => tab.props.id === activeTab);
  console.log("Found active tab:", activeChildTab ? activeChildTab.props.id : "none");

  return (
    <div>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabsToRender.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
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
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-4">
        {/* Hiển thị tab đang active */}
        {childTabs.find((tab) => tab.props.id === activeTab)}
      </div>
    </div>
  );
}; 