import { TicketOrder } from './TicketOrder';

export interface Ticket {
    _id: string, 
    waiter: string,
    table: number,
    orders: TicketOrder[],
    start: Date,
    end: Date,
    state: string, 
    total: number
  }
  
  // User defined type guard
  // Type checking cannot be performed during the execution (we don't have the Message interface anyway)
  // but we can create a function to check if the supplied parameter is compatible with a given type
  //
  // A better approach is to use JSON schema
  //
  export function isOrder(arg: any): arg is Ticket {
    return arg;
  }