import { TestBed } from '@angular/core/testing';

import { WaiterSocketioService } from './waiter-socketio.service';

describe('WaiterSocketioService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WaiterSocketioService = TestBed.get(WaiterSocketioService);
    expect(service).toBeTruthy();
  });
});
