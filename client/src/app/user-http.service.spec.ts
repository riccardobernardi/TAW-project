import { TestBed } from '@angular/core/testing';

import { UserHttpService } from './user-http.service';

describe('UserHttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserHttpService = TestBed.get(UserHttpService);
    expect(service).toBeTruthy();
  });
});
