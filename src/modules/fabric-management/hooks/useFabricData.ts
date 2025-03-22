import { useState } from 'react';
import { mockFabrics as fabrics, mockFabricInventory as inventory } from '@/mocks-new/fabric-management.mock';
import { employees } from '@/mocks-new/employees.mock';
import { suppliers } from '@/mocks-new/suppliers.mock';

export function useFabricData() {
  const [fabricsState] = useState(fabrics);
  const [inventoryState] = useState(inventory);
  const [fabricIssues] = useState([]);
  const [fabricIssueItems] = useState([]);
  const [inventoryChecks] = useState([]);
  const [inventoryCheckItems] = useState([]);
  const [qualityControlRecords] = useState([]);

  return {
    fabrics: fabricsState,
    inventory: inventoryState,
    fabricIssues,
    fabricIssueItems,
    inventoryChecks,
    inventoryCheckItems,
    qualityControlRecords,
    suppliers,
    employees,
  };
} 