import { askRestaurantAgent, approveTask, rejectTask, editAndApproveTask } from "../ai/restaurantAgent";

async function main() {
  // const response = await askRestaurantAgent(
  //   "Are we ready for tonight's dinner rush? Check the demand forecast and our chicken inventory."
  // );

  // console.log("\nRestaurant Agent:\n");
  // console.log(response.output_text);

  const result = await askRestaurantAgent(
    `
We need to prepare for tonight's dinner rush.

Check the forecast and chicken inventory.

If there is a chicken shortage,
propose a task to prepare the missing quantity.
  `.trim()
  );

  //   if (result.type === "pending_approval") {
  //   console.log("\nApproval Required:\n");
  //   console.log(result.arguments);

  //   console.log("\nSimulating manager rejection...\n");

  //   const afterRejection =
  //     await rejectTask(result);

  //   if (afterRejection.type === "completed") {
  //     console.log("\nRestaurant Agent:\n");
  //     console.log(
  //       afterRejection.response.output_text
  //     );
  //   }

  //   return;
  // }

  //   if (result.type === "pending_approval") {
  //   console.log("\nApproval Required:\n");
  //   console.log(result.arguments);

  //   console.log("\nSimulating manager edit...\n");

  //   const editedArguments = {
  //     ...result.arguments,
  //     quantity: 10,
  //   };

  //   console.log("Edited proposal:", editedArguments);

  //   const afterEdit = await editAndApproveTask(
  //     result,
  //     editedArguments
  //   );

  //   if (afterEdit.type === "completed") {
  //     console.log("\nRestaurant Agent:\n");
  //     console.log(
  //       afterEdit.response.output_text
  //     );
  //   }

  //   return;
  // }

  if (result.type === "pending_approval") {
    console.log("\nApproval Required:\n");
    console.log(result.arguments);

    console.log("\nSimulating manager approval...\n");
    // const finalResponse = await approveTask(result);
    // console.log("\nRestaurant Agent:\n");
    // console.log(finalResponse.output_text);
    const afterApproval = await approveTask(result);
    if (afterApproval.type === "completed") {
      console.log("\nRestaurant Agent:\n");
      console.log(
        afterApproval.response.output_text
      );
    }
    return;
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});