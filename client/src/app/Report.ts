export interface Report {
    date: Date,
    total: number,
    total_orders: {dish: number, beverage: number},
    total_customers: number,
    average_stay: number
}