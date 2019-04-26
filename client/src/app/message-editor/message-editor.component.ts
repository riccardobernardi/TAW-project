import { Component, OnInit, EventEmitter, Output  } from '@angular/core';
import {Message} from '../Message';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-message-editor',
  templateUrl: './message-editor.component.html',
  styleUrls: ['./message-editor.component.css']
})
export class MessageEditorComponent implements OnInit {

  constructor( private ms: MessageService ) { }
  private message: Message;


  @Output() posted = new EventEmitter<Message>();

  ngOnInit() {
    this.set_empty();
  }

  set_empty() {
    this.message = { tags: [], content: '', timestamp: new Date(), authormail: '' };
  }

  get_tags() {
    return this.message.tags;
  }

  add_tag( tag: string ) {
    this.message.tags = this.message.tags.concat([ tag]);
  }

  post_message( ) {
    this.message.timestamp = new Date();
    this.ms.post_message( this.message ).subscribe( (m) => {
      console.log('Message posted');
      this.set_empty();
      this.posted.emit( m );

    }, (error) => {
      console.log('Error occurred while posting: ' + error);

    });
  }

}
