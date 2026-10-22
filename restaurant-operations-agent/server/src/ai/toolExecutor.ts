import { checkInventory } from "../tools/checkInventory";
import { getForecast } from "../tools/getForecast";
import { listRecipes } from "../tools/listRecipes";

export function executeTool(
  toolName: string,
  args: Record<string, unknown>
) {
  switch (toolName) {
    case "check_inventory":
      return checkInventory(args.ingredientId as string);

    case "get_forecast":
      return getForecast();

    case "list_recipes":
      return listRecipes();

    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}