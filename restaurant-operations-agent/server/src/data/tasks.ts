export type RestaurantTask = {
    id: string,
    title: string,
    quantity?: number,
    unit?: string,
    status: "open" | "completed"
};

export const tasks: RestaurantTask[] = [];