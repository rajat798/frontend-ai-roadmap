export type Recipe = {
  id: string;
  name: string;
  ingredients: {
    ingredientId: string;
    quantityPerServing: number;
    unit: string;
  }[];
};

export const recipes: Recipe[] = [
  {
    id: "grilled-chicken",
    name: "Grilled Chicken",
    ingredients: [
      {
        ingredientId: "chicken",
        quantityPerServing: 0.2,
        unit: "kg",
      },
    ],
  },
  {
    id: "tomato-rice",
    name: "Tomato Rice",
    ingredients: [
      {
        ingredientId: "rice",
        quantityPerServing: 0.15,
        unit: "kg",
      },
      {
        ingredientId: "tomato",
        quantityPerServing: 0.08,
        unit: "kg",
      },
    ],
  },
];