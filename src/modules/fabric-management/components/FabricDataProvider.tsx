"use client";

import React, { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabaseBrowserClient } from "@/utils/supabase/client";
import {
  Fabric,
  FabricInventory,
  CuttingOrder,
  FabricIssue,
  FabricIssueItem,
  InventoryCheck,
  InventoryCheckItem
} from "@/mocks-new/fabric-management.mock";

// Define the context type
interface FabricContextType {
  // Data
  fabrics: Fabric[];
  inventory: FabricInventory[];
  cuttingOrders: CuttingOrder[];
  fabricIssues: FabricIssue[];
  fabricIssueItems: FabricIssueItem[];
  suppliers: { id: number; name: string }[];
  employees: { id: number; name: string; position: string }[];
  inventoryChecks: InventoryCheck[];
  inventoryCheckItems: InventoryCheckItem[];
  
  // Loading states
  isLoading: boolean;
  
  // CRUD operations
  fetchData: () => Promise<void>;
  saveFabric: (fabric: Partial<Fabric>) => Promise<Fabric>;
  deleteFabric: (id: number) => Promise<void>;
  saveInventory: (inventory: Partial<FabricInventory>) => Promise<FabricInventory>;
  saveIssue: (issue: Partial<FabricIssue>, inventoryIds: number[]) => Promise<FabricIssue>;
  saveInventoryCheck: (check: Partial<InventoryCheck>, items: Partial<InventoryCheckItem>[]) => Promise<InventoryCheck>;
  deleteInventoryCheck: (id: number) => Promise<void>;
  updateCuttingOrderStatus: (id: number, status: string, data?: any) => Promise<void>;
}

// Create context
const FabricContext = createContext<FabricContextType | undefined>(undefined);

