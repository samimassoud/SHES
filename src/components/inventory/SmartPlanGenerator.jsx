import React, { useState } from 'react';
import { warehouseItems } from '../../mocks/mockData';
import { getEventCriticalItems, calculateSuggestedQty } from './inventoryLogic';

function SmartPlanGenerator() {
  const [includeEvents, setIncludeEvents] = useState(true);
  const [restockPlan, setRestockPlan] = useState([]);

  const generatePlan = () => {
    const itemsToRestock = includeEvents
      ? [...new Set([...warehouseItems.filter(item => item.CriticalDuringEvents?.length > 0)])]
      : [...warehouseItems];

    const plan = itemsToRestock.map(item => ({
      ...item,
      SuggestedQty: calculateSuggestedQty(item, new Date().getMonth() + 1), // Current month
    }));
    setRestockPlan(plan);
  };

  return (
    <div className="plan-generator">
      <h3>Generate Restock Plan</h3>
      <label>
        <input
          type="checkbox"
          checked={includeEvents}
          onChange={() => setIncludeEvents(!includeEvents)}
        />
        Include Event-Based Items
      </label>
      <button onClick={generatePlan}>Generate Plan</button>
      
      {restockPlan.length > 0 && (
        <ul className="plan-list">
          {restockPlan.map(item => (
            <li key={item.ItemID}>
              {item.ItemName}: {item.SuggestedQty} {item.Unit}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SmartPlanGenerator;