// A message has some text content, a list of tags and a timestamp
//
export interface Message {
    tags: string[];
    content: string;
    timestamp: Date;
    authormail: string;
}

// User defined type guard
// Type checking cannot be performed during the execution (we don't have the Message interface anyway)
// but we can create a function to check if the supplied parameter is compatible with a given type
//
// A better approach is to use JSON schema
//
export function isMessage(arg: any): arg is Message {
    return arg && arg.content && typeof(arg.content) === 'string' &&
           arg.tags && Array.isArray(arg.tags) && arg.timestamp &&
           arg.timestamp instanceof Date && arg.authormail && typeof(arg.authormail) === 'string' ;
}

