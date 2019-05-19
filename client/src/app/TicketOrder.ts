export interface TicketOrder {
  _id : string,
  name_item : string,
  username_waiter : string,
  state : string,
  price : number,
  added: []
}

// User defined type guard
// Type checking cannot be performed during the execution (we don't have the Message interface anyway)
// but we can create a function to check if the supplied parameter is compatible with a given type
//
// A better approach is to use JSON schema
//
export function isOrder(arg: any): arg is TicketOrder {
  return arg;
}
