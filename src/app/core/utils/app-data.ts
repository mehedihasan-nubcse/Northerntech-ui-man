
import {Select} from '../../interfaces/core/select';
import {AdminRolesEnum} from '../../enum/admin.roles.enum';
import {AdminPermissions} from "../../enum/admin-permission.enum";
import {FileTypes} from '../../enum/file-types.enum';
import {OrderStatus} from '../../enum/order.enum';

export const ADMIN_ROLES: Select[] = [
  {value: AdminRolesEnum.SUPER_ADMIN, viewValue: 'Admin'},
  // {value: AdminRolesEnum.ADMIN, viewValue: 'Admin'},
  {value: AdminRolesEnum.EDITOR, viewValue: 'Editor'},
  {value: AdminRolesEnum.SALESMAN, viewValue: 'Sales Man'}
];

export const ADMIN_PERMISSIONS: Select[] = [
  {value: AdminPermissions.CREATE, viewValue: 'Create'},
  // {value: AdminPermissions.GET, viewValue: 'Get'},
  {value: AdminPermissions.EDIT, viewValue: 'Edit'},
  {value: AdminPermissions.DELETE, viewValue: 'Delete'},
];

export const GENDERS: Select[] = [
  {value: 'male', viewValue: 'Male'},
  {value: 'female', viewValue: 'Female'},
  {value: 'other', viewValue: 'Other'}
];
export const DATA_BOOLEAN: Select[] = [
  {value: true, viewValue: 'Yes'},
  {value: false, viewValue: 'No'},
];

export const PROJECT_SOURCES: Select[] = [
  {value: 'Client Reference', viewValue: 'Client Reference'},
  {value: 'Facebook', viewValue: 'Facebook'},
  {value: 'Fiverr', viewValue: 'Fiverr'},
  {value: 'Linkedin', viewValue: 'Linkedin'},
  {value: 'Local Reference', viewValue: 'Local Reference'},
  {value: 'Website', viewValue: 'Website'},
];

export const FILE_TYPES: Select[] = [
  {value: FileTypes.IMAGE, viewValue: 'Image'},
  {value: FileTypes.VIDEO, viewValue: 'Video'},
  {value: FileTypes.PDF, viewValue: 'Pdf'}
];

export const REPORT_FILTER: Select[] = [
  {value: 0, viewValue: 'Today Sales'},
  {value: 1, viewValue: 'Last Day'},
  {value: 7, viewValue: 'Last 7 days'},
  {value: 15, viewValue: 'Last 15 days'},
  {value: 30, viewValue: 'Last 30 days'},
  {value: 60, viewValue: 'Last 60 days'},
  {value: 90, viewValue: 'Last 90 days'}
];

export const PRODUCT_STATUS: Select[] = [
  {value: 'draft', viewValue: 'Draft'},
  {value: 'publish', viewValue: 'Publish'},
];

export const DISCOUNT_TYPES: Select[] = [
  {
    value: 1,
    viewValue: 'Percentage'
  },
  {
    value: 2,
    viewValue: 'Fixed'
  },
];


export const STOCK_TYPES: Select[] = [
  {
    value: 'out-stock',
    viewValue: 'Out Stock'
  },
  // {
  //   value: 'in-stock',
  //   viewValue: 'In Stock/Return'
  // },
];

export const PAYMENT_TYPES1: Select[] = [
  {
    value: 'cash',
    viewValue: 'Cash'
  },
  // {
  //   value: 'nets',
  //   viewValue: 'Nets'
  // },
  {
    value: 'pay-now',
    viewValue: 'Pay Now'
  },
  // {
  //   value: 'qr-pay',
  //   viewValue: 'QR Pay'
  // },
  // {
  //   value: 'pay-lah',
  //   viewValue: 'Pay LAH'
  // },
  {
    value: 'bank-transfer',
    viewValue: 'Bank Transfer'
  },
  // {
  //   value: 'others-payment',
  //   viewValue: 'Others Payment'
  // },
  // {
  //   value: 'visa-card',
  //   viewValue: 'Visa/Master Card'
  // },
  // {
  //   value: 'atome-pay',
  //   viewValue: 'ATOME PAY'
  // },
  // {
  //   value: 'grab-pay',
  //   viewValue: 'GRAB PAY'
  // },
  // {
  //   value: 'master-card',
  //   viewValue: 'Master Card'
  // },
  // {
  //   value: 'amex-card',
  //   viewValue: 'Amex Card'
  // },
];

