import {roles} from "./User";

export interface Report {
    _id? : string,
    date: Date,
    total: number,
    total_orders: {dish: number, beverage: number},
    total_customers: number,
    average_stay: number,
    users_reports: {}
}

export interface WaiterReport {
    username: string,
    orders_served: number,
    customers_server: number
}

export interface CookerBartenderReport {
    username: string,
    items_served: string
}