import React, { useState } from 'react';
import { isItemCritical } from './inventoryLogic';
import { warehouseItems } from '../../mocks/mockData';

function InventoryAlertBanner() {
  const [expanded, setExpanded] = useState(false);
  const criticalItems = warehouseItems.filter(isItemCritical);

  if (criticalItems.length === 0) return null;

  return (
    <div className="inventory-alert">
      <span>⚠️ Critical Items: </span>
      {expanded ? (
        criticalItems.map(item => (
          <span key={item.ItemID} className="alert-item">
            {item.ItemName} (Stock: {item.QuantityInStock})
          </span>
        ))
      ) : (
        <span className="alert-item">
          {criticalItems.length} items low in stock
        </span>
      )}
      <button 
        className="toggle-btn"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? 'Show Less' : 'Show All'}
      </button>
    </div>
  );
}

export default InventoryAlertBanner;