import React, { useState } from 'react';
import { warehouseItems, events } from '../../mocks/mockData';
import { getEventCriticalItems, calculateSuggestedQty } from './inventoryLogic';
import './SmartPlanGenerator.css';

function SmartPlanGenerator() {
  const [includeEvents, setIncludeEvents] = useState(true);

  const generatePlan = () => {
    const itemsToRestock = includeEvents
      ? [...warehouseItems.filter(item => item.CriticalDuringEvents.length > 0)]
      : [...warehouseItems];

    return itemsToRestock.map(item => ({
      ...item,
      SuggestedQty: calculateSuggestedQty(item),
    }));
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
      <button onClick={() => console.log(generatePlan())}>
        Generate Plan
      </button>
    </div>
  );
}

export default SmartPlanGenerator;