import { 
  Home, 
  Package, 
  ShoppingCart, 
  Users, 
  FileText, 
  Settings, 
  Boxes, 
  BarChart3, 
  ChevronRight,
  Layers,
  Shirt,
  Ruler,
  ScissorsLineDashed,
  ClipboardCheck,
  Factory,
  Truck
} from 'lucide-react';
import React from 'react';

export const getIconByName = (iconName: string): React.ReactNode => {
  switch (iconName) {
    case 'home':
      return <Home className="h-4 w-4" />;
    case 'users':
      return <Users className="h-4 w-4" />;
    case 'settings':
      return <Settings className="h-4 w-4" />;
    case 'products':
      return <Package className="h-4 w-4" />;
    case 'orders':
      return <ShoppingCart className="h-4 w-4" />;
    case 'fabric':
      return <Layers className="h-4 w-4" />;
    case 'reports':
      return <BarChart3 className="h-4 w-4" />;
    case 'documents':
      return <FileText className="h-4 w-4" />;
    case 'inventory':
      return <Boxes className="h-4 w-4" />;
    case 'suppliers':
      return <Truck className="h-4 w-4" />;
    case 'materials':
      return <Shirt className="h-4 w-4" />;
    case 'production':
      return <Factory className="h-4 w-4" />;
    case 'scissors':
      return <ScissorsLineDashed className="h-4 w-4" />;
    case 'ruler':
      return <Ruler className="h-4 w-4" />;
    case 'checklist':
      return <ClipboardCheck className="h-4 w-4" />;
    default:
      return <ChevronRight className="h-4 w-4" />;
  }
}; 