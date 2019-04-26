import { TestBed, inject } from '@angular/core/testing';

import { SocketioService } from './socketio.service';

describe('SocketioService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SocketioService]
    });
  });

  it('should be created', inject([SocketioService], (service: SocketioService) => {
    expect(service).toBeTruthy();
  }));
});
