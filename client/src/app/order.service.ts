import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  public orders = [{id: 1, nick : '--' , selTable : '--' , selMenuEntry : '--'}];
  private id = 2;

  constructor() {
  }

  send(nick: any, selTable: any, selMenuEntry: any) {
    this.orders.push({id: this.id, nick , selTable, selMenuEntry});
    this.id += 1;
    console.log('you have sent to server your order from ' + nick + ' by table ' + selTable + ' with ' + selMenuEntry);
  }

  get(val) {
    return this.orders.filter(obj => obj.selTable === val);
  }

  arrayRemove(arr, value) {

    return arr.filter(function(ele){
      if(ele.id == 1){
        return true;
      }
      return ele.id != value;
    });

  }

  delete(value) {
    /*this.orders.forEach( (item, index) => {
      if (item.id == id) {this.orders.splice(index, 1 ); }
    });*/
    this.orders = this.arrayRemove(this.orders, value );
    console.log('you have deleted to server your order num ' + value);
  }
}
