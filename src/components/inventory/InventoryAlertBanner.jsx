import React from 'react';
import { isItemCritical } from './inventoryLogic';
import { warehouseItems } from '../../mocks/mockData';
import './InventoryAlertBanner.css';

function InventoryAlertBanner() {
  const criticalItems = warehouseItems.filter(isItemCritical);

  if (criticalItems.length === 0) return null;

  return (
    <div className="inventory-alert">
      <span>⚠️ Critical Items: </span>
      {criticalItems.map(item => (
        <span key={item.ItemID} className="alert-item">
          {item.ItemName} (Stock: {item.QuantityInStock})
        </span>
      ))}
    </div>
  );
}

export default InventoryAlertBanner;