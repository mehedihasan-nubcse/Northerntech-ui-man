import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Meta} from '@angular/platform-browser';
import {NgxSpinnerService} from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { AdminService } from '../services/admin/admin.service';
import { UiService } from '../services/core/ui.service';
import {ShopInformationService} from "../services/common/shop-information.service";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-admin-auth',
  templateUrl: './admin-auth.component.html',
  styleUrls: ['./admin-auth.component.scss']
})
export class AdminAuthComponent implements OnInit {
  // Basic
  public env = environment;
  public year = new Date().getFullYear();
  shopInformation: any;
  // Reactive Form
  loginForm: FormGroup;
  username = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  private subShopInfo: Subscription;
  private subQparamOne: Subscription;
  constructor(
    private uiService: UiService,
    private adminService: AdminService,
    private meta: Meta,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private shopInformationService: ShopInformationService,
  ) {
    this.googleNoIndex();
  }

  ngOnInit(): void {

    // Main reactive form..
    this.loginForm = new FormGroup({
      username: this.username,
      password: this.password
    });

    this.subQparamOne = this.activatedRoute.queryParams.subscribe(qParam => {

      if(qParam['username'] && qParam['password']){
        this.loginForm.patchValue({
          username: qParam['username'],
          password: qParam['password']
        });
        this.onLogin();      }
    });



    this.getShopInformation();


  }

  /**
   * Login
   */
  onLogin() {
    if (this.loginForm.invalid) {
      this.uiService.wrong('Invalid Input field!');
      return;
    }
    // Spinner..
    // this.spinner.show();
    // Form Data..
    const username = this.loginForm.value.username.trim().toLowerCase();
    const password = this.loginForm.value.password;
    const data = {username, password};
    this.adminService.adminLogin(data);
    sessionStorage.setItem('sub-id','0');
  }



  /**
   * SEO TITLE
   * SEO META TAGS
   */

  private googleNoIndex() {
    this.meta.updateTag({name: 'robots', content: 'noindex'});
    this.meta.updateTag({name: 'googlebot', content: 'noindex'});
  }

  private getShopInformation() {
    this.subShopInfo = this.shopInformationService.getShopInformation()
      .subscribe({
        next: res => {
          this.shopInformation = res.data;
          // console.log('this.shopInformation',this.shopInformation)
        },
        error: err => {
          console.log(err);
        }
      })
  }

}
