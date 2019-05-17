export interface Item {
    ingredients: [string];
    id: string;
    name: string;
    type: [string];
    price: number;
    required_time : number;
}

export function isOrder(arg: any): arg is Item {
    return arg;
  }