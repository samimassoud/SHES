import React from 'react';
import { warehouseItems } from '../../mocks/mockData';
import { isItemCritical, calculateSuggestedQty } from './inventoryLogic';
import './InventoryTracker.css';

function InventoryTracker() {
  return (
    <div className="inventory-tracker">
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Suggested Qty</th>
          </tr>
        </thead>
        <tbody>
          {warehouseItems.map(item => (
            <tr key={item.ItemID} className={isItemCritical(item) ? 'critical' : ''}>
              <td>{item.ItemName}</td>
              <td>{item.Category}</td>
              <td>{item.QuantityInStock} {item.Unit}</td>
              <td title={`Reorder at ${item.ReorderThreshold} ${item.Unit}`}>
                {isItemCritical(item) ? '⚠️ Low' : '✅ OK'}
              </td>
              <td>{calculateSuggestedQty(item)} {item.Unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryTracker;