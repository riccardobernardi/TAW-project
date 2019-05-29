export interface Report {
    _id? : string,
    date: Date,
    total: number,
    total_orders: {dish: number, beverage: number},
    total_customers: number,
    average_stay: number
}