import { TestBed } from '@angular/core/testing';
import { RouteCheckerService } from './route-checker.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('RouteCheckerService', () => {
  let service: RouteCheckerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '123' }),
            snapshot: { paramMap: { get: () => '123' } },
          },
        }
      ]
    });
    service = TestBed.inject(RouteCheckerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
