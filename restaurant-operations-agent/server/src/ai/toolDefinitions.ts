import type OpenAI from "openai";

export const checkInventoryTool = {
  type: "function",
  name: "check_inventory",

  description:
    "Check the current inventory level and shortage status for a restaurant ingredient.",

  parameters: {
    type: "object",

    properties: {
      ingredientId: {
        type: "string",
        description:
          "The ingredient ID to check, for example chicken, tomato, or rice.",
      },
    },

    required: ["ingredientId"],
    additionalProperties: false,
  },

  strict: true,
} as const;


export const getForecastTool = {
  type: "function",
  name: "get_forecast",

  description:
    "Get the expected restaurant demand forecast for tonight.",

  parameters: {
    type: "object",
    properties: {},
    required: [],
    additionalProperties: false,
  },

  strict: true,
} as const;


export const listRecipesTool = {
  type: "function",
  name: "list_recipes",

  description:
    "List the restaurant recipes and ingredients required for each recipe.",

  parameters: {
    type: "object",
    properties: {},
    required: [],
    additionalProperties: false,
  },

  strict: true,
} as const;


export const restaurantTools = [
  checkInventoryTool,
  getForecastTool,
  listRecipesTool,
] satisfies OpenAI.Responses.Tool[];