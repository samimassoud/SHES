// Helper: Check if item is below threshold
export const isItemCritical = (item) => 
  item.QuantityInStock < item.ReorderThreshold;

// Helper: Get items critical during specific events
export const getEventCriticalItems = (items, eventName) => 
  items.filter(item => 
    item.CriticalDuringEvents.includes(eventName)
  );

// AI Simulation: Calculate suggested restock quantity
export const calculateSuggestedQty = (item) => {
  const baseQty = item.AverageMonthlyUsage * 3; // Quarterly base
  const buffer = item.CriticalDuringEvents.length > 0 ? 1.5 : 1.2;
  return Math.ceil(baseQty * buffer);
};