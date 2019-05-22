export interface Table {
    num: number;
    max_people: number;
    state: string;
}

// User defined type guard
// Type checking cannot be performed during the execution (we don't have the Message interface anyway)
// but we can create a function to check if the supplied parameter is compatible with a given type
//
// A better approach is to use JSON schema
//
export function isTable(arg: any): arg is Table {
  return arg;
}
