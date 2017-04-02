import { TestBed, async, inject } from '@angular/core/testing';

import { BasedOnTypeGuard } from './based-on-type.guard';

describe('BasedOnTypeGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BasedOnTypeGuard]
    });
  });

  it('should ...', inject([BasedOnTypeGuard], (guard: BasedOnTypeGuard) => {
    expect(guard).toBeTruthy();
  }));
});
