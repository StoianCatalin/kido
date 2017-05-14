import { TestBed, async, inject } from '@angular/core/testing';

import { AllowParentGuard } from './allow-parent.guard';

describe('AllowParentGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AllowParentGuard]
    });
  });

  it('should ...', inject([AllowParentGuard], (guard: AllowParentGuard) => {
    expect(guard).toBeTruthy();
  }));
});
