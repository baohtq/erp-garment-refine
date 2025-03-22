"use client";

import React, { useState } from 'react';
import FabricContent from '../FabricContent';
import InventoryContent from '../InventoryContent';
import CuttingContent from '../CuttingContent';
import IssueContent from '../IssueContent';
import InventoryCheckContent from '../InventoryCheckContent';
import QualityControlContent from '../QualityControlContent';

const FabricManagementTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('fabric');

  const tabs = [
    { id: 'fabric', label: 'Vải' },
    { id: 'inventory', label: 'Kho vải' },
    { id: 'cutting', label: 'Lệnh cắt' },
    { id: 'issue', label: 'Phiếu xuất vải' },
    { id: 'inventory-check', label: 'Kiểm kê' },
    { id: 'quality-control', label: 'Kiểm soát chất lượng' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
              }`}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'fabric' && <FabricContent />}
        {activeTab === 'inventory' && <InventoryContent />}
        {activeTab === 'cutting' && <CuttingContent />}
        {activeTab === 'issue' && <IssueContent />}
        {activeTab === 'inventory-check' && <InventoryCheckContent />}
        {activeTab === 'quality-control' && <QualityControlContent />}
      </div>
    </div>
  );
};

export default FabricManagementTabs; 