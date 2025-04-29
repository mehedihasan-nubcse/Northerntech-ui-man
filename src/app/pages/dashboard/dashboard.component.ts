import {Component, OnDestroy, OnInit} from '@angular/core';
import {SaleDashboard} from '../../interfaces/common/dashboard.interface';
import {DashboardService} from '../../services/common/dashboard.service';
import {Subscription} from 'rxjs';
import {AdminService} from 'src/app/services/admin/admin.service';
import {Sale} from '../../interfaces/common/sale.interface';
import {REPORT_FILTER} from '../../core/utils/app-data';
import {Select} from '../../interfaces/core/select';
import {FilterData} from "../../interfaces/gallery/filter-data";
import {DATABASE_KEY} from "../../core/utils/global-variable";
import {ShopService} from "../../services/common/shop.service";
import {Shop} from "../../interfaces/common/shop.interface";
import {ReloadService} from "../../services/core/reload.service";
import {StorageService} from "../../services/core/storage.service";
import {ShopInformation} from "../../interfaces/common/shop-information.interface";
import {ShopInformationService} from "../../services/common/shop-information.service";
import {UserDataService} from "../../services/common/user-data.service";
import {User} from "../../interfaces/common/user.interface";
import {Admin} from "../../interfaces/admin/admin";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  // Static data
  reportFilters: Select[] = REPORT_FILTER;
  // Shop data
  shopInformation: ShopInformation;

  USER_ROLE: any;
  saleDashboard: SaleDashboard = null;

  // Subscriptions
  private subDataOne: Subscription;

  // FilterData
  filter: any = null;
  sortQuery: any = null;
  activeFilter: number = 0;
  activeFilter1: number =null;
// Store data
  user?: Admin;
  //storing data
  sales: Sale[] = [];
  shopName?: string;
  allShop: Shop[] = [];
  private subReload: Subscription;
  private subShopInfo: Subscription;

  constructor(
    private dashboardService: DashboardService,
    private adminService: AdminService,
    private shopService: ShopService,
    private reloadService: ReloadService,
    private userDataService: UserDataService,
    private storageService: StorageService,
    private shopInformationService: ShopInformationService,
  ) {
  }

  ngOnInit(): void {
    // Reload Data
    this.subReload = this.reloadService.refreshData$.subscribe(() => {
      this.getAllShop();
    });

    this.USER_ROLE = this.adminService.getAdminRole();
    this.getSalesDashboard();
    this.getLoginUserInfo();
    this.getShopInformation();
    // GET
  }

  /**
   * HTTP REQ
   */
  private getLoginUserInfo() {
    this.adminService.getLoggedInAdminData()
      .subscribe(res => {
        this.user = res.data;
        this.getAllShop();
        // console.log('this.user',this.user)
      }, error => {
        console.log(error);
      });
  }
  /**
   * HTTP REQ HANDLE
   * getAllShop()
   * deleteShopById()
   */

  private getShopInformation() {
    this.subShopInfo = this.shopInformationService.getShopInformation()
      .subscribe({
        next: res => {
          this.shopInformation = res.data;
        },
        error: err => {
          console.log(err);
        }
      })
  }

  private getAllShop() {

    // Select
    const mSelect = {

      name: 1,
      email: 1,
      phoneNo: 1,
      address: 1,
      createdAt: 1,
    };

    const filter: FilterData = {
      filter: null,
      pagination: null,
      select: mSelect,
      sort: {createdAt: -1},
    };

    this.subDataOne = this.shopService
      .getAllShop(filter, null)
      .subscribe({
        next: (res) => {

          if (res.success) {
            // this.allShop = res.data;
            // const adminShops = this.user.shops;

            this.user.shops.forEach((adminShop) => {
              const matchedShop = res.data.find((shop) => shop._id === adminShop._id);
              if (matchedShop) {
                this.allShop.push(matchedShop); // Only push if a match is found
              }
            });

            const shop_Id= this.storageService.getDataFromEncryptLocal(
              DATABASE_KEY.encryptShop
            );

            this.shopName = this.allShop.find(f=> f._id === shop_Id.shop)?.name


          }
        },
        error: (err) => {

          console.log(err);
        },
      });
  }


  /**
   * HTTP REQ HANDLE
   * getUserDashboard()
   */
  getSalesDashboard() {
    this.subDataOne = this.dashboardService.getSalesDashboard(this.activeFilter)
      .subscribe({
        next: (res) => {
          // console.log('getSalesDashboard', res)
          this.saleDashboard = res.data;
        },
        error: (err) => {
          console.log(err)
        }
      })
  }

  /**
   * FILTER DATA
   * filterData()
   */
  filterData(day: number) {
    this.activeFilter = this.reportFilters.findIndex(f => f.value === day);
    this.getSalesDashboard();
  }


  onSelect(shop: string) {

    this.storageService.addDataToEncryptLocal(
      {shop},
      DATABASE_KEY.encryptShop
    );

    // Get Shop Id
    this.getCurrentShop()
  }

  protected getCurrentShop() {
    setTimeout(()=>{
      window.location.reload()
    },400)

    return this.storageService.getDataFromEncryptLocal(
      DATABASE_KEY.encryptShop
    );
  }

  /**
   * NG ON DESTROY
   */
  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
    if (this.subShopInfo) {
      this.subShopInfo.unsubscribe();
    }
  }


}
