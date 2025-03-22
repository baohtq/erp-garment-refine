"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Fabric, 
  FabricInventory, 
  CuttingOrder, 
  IssueRecord, 
  InventoryCheck,
  QualityControlRecord,
  Employee
} from '../types';

// Mock data imports (these would be replaced with actual API calls in production)
import { 
  mockFabrics,
  mockInventory,
  mockCuttingOrders,
  mockFabricIssues,
  mockInventoryChecks,
  mockEmployees
} from '../mocks';
import { mockIssueRecords, mockQualityControlRecords } from '../mocks/data';

interface FabricDataContextType {
  fabrics: Fabric[];
  inventory: FabricInventory[];
  cuttingOrders: CuttingOrder[];
  issueRecords: IssueRecord[];
  inventoryChecks: InventoryCheck[];
  qualityControlRecords: QualityControlRecord[];
  employees: Employee[];
  
  // Methods for managing fabrics
  addFabric: (fabric: Fabric) => void;
  updateFabric: (id: string, fabric: Fabric) => void;
  deleteFabric: (id: string) => void;
  
  // Methods for managing inventory
  updateInventory: (id: string, inventory: Partial<FabricInventory>) => void;
  
  // Methods for managing cutting orders
  addCuttingOrder: (order: CuttingOrder) => void;
  updateCuttingOrder: (id: string, order: Partial<CuttingOrder>) => void;
  
  // Methods for managing issue records
  addIssueRecord: (record: IssueRecord) => void;
  updateIssueRecord: (id: string, record: Partial<IssueRecord>) => void;
  
  // Methods for managing inventory checks
  addInventoryCheck: (check: InventoryCheck) => void;
  updateInventoryCheck: (id: string, check: Partial<InventoryCheck>) => void;
  
  // Methods for managing quality control records
  addQualityControlRecord: (record: QualityControlRecord) => void;
  updateQualityControlRecord: (id: string, record: Partial<QualityControlRecord>) => void;
}

const FabricDataContext = createContext<FabricDataContextType | undefined>(undefined);

export const useFabricData = () => {
  const context = useContext(FabricDataContext);
  if (!context) {
    throw new Error('useFabricData must be used within a FabricDataProvider');
  }
  return context;
};

interface FabricDataProviderProps {
  children: ReactNode;
}

export const FabricDataProvider: React.FC<FabricDataProviderProps> = ({ children }) => {
  const [fabrics, setFabrics] = useState<Fabric[]>(mockFabrics as any);
  const [inventory, setInventory] = useState<FabricInventory[]>(mockInventory as any);
  const [cuttingOrders, setCuttingOrders] = useState<CuttingOrder[]>(mockCuttingOrders as any);
  const [issueRecords, setIssueRecords] = useState<IssueRecord[]>(mockIssueRecords);
  const [inventoryChecks, setInventoryChecks] = useState<InventoryCheck[]>(mockInventoryChecks as any);
  const [qualityControlRecords, setQualityControlRecords] = useState<QualityControlRecord[]>(mockQualityControlRecords);
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees as any);

  // Fabric methods
  const addFabric = (fabric: Fabric) => {
    setFabrics(prev => [...prev, fabric]);
  };

  const updateFabric = (id: string, fabric: Fabric) => {
    setFabrics(prev => prev.map(item => item.id === id ? { ...item, ...fabric } : item));
  };

  const deleteFabric = (id: string) => {
    setFabrics(prev => prev.filter(item => item.id !== id));
  };

  // Inventory methods
  const updateInventory = (id: string, inventoryUpdate: Partial<FabricInventory>) => {
    setInventory(prev => prev.map(item => item.id === id ? { ...item, ...inventoryUpdate } : item));
  };

  // Cutting order methods
  const addCuttingOrder = (order: CuttingOrder) => {
    setCuttingOrders(prev => [...prev, order]);
  };

  const updateCuttingOrder = (id: string, orderUpdate: Partial<CuttingOrder>) => {
    setCuttingOrders(prev => prev.map(item => item.id === id ? { ...item, ...orderUpdate } : item));
  };

  // Issue record methods
  const addIssueRecord = (record: IssueRecord) => {
    setIssueRecords(prev => [...prev, record]);
  };

  const updateIssueRecord = (id: string, recordUpdate: Partial<IssueRecord>) => {
    setIssueRecords(prev => prev.map(item => item.id === id ? { ...item, ...recordUpdate } : item));
  };

  // Inventory check methods
  const addInventoryCheck = (check: InventoryCheck) => {
    setInventoryChecks(prev => [...prev, check]);
  };

  const updateInventoryCheck = (id: string, data: Partial<InventoryCheck>) => {
    setInventoryChecks(prevChecks => 
      prevChecks.map(check => 
        check.id === id ? { ...check, ...data, updatedAt: new Date().toISOString() } : check
      )
    );
  };

  // Quality control record methods
  const addQualityControlRecord = (record: QualityControlRecord) => {
    setQualityControlRecords(prev => [...prev, record]);
  };

  const updateQualityControlRecord = (id: string, data: Partial<QualityControlRecord>) => {
    setQualityControlRecords(prevRecords => 
      prevRecords.map(record => 
        record.id === id ? { ...record, ...data, updatedAt: new Date().toISOString() } : record
      )
    );
  };

  const value = {
    fabrics,
    inventory,
    cuttingOrders,
    issueRecords,
    inventoryChecks,
    qualityControlRecords,
    employees,
    addFabric,
    updateFabric,
    deleteFabric,
    updateInventory,
    addCuttingOrder,
    updateCuttingOrder,
    addIssueRecord,
    updateIssueRecord,
    addInventoryCheck,
    updateInventoryCheck,
    addQualityControlRecord,
    updateQualityControlRecord
  };

  return (
    <FabricDataContext.Provider value={value}>
      {children}
    </FabricDataContext.Provider>
  );
};

export default FabricDataProvider; 