// Provider component
export const FabricDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State for all data
  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [inventory, setInventory] = useState<FabricInventory[]>([]);
  const [cuttingOrders, setCuttingOrders] = useState<CuttingOrder[]>([]);
  const [fabricIssues, setFabricIssues] = useState<FabricIssue[]>([]);
  const [fabricIssueItems, setFabricIssueItems] = useState<FabricIssueItem[]>([]);
  const [suppliers, setSuppliers] = useState<{ id: number; name: string }[]>([]);
  const [employees, setEmployees] = useState<{ id: number; name: string; position: string }[]>([]);
  const [inventoryChecks, setInventoryChecks] = useState<InventoryCheck[]>([]);
  const [inventoryCheckItems, setInventoryCheckItems] = useState<InventoryCheckItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // In a real app, these would be API calls to Supabase
      // For demonstration, we're using mock data
      const { data: fabricsData } = await supabaseBrowserClient
        .from('fabrics')
        .select('*');
      
      const { data: inventoryData } = await supabaseBrowserClient
        .from('fabric_inventory')
        .select('*');
      
      const { data: cuttingOrdersData } = await supabaseBrowserClient
        .from('cutting_orders')
        .select('*');
      
      const { data: fabricIssuesData } = await supabaseBrowserClient
        .from('fabric_issues')
        .select('*');
      
      const { data: fabricIssueItemsData } = await supabaseBrowserClient
        .from('fabric_issue_items')
        .select('*');
      
      const { data: suppliersData } = await supabaseBrowserClient
        .from('suppliers')
        .select('id, name');
      
      const { data: employeesData } = await supabaseBrowserClient
        .from('employees')
        .select('id, name, position');
      
      const { data: inventoryChecksData } = await supabaseBrowserClient
        .from('inventory_checks')
        .select('*');
      
      const { data: inventoryCheckItemsData } = await supabaseBrowserClient
        .from('inventory_check_items')
        .select('*');
      
      // Update state with the fetched data
      setFabrics(fabricsData || []);
      setInventory(inventoryData || []);
      setCuttingOrders(cuttingOrdersData || []);
      setFabricIssues(fabricIssuesData || []);
      setFabricIssueItems(fabricIssueItemsData || []);
      setSuppliers(suppliersData || []);
      setEmployees(employeesData || []);
      setInventoryChecks(inventoryChecksData || []);
      setInventoryCheckItems(inventoryCheckItemsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // CRUD operations for Fabric
  const saveFabric = async (fabric: Partial<Fabric>): Promise<Fabric> => {
    try {
      if (fabric.id) {
        // Update existing fabric
        const { data, error } = await supabaseBrowserClient
          .from('fabrics')
          .update(fabric)
          .eq('id', fabric.id)
          .select()
          .single();
        
        if (error) throw error;
        
        // Update local state
        setFabrics(prev => prev.map(item => item.id === fabric.id ? data : item));
        return data;
      } else {
        // Create new fabric
        const { data, error } = await supabaseBrowserClient
          .from('fabrics')
          .insert(fabric)
          .select()
          .single();
        
        if (error) throw error;
        
        // Update local state
        setFabrics(prev => [...prev, data]);
        return data;
      }
    } catch (error) {
      console.error('Error saving fabric:', error);
      throw error;
    }
  };

  const deleteFabric = async (id: number): Promise<void> => {
    try {
      const { error } = await supabaseBrowserClient
        .from('fabrics')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setFabrics(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting fabric:', error);
      throw error;
    }
  };

  // CRUD operations for Inventory
  const saveInventory = async (inventoryItem: Partial<FabricInventory>): Promise<FabricInventory> => {
    try {
      if (inventoryItem.id) {
        // Update existing inventory
        const { data, error } = await supabaseBrowserClient
          .from('fabric_inventory')
          .update(inventoryItem)
          .eq('id', inventoryItem.id)
          .select()
          .single();
        
        if (error) throw error;
        
        // Update local state
        setInventory(prev => prev.map(item => item.id === inventoryItem.id ? data : item));
        return data;
      } else {
        // Create new inventory
        const { data, error } = await supabaseBrowserClient
          .from('fabric_inventory')
          .insert(inventoryItem)
          .select()
          .single();
        
        if (error) throw error;
        
        // Update local state
        setInventory(prev => [...prev, data]);
        return data;
      }
    } catch (error) {
      console.error('Error saving inventory:', error);
      throw error;
    }
  };

  // Save issue and items in a transaction
  const saveIssue = async (issue: Partial<FabricIssue>, inventoryIds: number[]): Promise<FabricIssue> => {
    try {
      let savedIssue: FabricIssue;
      
      if (issue.id) {
        // Update existing issue
        const { data, error } = await supabaseBrowserClient
          .from('fabric_issues')
          .update(issue)
          .eq('id', issue.id)
          .select()
          .single();
        
        if (error) throw error;
        savedIssue = data;
        
        // Update local state
        setFabricIssues(prev => prev.map(item => item.id === issue.id ? data : item));
      } else {
        // Create new issue
        const { data, error } = await supabaseBrowserClient
          .from('fabric_issues')
          .insert(issue)
          .select()
          .single();
        
        if (error) throw error;
        savedIssue = data;
        
        // Update local state
        setFabricIssues(prev => [...prev, data]);
      }
      
      // TODO: Handle issue items based on inventory IDs
      
      return savedIssue;
    } catch (error) {
      console.error('Error saving issue:', error);
      throw error;
    }
  };

  // Save inventory check and items
  const saveInventoryCheck = async (
    check: Partial<InventoryCheck>, 
    items: Partial<InventoryCheckItem>[]
  ): Promise<InventoryCheck> => {
    try {
      let savedCheck: InventoryCheck;
      
      if (check.id) {
        // Update existing check
        const { data, error } = await supabaseBrowserClient
          .from('inventory_checks')
          .update(check)
          .eq('id', check.id)
          .select()
          .single();
        
        if (error) throw error;
        savedCheck = data;
        
        // Update local state
        setInventoryChecks(prev => prev.map(item => item.id === check.id ? data : item));
      } else {
        // Create new check
        const { data, error } = await supabaseBrowserClient
          .from('inventory_checks')
          .insert(check)
          .select()
          .single();
        
        if (error) throw error;
        savedCheck = data;
        
        // Update local state
        setInventoryChecks(prev => [...prev, data]);
      }
      
      // TODO: Handle check items
      
      return savedCheck;
    } catch (error) {
      console.error('Error saving inventory check:', error);
      throw error;
    }
  };

  // Delete inventory check
  const deleteInventoryCheck = async (id: number): Promise<void> => {
    try {
      const { error } = await supabaseBrowserClient
        .from('inventory_checks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setInventoryChecks(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting inventory check:', error);
      throw error;
    }
  };

  // Update cutting order status
  const updateCuttingOrderStatus = async (
    id: number, 
    status: string, 
    data?: { actual_start_date?: string; actual_end_date?: string; }
  ): Promise<void> => {
    try {
      const updateData = { status, ...data };
      
      const { error } = await supabaseBrowserClient
        .from('cutting_orders')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setCuttingOrders(prev => 
        prev.map(order => 
          order.id === id 
            ? { ...order, status, ...(data || {}) } 
            : order
        )
      );
    } catch (error) {
      console.error('Error updating cutting order status:', error);
      throw error;
    }
  };

  // Load initial data
  useEffect(() => {
    fetchData();
  }, []);

  // Create the context value
  const contextValue: FabricContextType = {
    fabrics,
    inventory,
    cuttingOrders,
    fabricIssues,
    fabricIssueItems,
    suppliers,
    employees,
    inventoryChecks,
    inventoryCheckItems,
    isLoading,
    fetchData,
    saveFabric,
    deleteFabric,
    saveInventory,
    saveIssue,
    saveInventoryCheck,
    deleteInventoryCheck,
    updateCuttingOrderStatus
  };

  return (
    <FabricContext.Provider value={contextValue}>
      {children}
    </FabricContext.Provider>
  );
};

// Custom hook to use the fabric context
export const useFabricData = (): FabricContextType => {
  const context = useContext(FabricContext);
  if (context === undefined) {
    throw new Error('useFabricData must be used within a FabricDataProvider');
  }
  return context;
}; 