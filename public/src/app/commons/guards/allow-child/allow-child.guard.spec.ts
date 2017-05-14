import { TestBed, async, inject } from '@angular/core/testing';

import { AllowChildGuard } from './allow-child.guard';

describe('AllowChildGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AllowChildGuard]
    });
  });

  it('should ...', inject([AllowChildGuard], (guard: AllowChildGuard) => {
    expect(guard).toBeTruthy();
  }));
});
