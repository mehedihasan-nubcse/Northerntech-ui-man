


import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AdminService } from '../services/admin/admin.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthAdminInterceptor implements HttpInterceptor {

  constructor(private adminService: AdminService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.adminService.getAdminToken();
    const shopId = this.adminService.getShopId();

    // Parse and update query parameters if 'shop' doesn't exist
    let queryParams = req.params;
    if (!queryParams.has('shop')) {
      queryParams = queryParams.append('shop', shopId);
    }

    // Clone the request with updated parameters and headers
    const authRequest = req.clone({
      params: queryParams,
      setHeaders: {
        ...(authToken ? { 'administrator': authToken } : {})
      }
    });

    return next.handle(authRequest);
  }
}









// import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
// import {Injectable} from '@angular/core';
// import {AdminService} from '../services/admin/admin.service';
// import { Observable } from 'rxjs';
//
// @Injectable()
// export class AuthAdminInterceptor implements HttpInterceptor {
//
//   constructor(private adminService: AdminService) {
//   }
//
//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     const authToken = this.adminService.getAdminToken();
//     const shopId = this.adminService.getShopId();
//
//     // Parse the current query parameters
//     let queryParams = req.params;
//
//     if (!queryParams.has('shop')) {
//       queryParams = queryParams.append('shop', shopId);
//     }
//
//     // Clone the request with the updated query parameters
//     const authRequest = req.clone({
//       params: queryParams,
//       setHeaders: authToken ? { 'admin': `${authToken}` } : {}
//     });
//
//     return next.handle(authRequest);
//
//     if (authToken) {
//       const authRequest = req.clone({
//         headers: req.headers.set('administrator', authToken)
//       });
//       return next.handle(authRequest);
//     } else {
//       const authRequest = req.clone();
//       return next.handle(authRequest);
//     }
//   }
// }
