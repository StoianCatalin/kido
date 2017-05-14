import { TestBed, inject } from '@angular/core/testing';

import { ParentService } from './parent.service';

describe('ParentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ParentService]
    });
  });

  it('should ...', inject([ParentService], (service: ParentService) => {
    expect(service).toBeTruthy();
  }));
});