export const Branch_list: any[] = [
  // {
  //   name: 'mosimosi electronics pte.ltd',
  //   url: 'https://pos.mosimosi.sg',
  //   username: 'superadmin',
  //   password: 'admin123456',
  // },
  {
    name: '164 Shop mosimosi electronics pte.ltd',
    url: 'https://shoppte.mosimosi.sg',
    username: 'superadmin',
    password: 'admin123456',
  },
  {
    name: '162 Shop topfx pte.ltd ',
    url: 'https://162shop.mosimosi.sg',
    username: 'superadmin',
    password: 'admin123456',
  },
  {
    name: 'mosimosi Online store',
    url: 'https://onlineshop.mosimosi.sg',
    username: 'superadmin',
    password: 'admin123456',
  },
  {
    name: '162 Office store',
    url: 'https://162office.mosimosi.sg',
    username: 'superadmin',
    password: 'admin123456',
  },
  {
    name: '164 office store',
    url: 'https://164office.mosimosi.sg',
    username: 'superadmin',
    password: 'admin123456',
  },
  {
    name: 'Abirshop pte.ltd',
    url: 'https://abirshoppte.mosimosi.sg',
    username: 'superadmin',
    password: 'admin123456',
  },
  {
    name: 'Abirshop.sg Online',
    url: 'https://abirshopsg.mosimosi.sg',
    username: 'superadmin',
    password: 'admin123456',
  },
];

export const PAYMENT_TYPES: Select[] = [
  {
    value: 'cash',
    viewValue: 'Cash'
  },
  {
    value: 'nets',
    viewValue: 'Nets'
  },
  {
    value: 'pay-now',
    viewValue: 'Pay Now'
  },
  // {
  //   value: 'qr-pay',
  //   viewValue: 'QR Pay'
  // },
  // {
  //   value: 'pay-lah',
  //   viewValue: 'Pay LAH'
  // },
  // {
  //   value: 'bank-transfer',
  //   viewValue: 'Bank Transfer'
  // },
  // {
  //   value: 'others-payment',
  //   viewValue: 'Others Payment'
  // },
  {
    value: 'visa-card',
    viewValue: 'Visa/Master Card'
  },
  {
    value: 'atome-pay',
    viewValue: 'ATOME PAY'
  },
  {
    value: 'grab-pay',
    viewValue: 'GRAB PAY'
  },
  // {
  //   value: 'master-card',
  //   viewValue: 'Master Card'
  // },
  // {
  //   value: 'amex-card',
  //   viewValue: 'Amex Card'
  // },
];

export const CURRENCY_TYPES: Select[] = [
  {
    value: 'BDT',
    viewValue: 'BDT (৳)'
  },
  {
    value: 'SGD',
    viewValue: 'SGD (S$)'
  },
  {
    value: 'Dollar',
    viewValue: 'Dollar ($)'
  },
];


export const defaultUploadImage = '/assets/images/avatar/image-upload.jpg';
export const VARIATION_IMG_PLACEHOLDER = '/assets/images/placeholder/image-pick-placeholder.png';
export const PDF_MAKE_LOGO = 'https://ftp.natco.com/uploads/logo/natco-black-md.png';


export const MONTHS: Select[] = [
  {value: 1, viewValue: 'January'},
  {value: 2, viewValue: 'February'},
  {value: 3, viewValue: 'March'},
  {value: 4, viewValue: 'April'},
  {value: 5, viewValue: 'May'},
  {value: 6, viewValue: 'June'},
  {value: 7, viewValue: 'July'},
  {value: 8, viewValue: 'August'},
  {value: 9, viewValue: 'September'},
  {value: 10, viewValue: 'October'},
  {value: 11, viewValue: 'November'},
  {value: 12, viewValue: 'December'},
];

export const YEARS: Select[] = [
  {value: 2023, viewValue: '2023'},
];
