import { TestBed, inject } from '@angular/core/testing';

import { MessageHttpService } from './message-http.service';

describe('MessageHttpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessageHttpService]
    });
  });

  it('should be created', inject([MessageHttpService], (service: MessageHttpService) => {
    expect(service).toBeTruthy();
  }));
});
