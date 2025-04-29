import {Component, OnInit, Renderer2} from '@angular/core';
import {UserService} from './services/common/user.service';
import {Meta, Title} from '@angular/platform-browser';
import {registerLocaleData} from '@angular/common';
import localeBn from '@angular/common/locales/bn';
import { AdminService } from './services/admin/admin.service';
import {Subscription} from "rxjs";
import {ShopInformationService} from "./services/common/shop-information.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  shopInformation: any;
  private subShopInfo: Subscription;
  constructor(
    private userService: UserService,
    private titleService: Title,
    private adminService: AdminService,
    private renderer: Renderer2,
    private shopInformationService: ShopInformationService,
    private meta: Meta,
  ) {
    this.googleNoIndex();
    registerLocaleData(localeBn, 'bn');
    this.adminService.autoAdminLoggedIn();
  }

  ngOnInit() {

  }

  private getShopInformation() {
    this.subShopInfo = this.shopInformationService.getShopInformation()
      .subscribe({
        next: res => {
          this.shopInformation = res.data;
          let metaTitle = this.shopInformation?.siteName;
          this.titleService.setTitle(metaTitle);
          let faviconPath = this.shopInformation?.metaLogo;
          this.updateFavicon(faviconPath);
          // console.log('this.shopInformation',this.shopInformation)
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
  /**
   * SEO TITLE
   * SEO META TAGS
   */

  private googleNoIndex() {
    this.meta.updateTag({name: 'robots', content: 'noindex'});
    this.meta.updateTag({name: 'googlebot', content: 'noindex'});
  }
}
