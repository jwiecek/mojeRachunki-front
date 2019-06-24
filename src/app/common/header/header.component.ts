import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FilterInterface } from '../../bill/interfaces/filter.interface';
import { BillService } from '../../bill/bill.service';
import { WarrantyOptionsEnum } from '../../_enums/warranty-option.enum';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private billService: BillService
  ) {}

  public headerName = '';
  public isMobile: boolean;
  public userIsAuthenticated = false;
  private subscriptions: Subscription = new Subscription();
  public searchIsClicked = false;
  private filter: any;

  ngOnInit() {
    this.onResize();
    this.route.params.subscribe();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.subscriptions.add(
      this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      })
    );

    this.subscriptions.add(
      this.billService.currentFilter.subscribe((filter: FilterInterface) => {
        this.filter = filter;
      })
    );

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.headerName = this.route.root.firstChild.snapshot.data.title;
      }
    });
  }

  onLogout() {
    this.authService.logout();
  }

  refresh(): void {
    const filter: FilterInterface = {
      warrantyFrom: null,
      warrantyTo: null,
      selectedWarranty: WarrantyOptionsEnum.NONE,
      categoryList: [],
      selectedPriceFrom: null,
      selectedPriceTo: null,
      purchaseDateFrom: null,
      purchaseDateTo: null
    };
    this.billService.filter.next(filter);
  }

  getByFilter() {
    this.billService.filter.next(this.filter);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    const innerWidth = window.innerWidth;
    this.isMobile = innerWidth < 600;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
