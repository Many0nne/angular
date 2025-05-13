import { Injectable } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RouteCheckerService {

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  /* 
  C'est juste un service pour renvoyer la route actuelle 
  */

  getCurrentRoute(): Observable<string> {
    return this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      map(route => route.snapshot.url.map(segment => segment.path).join('/'))
    );
  }
}
