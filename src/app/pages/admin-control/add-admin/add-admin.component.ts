import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {NgxSpinnerService} from 'ngx-spinner';
import {Subscription} from 'rxjs';
import { ADMIN_PERMISSIONS, ADMIN_ROLES, GENDERS } from 'src/app/core/utils/app-data';
import { Admin } from 'src/app/interfaces/admin/admin';
import { Select } from 'src/app/interfaces/core/select';
import { AdminDataService } from 'src/app/services/admin/admin-data.service';
import { AdminService } from 'src/app/services/admin/admin.service';
import { UiService } from 'src/app/services/core/ui.service';
import {FilterData} from "../../../interfaces/gallery/filter-data";
import {ShopService} from "../../../services/common/shop.service";
import {Shop} from "../../../interfaces/common/shop.interface";
import {ReloadService} from "../../../services/core/reload.service";

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.scss']
})
export class AddAdminComponent implements OnInit, OnDestroy {

  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;

  // Store Data
  id?: string;
  user?: Admin;

  allShop: Shop[] = [];


  // Static Data
  roles: Select[] = ADMIN_ROLES;
  permissions: Select[] = ADMIN_PERMISSIONS;
  genders: Select[] = GENDERS;
  hasAccess: Select[] = [
    {value: true, viewValue: 'Yes'},
    {value: false, viewValue: 'No'},
  ];
  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subReload: Subscription;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private adminDataService: AdminDataService,
    private adminService: AdminService,
    private uiService: UiService,
    private spinnerService: NgxSpinnerService,
    private spinner: NgxSpinnerService,
    private shopService: ShopService,
    private reloadService: ReloadService,
  ) {
  }

  /**
   * GENERATE USER NAME
   */
  public get generateUsername(): string {
    if (this.dataForm && this.dataForm?.value?.username) {
      // const rs = this.dataForm.value.username.replace(/[^a-zA-Z ]/g, '');
      const rs = this.dataForm?.value?.username?.replace(/[^A-Za-z0-9]/g, '');
      return rs?.trim()?.toLowerCase();
    } else {
      return '';
    }
  }

  ngOnInit(): void {

    // Init Data Form
    this.initDataForm();

    this.subReload = this.reloadService.refreshData$.subscribe(() => {
      this.getAllShop();
    });

    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getAdminById();
      }
    });

    this.getAllShop();
  }



  /**
   * INIT FORM
   */
  private initDataForm() {
    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      email: [null, Validators.email],
      // username: [null, Validators.required],
      username: new FormControl(
        {value: null, disabled: false},
        [
          Validators.minLength(5)
        ]
      ),
      phoneNo: [null, Validators.required],
      gender: [null, Validators.required],
      role: [null, Validators.required],
      permissions: [null, Validators.required],
      hasAccess: [null, Validators.required],
      password: [null],
      newPassword: [null],
      shops: [null],
    });
  }

  /**
   * SET FORM DATA
   */

  private setFormValue() {
    this.dataForm.patchValue({...this.user, ...{password: null}});


    // Shops
    if (this.user.shops && this.user.shops.length) {
      this.dataForm.patchValue({
        shops: this.user.shops.map((m) => m._id),
      });

      console.log("user", this.dataForm.value)
    }
  }
  /**
   * ON SUBMIT FORM
   */
  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please filed all the required field');
      return;
    }

    const mData = {
      ...this.dataForm.value,
    }
    // Shops
    if (this.dataForm.value.shops) {

      // finalData.shops
      mData.shops = [];
      this.dataForm.value.shops.map((m) => {
        mData.shops.push({
          _id: this.allShop.find((f) => String(f._id) === m)?._id,
          name: this.allShop.find((f) => String(f._id) === m)?.name,
          email: this.allShop.find((f) => String(f._id) === m)?.email,
          phoneNo: this.allShop.find((f) => String(f._id) === m)?.phoneNo,
          address: this.allShop.find((f) => String(f._id) === m)?.address,
          role: this.dataForm.value.role
        });
      });
    }




    if (this.user) {
      this.updateAdminById(mData);
    } else {
      this.adminRegistration(mData);

    }

  }



  /**
   * HTTP REQ HANDLE
   * getAdminById
   * adminRegistration
   * updateAdminById
   */
  private getAdminById() {
    this.spinnerService.show();
    const select = 'name email username phoneNo gender role permissions hasAccess shops'
    this.subDataTwo = this.adminDataService.getAdminById(this.id, select)
      .subscribe(res => {
        this.spinnerService.hide();
        if (res.success) {
          this.user = res.data;
          this.setFormValue();
        }
      }, error => {
        this.spinnerService.hide();
        console.log(error);
      });
  }


  private getAllShop() {
    // Spinner..
    this.spinner.show();
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

          this.spinner.hide();
          if (res.success) {
            this.allShop = res.data;

          }
        },
        error: (err) => {

          this.spinner.hide();
          console.log(err);
        },
      });
  }


  private adminRegistration(data:any) {
    this.spinnerService.show();
    const finalData = {
      ...data,
      ...{username: this.generateUsername}
    };

    this.subDataOne = this.adminService.adminRegistration(finalData)
      .subscribe(res => {
        this.spinnerService.hide();
        if (res.success) {
          this.uiService.success(res.message);
          this.formElement.resetForm();
        } else {
          this.uiService.warn(res.message);
        }
      }, error => {
        this.spinnerService.hide();
        if (error.error.message.length){
          this.uiService.wrong(error.error.message[0])
        }else {
          this.uiService.wrong(error.message)
        }

        console.log(error);
      });
  }

  private updateAdminById(data:any) {
    this.spinnerService.show();

    // Delete Bad Field
    const mData = data;
    delete mData.password;


    this.subDataThree = this.adminDataService.updateAdminById(this.user._id, mData)
      .subscribe(res => {
        this.spinnerService.hide();
        if (res.success) {
          this.uiService.success(res.message);
        } else {
          this.uiService.warn(res.message);
        }
      }, error => {
        this.spinnerService.hide();
        console.log(error);
      });
  }

  /**
   * ON DESTROY
   */
  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
    if (this.subDataTwo) {
      this.subDataTwo.unsubscribe();
    }
    if (this.subDataThree) {
      this.subDataThree.unsubscribe();
    }
  }

}
