import { askRestaurantAgent } from "./ai/restaurantAgent";

async function main() {
  const response = await askRestaurantAgent(
    "Are we ready for tonight's dinner rush? Check the demand forecast and our chicken inventory."
  );

  console.log("\nRestaurant Agent:\n");
  console.log(response.output_text);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});