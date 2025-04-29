import {Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild} from '@angular/core';
import {AdminService} from '../services/admin/admin.service';
import {EDITOR_MENU, SALESMAN_MENU, SUPER_ADMIN_MENU} from '../core/utils/menu-data';
import {AdminRolesEnum} from '../enum/admin.roles.enum';
import {ShopInformationService} from "../services/common/shop-information.service";
import {Subscription} from "rxjs";
import {Meta, Title} from '@angular/platform-browser';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {
  // Store Data
  allMenus = [];

  sideNav = true;
  sideRes = false;
  subId = 0;
  windowWidth: any;
  shopInformation: any;

  @ViewChild('dashboard') dashboard: ElementRef;
  private subShopInfo: Subscription;

  constructor(
    private adminService: AdminService,
    private shopInformationService: ShopInformationService,
    private titleService: Title,
    private renderer: Renderer2,
    private meta: Meta,
  ) {
  }

  ngOnInit(): void {
    this.windowWidth = window.innerWidth;
    this.subId = JSON.parse(sessionStorage.getItem('sub-id'));

    const role = this.adminService.getAdminRole();
    switch (role) {
      case AdminRolesEnum.SUPER_ADMIN: {
        this.allMenus = SUPER_ADMIN_MENU;
        break;
      }
      case AdminRolesEnum.ADMIN: {
        this.allMenus = SALESMAN_MENU;
        break;
      }
      case AdminRolesEnum.SALESMAN: {
        this.allMenus = SALESMAN_MENU;
        break;
      }
      case AdminRolesEnum.EDITOR: {
        this.allMenus = EDITOR_MENU;
        break;
      }
      default: {
        this.allMenus = [];
        break;
      }
    }

    if (window.location.hostname !== 'pos.mosimosi.sg' && window.location.hostname !== 'localhost') {
      this.allMenus = this.allMenus.filter(f => f.id !== 144);
    }

    this.getShopInformation();

  }

  /**
   * ALL SIDE BAR CONTROLL METHOD
   * sideNavToggle()
   * sideMenuHide()
   */
  sideNavToggle() {
    this.sideNav = !this.sideNav;
    if(this.sideNav) {
      this.sideRes = false;
    } else {
      this.sideRes = true;
    }
  }
  subMenuToggle(num: any) {
    this.windowWidth = window.innerWidth;
    sessionStorage.setItem('sub-id', num);
    if (this.subId && this.subId === num) {
      this.subId = 0;
      this.dashboard.nativeElement.classList.add('link-active');
    } else {
      this.subId = JSON.parse(sessionStorage.getItem('sub-id'));
      this.dashboard.nativeElement.classList.remove('link-active');
    }
    if (num === 0) {
      this.dashboard.nativeElement.classList.add('link-active');
    }
  }

  private getShopInformation() {
    this.subShopInfo = this.shopInformationService.getShopInformation()
      .subscribe({
        next: res => {
          this.shopInformation = res.data;
          this.shopInformation = res.data;
          let metaTitle = this.shopInformation?.siteName;
          this.titleService.setTitle(metaTitle);
          let faviconPath = this.shopInformation?.metaLogo;
          this.updateFavicon(faviconPath);
        },
        error: err => {
          console.log(err);
        }
      })
  }

  updateFavicon(faviconPath: string): void {
    const link: HTMLLinkElement = this.renderer.createElement('link');
    link.rel = 'icon';
    link.href = faviconPath;

    const existingFavicon = document.querySelector("link[rel*='icon']");
    if (existingFavicon) {
      this.renderer.removeChild(document.head, existingFavicon);
    }
    this.renderer.appendChild(document.head, link);
  }

  @HostListener('window:resize')
  onInnerWidthChange() {
    this.windowWidth = window.innerWidth;
  }

  onLogout() {
    this.adminService.adminLogOut();
  }

}
