import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'breadcrumbs',
  template: `
    <template ngFor let-breadcrumb [ngForOf]="breadcrumbs" let-last = last>
        <li class="breadcrumb-item" *ngIf="breadcrumb.label.title" [ngClass]="{active: last}">
        <a *ngIf="!last" [routerLink]="breadcrumb.url">{{breadcrumb.label.title}}</a>
        <span *ngIf="last" [routerLink]="breadcrumb.url">{{breadcrumb.label.title}}</span>
    </template>`
})
export class BreadcrumbsComponent {
  breadcrumbs: Array<Object>;
  constructor(private router: Router, private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
      this.breadcrumbs = [];
      let currentRoute = this.route.root,
        url = '';
      do {
        let childrenRoutes = currentRoute.children;

        currentRoute = null;
        childrenRoutes.forEach(route => {
          if (route.outlet === 'primary') {
            let routeSnapshot = route.snapshot;
            url += '/' + routeSnapshot.url.map(segment => segment.path).join('/');

            if (route.snapshot.data['title'] === 'Links') {
              let channelName = '';
              this.route
                .queryParams
                .subscribe(params => {
                  channelName = params['channel'];
                });

              this.breadcrumbs.push({
                label: { title: channelName },
                url: url + channelName
              });
            } else {
              this.breadcrumbs.push({
                label: route.snapshot.data,
                url: url
              });
            }

            currentRoute = route;
          }
        });
      } while (currentRoute);
    });
  }
}