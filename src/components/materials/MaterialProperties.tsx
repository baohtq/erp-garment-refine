import React from 'react';

interface MaterialPropertiesProps {
  properties: Record<string, any>;
  propertiesConfig?: {
    id: string;
    name: string;
    type: 'text' | 'number' | 'select' | 'boolean';
    required: boolean;
    options?: string[];
  }[];
}

const MaterialProperties: React.FC<MaterialPropertiesProps> = ({ properties, propertiesConfig }) => {
  if (!properties || Object.keys(properties).length === 0) {
    return <div className="text-gray-500 italic">Không có thuộc tính</div>;
  }

  // Nếu không có cấu hình thuộc tính, hiển thị tất cả các thuộc tính dưới dạng danh sách
  if (!propertiesConfig) {
    return (
      <div className="space-y-2">
        {Object.entries(properties).map(([key, value]) => (
          <div key={key} className="flex justify-between border-b pb-2">
            <span className="font-medium">{key}:</span>
            <span className="text-gray-600">
              {typeof value === 'boolean' 
                ? (value ? 'Có' : 'Không') 
                : String(value)}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // Nếu có cấu hình thuộc tính, hiển thị theo cấu hình với định dạng phù hợp
  return (
    <div className="space-y-2">
      {propertiesConfig.map((config) => {
        const value = properties[config.name];
        if (value === undefined) return null;

        return (
          <div key={config.id} className="flex justify-between border-b pb-2">
            <span className="font-medium">{config.name}:</span>
            <span className="text-gray-600">
              {config.type === 'boolean' 
                ? (value ? 'Có' : 'Không')
                : config.type === 'select' 
                  ? value
                  : config.type === 'number' 
                    ? Number(value).toLocaleString('vi-VN')
                    : String(value)
              }
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default MaterialProperties; 