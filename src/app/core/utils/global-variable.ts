import {environment} from '../../../environments/environment';

export const DATABASE_KEY = Object.freeze({
  loginToken: 'MOSIMOSI_POS_TOKEN_' + environment.VERSION,
  loggInSession: 'MOSIMOSI_POS_SESSION_' + environment.VERSION,
  loginTokenAdmin: 'MOSIMOSI_POS_ADMIN_TOKEN_' + environment.VERSION,
  loggInSessionAdmin: 'MOSIMOSI_POS_ADMIN_SESSION_' + environment.VERSION,
  encryptAdminLogin: 'MOSIMOSI_POS_USER_0_' + environment.VERSION,
  encryptUserLogin: 'MOSIMOSI_POS_USER_1_' + environment.VERSION,
  loginAdminRole: 'MOSIMOSI_POS_ADMIN_ROLE_' + environment.VERSION,
  cartsProduct: 'MOSIMOSI_POS_USER_CART_' + environment.VERSION,
  productFormData: 'MOSIMOSI_POS_PRODUCT_FORM_' + environment.VERSION,
  userCart: 'MOSIMOSI_POS_USER_CART_' + environment.VERSION,
  recommendedProduct: 'MOSIMOSI_POS_RECOMMENDED_PRODUCT_' + environment.VERSION,
  userCoupon: 'MOSIMOSI_POS_USER_COUPON_' + environment.VERSION,
  userCookieTerm: 'MOSIMOSI_POS_COOKIE_TERM' + environment.VERSION,
  encryptShop: 'MOSIMOSI_POS_SHOP_ID' + environment.VERSION,
});
