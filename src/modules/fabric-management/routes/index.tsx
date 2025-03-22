"use client";

import React from 'react';
import PageHeader from '../components/PageHeader';
import { FabricDataProvider } from '../context/FabricDataProvider';
import FabricManagementTabs from '../components/FabricManagementTabs';

export const FabricManagementPage: React.FC = () => {
  return (
    <FabricDataProvider>
      <div className="container mx-auto px-4 py-8">
        <PageHeader />
        <FabricManagementTabs />
      </div>
    </FabricDataProvider>
  );
};

export default FabricManagementPage; 