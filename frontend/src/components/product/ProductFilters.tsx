import React from 'react';

interface Attribute {
  id: number;
  name: string;
  display_name: string;
  values: {
    id: number;
    value: string;
  }[];
}

interface ProductFiltersProps {
  attributes: Attribute[];
  selectedFilters: Record<string, number[]>;
  onFilterChange: (attributeId: number, valueId: number) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  attributes,
  selectedFilters,
  onFilterChange,
}) => {
  console.log('ProductFilters props:', { attributes, selectedFilters });
  
  return (
    <div className="space-y-6">
      {attributes.map((attribute) => (
        <div key={attribute.id} className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            {attribute.display_name}
          </h3>
          <div className="space-y-2">
            {attribute.values.map((value) => (
              <label key={value.id} className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                  checked={selectedFilters[attribute.id]?.includes(value.id) || false}
                  onChange={() => onFilterChange(attribute.id, value.id)}
                />
                <span className="ml-2 text-gray-700">{value.value}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductFilters; 