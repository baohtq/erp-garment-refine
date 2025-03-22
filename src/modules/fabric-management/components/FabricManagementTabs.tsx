"use client";

import React, { useState } from "react";
import { Tabs, Tab, TabItem } from "@/components/fabric-management/Tabs";
import { useFabricData } from "./FabricDataProvider";

// Tab content components
import FabricContent from "./tabs/FabricContent";
import InventoryContent from "./tabs/InventoryContent";
import IssueContent from "./tabs/IssueContent";
import CuttingContent from "./tabs/CuttingContent";
import InventoryCheckContent from "./tabs/InventoryCheckContent";
import QualityControlContent from "./tabs/QualityControlContent";

// Define the tabs available in the fabric management page
const tabs: TabItem[] = [
  { id: "dashboard", label: "Tổng quan kho vải", icon: "chart-pie" },
  { id: "fabrics", label: "Loại vải", icon: "clipboard-list" },
  { id: "inventory", label: "Kho vải", icon: "archive" },
  { id: "cutting", label: "Lệnh cắt", icon: "scissors" },
  { id: "issues", label: "Phát vải", icon: "truck" },
  { id: "inventory-check", label: "Kiểm kê", icon: "clipboard-check" },
  { id: "quality-control", label: "Kiểm soát chất lượng", icon: "shield-check" },
];

const FabricManagementTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const fabricData = useFabricData();

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <InventoryContent mode="dashboard" />;
      case "fabrics":
        return <FabricContent />;
      case "inventory":
        return <InventoryContent mode="detail" />;
      case "cutting":
        return <CuttingContent />;
      case "issues":
        return <IssueContent />;
      case "inventory-check":
        return <InventoryCheckContent />;
      case "quality-control":
        return <QualityControlContent />;
      default:
        return <div>Nội dung không tồn tại</div>;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Tabs activeTab={activeTab} onChange={setActiveTab}>
        {tabs.map((tab) => (
          <Tab key={tab.id} id={tab.id} label={tab.label} icon={tab.icon} />
        ))}
      </Tabs>
      <div className="flex-grow p-4">
        {fabricData.isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          renderTabContent()
        )}
      </div>
    </div>
  );
};

export default FabricManagementTabs; 