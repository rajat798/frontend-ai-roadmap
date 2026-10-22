export type InventoryItem = {
  ingredientId: string;
  name: string;
  quantity: number;
  unit: "kg" | "litre" | "piece";
  minimumRequired: number;
};

export const inventory: InventoryItem[] = [
  {
    ingredientId: "chicken",
    name: "Chicken Breast",
    quantity: 18,
    unit: "kg",
    minimumRequired: 30,
  },
  {
    ingredientId: "tomato",
    name: "Tomatoes",
    quantity: 25,
    unit: "kg",
    minimumRequired: 15,
  },
  {
    ingredientId: "rice",
    name: "Basmati Rice",
    quantity: 40,
    unit: "kg",
    minimumRequired: 25,
  },
];