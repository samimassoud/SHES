// Helper: Check if item is below threshold
// export const isItemCritical = (item) => 
//   item.QuantityInStock < item.ReorderThreshold;
export const isItemCritical = (item) => {
  if (item.QuantityInStock <= 0) return true; // Catch zero/negative stock
  return item.QuantityInStock < (item.ReorderThreshold || 10); // Default threshold
};

// Helper: Get items critical during specific events
export const getEventCriticalItems = (items, eventName) => 
  items.filter(item => 
    item.CriticalDuringEvents?.includes(eventName) //optional chaining
  );

// AI Simulation: Calculate suggested restock quantity
// export const calculateSuggestedQty = (item) => {
//   const baseQty = item.AverageMonthlyUsage * 3; // Quarterly base
//   const buffer = item.CriticalDuringEvents.length > 0 ? 1.5 : 1.2;
//   return Math.ceil(baseQty * buffer);
// };
// Enhanced AI suggestion with seasonal factors
export const calculateSuggestedQty = (item, currentMonth) => {
  const seasonalMultipliers = {
    11: 1.5, // Winter (higher demand for flu meds)
    3: 1.3,  // Ramadan
    default: 1.0
  };
  const baseQty = item.AverageMonthlyUsage * 3; // Quarterly base
  const buffer = item.CriticalDuringEvents?.length > 0 ? 1.5 : 1.2;
  const seasonalFactor = seasonalMultipliers[currentMonth] || seasonalMultipliers.default;
  return Math.ceil(baseQty * buffer * seasonalFactor);
};