import { inventory } from "../data/inventory";

export function checkInventory(itemID: string) {
  const item = inventory.find(
    item => item.ingredientId === itemID
  );

  if (!item) {
    return null;
  }

  const shortage = Math.max(
    item.minimumRequired - item.quantity,
    0
  );

  return {
    ingredientId: item.ingredientId,
    name: item.name,
    available: item.quantity,
    required: item.minimumRequired,
    unit: item.unit,
    shortage,
    sufficient: shortage === 0,
  };
}