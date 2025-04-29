import {AdminMenu} from '../../interfaces/core/admin-menu.interface';

export const SUPER_ADMIN_MENU: AdminMenu[] = [
  {
    id: 0,
    name: 'Dashboard',
    hasSubMenu: false,
    routerLink: 'dashboard',
    icon: 'space_dashboard',
    subMenus: [],
  },
  {
    id: 1,
    name: 'Inventory',
    hasSubMenu: true,
    routerLink: null,
    icon: 'auto_fix_off',
    subMenus: [
      {
        id: 1,
        name: 'Product List',
        hasSubMenu: true,
        routerLink: 'inventory/product-list',
        icon: 'arrow_right',
      },
      {
        id: 555,
        name: 'Single Product List',
        hasSubMenu: true,
        routerLink: 'inventory/product-list2',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Add Product',
        hasSubMenu: true,
        routerLink: 'inventory/add-product',
        icon: 'arrow_right',
      },
      // {
      //   id: 100,
      //   name: 'Barcode',
      //   hasSubMenu: true,
      //   routerLink: 'inventory/barcode',
      //   icon: 'arrow_right',
      // },
      // {
      //   id: 1,
      //   name: 'Expired Products',
      //   hasSubMenu: true,
      //   routerLink: 'inventory/expired-product-list',
      //   icon: 'arrow_right',
      // },
      {
        id: 3,
        name: 'Presale Product List',
        hasSubMenu: true,
        routerLink: 'inventory/presale-product-list',
        icon: 'arrow_right',
      },
      {
        id: 4,
        name: 'Purchase History',
        hasSubMenu: true,
        routerLink: 'inventory/purchase-history',
        icon: 'arrow_right',
      },
      {
        id: 5,
        name: 'Out Stock History',
        hasSubMenu: true,
        routerLink: 'inventory/transfer-history',
        icon: 'arrow_right',
      },
      {
        id: 6,
        name: 'Category',
        hasSubMenu: true,
        routerLink: 'inventory/category-list',
        icon: 'arrow_right',
      },
      {
        id: 7,
        name: 'Sub Category',
        hasSubMenu: true,
        routerLink: 'inventory/sub-category-list',
        icon: 'arrow_right',
      },
      // {
      //   id: 8,
      //   name: 'Attribute',
      //   hasSubMenu: true,
      //   routerLink: 'inventory/attribute-list',
      //   icon: 'arrow_right',
      // },
      {
        id: 9,
        name: 'Color',
        hasSubMenu: true,
        routerLink: 'inventory/color-list',
        icon: 'arrow_right',
      },
      {
        id: 10,
        name: 'Storage',
        hasSubMenu: true,
        routerLink: 'inventory/size-list',
        icon: 'arrow_right',
      },
    ],
  },


  {
    id: 2,
    name: 'Sales',
    hasSubMenu: true,
    routerLink: null,
    icon: 'shopping_cart',
    subMenus: [
      {
        id: 1,
        name: 'Sales table',
        hasSubMenu: true,
        routerLink: 'sales/new-sales',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Sales Report',
        hasSubMenu: true,
        routerLink: 'sales/sales-list',
        icon: 'arrow_right',
      },
      {
        id: 3,
        name: 'Product Return',
        hasSubMenu: true,
        routerLink: 'sales/sale-return',
        icon: 'arrow_right',
      },
      {
        id: 33,
        name: 'Add Sales Return',
        hasSubMenu: true,
        routerLink: 'sales/new-sale-return',
        icon: 'arrow_right',
      },
      {
        id: 4,
        name: 'Sales Return Report',
        hasSubMenu: true,
        routerLink: 'sales/sale-return-list',
        icon: 'arrow_right',
      },
      {
        id: 5,
        name: 'Add Pre Order',
        hasSubMenu: true,
        routerLink: 'sales/pre-order',
        icon: 'arrow_right',
      },
      {
        id: 6,
        name: 'Pre Order List',
        hasSubMenu: true,
        routerLink: 'sales/pre-order-list',
        icon: 'arrow_right',
      },
      {
        id: 7,
        name: 'Point',
        hasSubMenu: true,
        routerLink: 'sales/point',
        icon: 'arrow_right',
      },
    ],
  },

  // {
  //   id: 44,
  //   name: 'Courier',
  //   hasSubMenu: true,
  //   routerLink: null,
  //   icon: 'accessible',
  //   subMenus: [
  //     {
  //       id: 1,
  //       name: 'Add Courier',
  //       hasSubMenu: true,
  //       routerLink: 'courier/add-courier',
  //       icon: 'arrow_right',
  //     },
  //     {
  //       id: 2,
  //       name: 'Courier List',
  //       hasSubMenu: true,
  //       routerLink: 'courier/all-courier',
  //       icon: 'arrow_right',
  //     }
  //   ],
  // },


  {
    id: 44,
    name: 'Buy Back',
    hasSubMenu: true,
    routerLink: null,
    icon: 'accessible',
    subMenus: [
      {
        id: 1,
        name: 'Add Buy Back',
        hasSubMenu: true,
        routerLink: 'buy-back/add-buy-back',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Buy Back List',
        hasSubMenu: true,
        routerLink: 'buy-back/all-buy-back',
        icon: 'arrow_right',
      }
    ],
  },

  {
    id: 6988,
    name: 'Reports',
    hasSubMenu: true,
    routerLink: null,
    icon: 'format_list_bulleted',
    subMenus: [
      {
        id: 2,
        name: 'Sale Record',
        hasSubMenu: true,
        routerLink: 'reports/sale-record',
        icon: 'arrow_right',
      },
      {
        id: 1,
        name: 'Top Sale Products',
        hasSubMenu: true,
        routerLink: 'reports/sale-statement',
        icon: 'arrow_right',
      },

    ],
  },


  {
    id: 3,
    name: 'Supplier',
    hasSubMenu: true,
    routerLink: null,
    icon: 'receipt_long',
    subMenus: [
      {
        id: 1,
        name: 'Supplier List',
        hasSubMenu: true,
        routerLink: 'purchase/vendor-list',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Supplier Transaction',
        hasSubMenu: true,
        routerLink: 'purchase/vendor-transition-list',
        icon: 'arrow_right',
      }
    ],
  },


  {
    id: 4,
    name: 'Payout',
    hasSubMenu: true,
    routerLink: null,
    icon: 'accessible',
    subMenus: [
      {
        id: 1,
        name: 'Add Payout',
        hasSubMenu: true,
        routerLink: 'expense/add-expense',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Payout List',
        hasSubMenu: true,
        routerLink: 'expense/expense-list',
        icon: 'arrow_right',
      }
    ],
  },


  {
    id: 555,
    name: 'Repair Invoice',
    hasSubMenu: true,
    routerLink: null,
    icon: 'accessible',
    subMenus: [
      {
        id: 1,
        name: 'Add Repair Invoice',
        hasSubMenu: true,
        routerLink: 'repair/add-repair',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Repair Invoice List',
        hasSubMenu: true,
        routerLink: 'repair/repair-list',
        icon: 'arrow_right',
      },
      {
        id: 3,
        name: 'Brand list',
        hasSubMenu: true,
        routerLink: 'repair/brand-list',
        icon: 'arrow_right',
      },
      {
        id: 4,
        name: 'Problem list',
        hasSubMenu: true,
        routerLink: 'repair/problem-list',
        icon: 'arrow_right',
      },
      {
        id: 5,
        name: 'Model list',
        hasSubMenu: true,
        routerLink: 'repair/model-list',
        icon: 'arrow_right',
      }
    ],
  },


  {
    id: 5,
    name: 'Income',
    hasSubMenu: true,
    routerLink: null,
    icon: 'post_add',
    subMenus: [
      {
        id: 1,
        name: 'Add Income',
        hasSubMenu: true,
        routerLink: 'income/add-income',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Income List',
        hasSubMenu: true,
        routerLink: 'income/income-list',
        icon: 'arrow_right',
      }
    ],
  },

  {
    id: 55,
    name: 'Notes',
    hasSubMenu: true,
    routerLink: null,
    icon: 'post_add',
    subMenus: [
      {
        id: 1,
        name: 'Add Note',
        hasSubMenu: true,
        routerLink: 'notes/add-note',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Notes List',
        hasSubMenu: true,
        routerLink: 'notes/notes-list',
        icon: 'arrow_right',
      }
    ],
  },
  {
    id: 6,
    name: 'Statement',
    hasSubMenu: true,
    routerLink: null,
    icon: 'format_list_bulleted',
    subMenus: [
      {
        id: 1,
        name: 'Sale Statement',
        hasSubMenu: true,
        routerLink: 'statement/sale-statement',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Account Statement',
        hasSubMenu: true,
        routerLink: 'statement/account-statement',
        icon: 'arrow_right',
      }
    ],
  },




  {
    id: 7,
    name: 'Customer',
    hasSubMenu: true,
    routerLink: null,
    icon: 'group',
    subMenus: [
      {
        id: 1,
        name: 'Customer Add',
        hasSubMenu: true,
        routerLink: 'customer/add-customer',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Customer List',
        hasSubMenu: true,
        routerLink: 'customer/customer-list',
        icon: 'arrow_right',
      }
    ],
  },


  {
    id: 8,
    name: 'User',
    hasSubMenu: true,
    routerLink: null,
    icon: 'person',
    subMenus: [
      {
        id: 1,
        name: 'User Controls',
        hasSubMenu: true,
        routerLink: 'admin-control/all-admins',
        icon: 'arrow_right',
      },

    ],
  },

  // {
  //   id: 9,
  //   name: 'Gallery',
  //   hasSubMenu: true,
  //   routerLink: null,
  //   icon: 'collections',
  //   subMenus: [
  //     {
  //       id: 1,
  //       name: 'Folders ',
  //       hasSubMenu: true,
  //       routerLink: 'gallery/all-folders',
  //       icon: 'arrow_right',
  //     },
  //     {
  //       id: 2,
  //       name: 'Images ',
  //       hasSubMenu: true,
  //       routerLink: 'gallery/all-images',
  //       icon: 'arrow_right',
  //     },
  //
  //   ],
  // },
  {
    id: 5555,
    name: 'Trash',
    hasSubMenu: true,
    routerLink: null,
    icon: 'accessible',
    subMenus: [
      {
        id: 1,
        name: 'Product Trash',
        hasSubMenu: true,
        routerLink: 'trash/product-trash',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Purchase Trash',
        hasSubMenu: true,
        routerLink: 'trash/purchase-trash',
        icon: 'arrow_right',
      },
      {
        id: 3,
        name: 'Oust Stock Trash',
        hasSubMenu: true,
        routerLink: 'trash/out-stock-trash',
        icon: 'arrow_right',
      },
      {
        id: 4,
        name: 'Sales Trash',
        hasSubMenu: true,
        routerLink: 'trash/sales-trash',
        icon: 'arrow_right',
      }
    ],
  },
  {
    id: 10,
    name: 'Customization',
    hasSubMenu: true,
    routerLink: null,
    icon: 'receipt_long',
    subMenus: [
      {
        id: 1,
        name: 'Settings',
        hasSubMenu: true,
        routerLink: 'customization/shop-information',
        icon: 'arrow_right',
      },
    ],
  },

  {
    id: 1440,
    name: 'Branch',
    hasSubMenu: true,
    routerLink: null,
    icon: 'receipt_long',
    subMenus: [
      {
        id: 2,
        name: 'Add Branch',
        hasSubMenu: true,
        routerLink: 'branch-list/add-branch',
        icon: 'arrow_right',
      },
      {
        id: 3,
        name: 'All Branch List',
        hasSubMenu: true,
        routerLink: 'branch-list/all-branch-list',
        icon: 'arrow_right',
      },

    ],
  },

  {
    id: 144,
    name: 'Old Branch',
    hasSubMenu: true,
    routerLink: null,
    icon: 'receipt_long',
    subMenus: [

      {
        id: 1,
        name: 'All Branch',
        hasSubMenu: true,
        routerLink: 'branch-list',
        icon: 'arrow_right',
      },
    ],
  },


]

export const SALESMAN_MENU: AdminMenu[] =  [
  {
    id: 0,
    name: 'Dashboard',
    hasSubMenu: false,
    routerLink: 'dashboard',
    icon: 'space_dashboard',
    subMenus: [],
  },
  {
    id: 1,
    name: 'Inventory',
    hasSubMenu: true,
    routerLink: null,
    icon: 'auto_fix_off',
    subMenus: [
      {
        id: 1,
        name: 'Product List',
        hasSubMenu: true,
        routerLink: 'inventory/product-list',
        icon: 'arrow_right',
      },
      {
        id: 555,
        name: 'Single Product List',
        hasSubMenu: true,
        routerLink: 'inventory/product-list2',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Add Product',
        hasSubMenu: true,
        routerLink: 'inventory/add-product',
        icon: 'arrow_right',
      },
      // {
      //   id: 100,
      //   name: 'Barcode',
      //   hasSubMenu: true,
      //   routerLink: 'inventory/barcode',
      //   icon: 'arrow_right',
      // },
      // {
      //   id: 1,
      //   name: 'Expired Products',
      //   hasSubMenu: true,
      //   routerLink: 'inventory/expired-product-list',
      //   icon: 'arrow_right',
      // },
      {
        id: 3,
        name: 'Presale Product List',
        hasSubMenu: true,
        routerLink: 'inventory/presale-product-list',
        icon: 'arrow_right',
      },
      {
        id: 4,
        name: 'Purchase History',
        hasSubMenu: true,
        routerLink: 'inventory/purchase-history',
        icon: 'arrow_right',
      },
      {
        id: 5,
        name: 'Out Stock History',
        hasSubMenu: true,
        routerLink: 'inventory/transfer-history',
        icon: 'arrow_right',
      },
      {
        id: 6,
        name: 'Category',
        hasSubMenu: true,
        routerLink: 'inventory/category-list',
        icon: 'arrow_right',
      },
      {
        id: 7,
        name: 'Sub Category',
        hasSubMenu: true,
        routerLink: 'inventory/sub-category-list',
        icon: 'arrow_right',
      },
      // {
      //   id: 8,
      //   name: 'Attribute',
      //   hasSubMenu: true,
      //   routerLink: 'inventory/attribute-list',
      //   icon: 'arrow_right',
      // },
      {
        id: 9,
        name: 'Color',
        hasSubMenu: true,
        routerLink: 'inventory/color-list',
        icon: 'arrow_right',
      },
      {
        id: 10,
        name: 'Storage',
        hasSubMenu: true,
        routerLink: 'inventory/size-list',
        icon: 'arrow_right',
      },
    ],
  },


  {
    id: 2,
    name: 'Sales',
    hasSubMenu: true,
    routerLink: null,
    icon: 'shopping_cart',
    subMenus: [
      {
        id: 1,
        name: 'Sales table',
        hasSubMenu: true,
        routerLink: 'sales/new-sales',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Sales Report',
        hasSubMenu: true,
        routerLink: 'sales/sales-list',
        icon: 'arrow_right',
      },
      {
        id: 3,
        name: 'Product Return',
        hasSubMenu: true,
        routerLink: 'sales/sale-return',
        icon: 'arrow_right',
      },
      {
        id: 33,
        name: 'Add Sales Return',
        hasSubMenu: true,
        routerLink: 'sales/new-sale-return',
        icon: 'arrow_right',
      },
      {
        id: 4,
        name: 'Sales Return Report',
        hasSubMenu: true,
        routerLink: 'sales/sale-return-list',
        icon: 'arrow_right',
      },
      {
        id: 5,
        name: 'Add Pre Order',
        hasSubMenu: true,
        routerLink: 'sales/pre-order',
        icon: 'arrow_right',
      },
      {
        id: 6,
        name: 'Pre Order List',
        hasSubMenu: true,
        routerLink: 'sales/pre-order-list',
        icon: 'arrow_right',
      },
      {
        id: 7,
        name: 'Point',
        hasSubMenu: true,
        routerLink: 'sales/point',
        icon: 'arrow_right',
      },
    ],
  },

  // {
  //   id: 44,
  //   name: 'Courier',
  //   hasSubMenu: true,
  //   routerLink: null,
  //   icon: 'accessible',
  //   subMenus: [
  //     {
  //       id: 1,
  //       name: 'Add Courier',
  //       hasSubMenu: true,
  //       routerLink: 'courier/add-courier',
  //       icon: 'arrow_right',
  //     },
  //     {
  //       id: 2,
  //       name: 'Courier List',
  //       hasSubMenu: true,
  //       routerLink: 'courier/all-courier',
  //       icon: 'arrow_right',
  //     }
  //   ],
  // },


  {
    id: 44,
    name: 'Buy Back',
    hasSubMenu: true,
    routerLink: null,
    icon: 'accessible',
    subMenus: [
      {
        id: 1,
        name: 'Add Buy Back',
        hasSubMenu: true,
        routerLink: 'buy-back/add-buy-back',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Buy Back List',
        hasSubMenu: true,
        routerLink: 'buy-back/all-buy-back',
        icon: 'arrow_right',
      }
    ],
  },

  {
    id: 6988,
    name: 'Reports',
    hasSubMenu: true,
    routerLink: null,
    icon: 'format_list_bulleted',
    subMenus: [
      {
        id: 2,
        name: 'Sale Record',
        hasSubMenu: true,
        routerLink: 'reports/sale-record',
        icon: 'arrow_right',
      },
      {
        id: 1,
        name: 'Top Sale Products',
        hasSubMenu: true,
        routerLink: 'reports/sale-statement',
        icon: 'arrow_right',
      },

    ],
  },


  {
    id: 3,
    name: 'Supplier',
    hasSubMenu: true,
    routerLink: null,
    icon: 'receipt_long',
    subMenus: [
      {
        id: 1,
        name: 'Supplier List',
        hasSubMenu: true,
        routerLink: 'purchase/vendor-list',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Supplier Transaction',
        hasSubMenu: true,
        routerLink: 'purchase/vendor-transition-list',
        icon: 'arrow_right',
      }
    ],
  },


  {
    id: 4,
    name: 'Payout',
    hasSubMenu: true,
    routerLink: null,
    icon: 'accessible',
    subMenus: [
      {
        id: 1,
        name: 'Add Payout',
        hasSubMenu: true,
        routerLink: 'expense/add-expense',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Payout List',
        hasSubMenu: true,
        routerLink: 'expense/expense-list',
        icon: 'arrow_right',
      }
    ],
  },


  {
    id: 555,
    name: 'Repair Invoice',
    hasSubMenu: true,
    routerLink: null,
    icon: 'accessible',
    subMenus: [
      {
        id: 1,
        name: 'Add Repair Invoice',
        hasSubMenu: true,
        routerLink: 'repair/add-repair',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Repair Invoice List',
        hasSubMenu: true,
        routerLink: 'repair/repair-list',
        icon: 'arrow_right',
      },

      {
        id: 3,
        name: 'Brand list',
        hasSubMenu: true,
        routerLink: 'repair/brand-list',
        icon: 'arrow_right',
      },
      {
        id: 4,
        name: 'Problem list',
        hasSubMenu: true,
        routerLink: 'repair/problem-list',
        icon: 'arrow_right',
      },
      {
        id: 5,
        name: 'Model list',
        hasSubMenu: true,
        routerLink: 'repair/model-list',
        icon: 'arrow_right',
      }
    ],
  },


  {
    id: 5,
    name: 'Income',
    hasSubMenu: true,
    routerLink: null,
    icon: 'post_add',
    subMenus: [
      {
        id: 1,
        name: 'Add Income',
        hasSubMenu: true,
        routerLink: 'income/add-income',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Income List',
        hasSubMenu: true,
        routerLink: 'income/income-list',
        icon: 'arrow_right',
      }
    ],
  },

  {
    id: 55,
    name: 'Notes',
    hasSubMenu: true,
    routerLink: null,
    icon: 'post_add',
    subMenus: [
      {
        id: 1,
        name: 'Add Note',
        hasSubMenu: true,
        routerLink: 'notes/add-note',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Notes List',
        hasSubMenu: true,
        routerLink: 'notes/notes-list',
        icon: 'arrow_right',
      }
    ],
  },
  {
    id: 6,
    name: 'Statement',
    hasSubMenu: true,
    routerLink: null,
    icon: 'format_list_bulleted',
    subMenus: [
      {
        id: 1,
        name: 'Sale Statement',
        hasSubMenu: true,
        routerLink: 'statement/sale-statement',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Account Statement',
        hasSubMenu: true,
        routerLink: 'statement/account-statement',
        icon: 'arrow_right',
      }
    ],
  },

  {
    id: 7,
    name: 'Customer',
    hasSubMenu: true,
    routerLink: null,
    icon: 'group',
    subMenus: [
      {
        id: 1,
        name: 'Customer Add',
        hasSubMenu: true,
        routerLink: 'customer/add-customer',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Customer List',
        hasSubMenu: true,
        routerLink: 'customer/customer-list',
        icon: 'arrow_right',
      }
    ],
  },

  //
  // {
  //   id: 8,
  //   name: 'User',
  //   hasSubMenu: true,
  //   routerLink: null,
  //   icon: 'person',
  //   subMenus: [
  //     {
  //       id: 1,
  //       name: 'Admin Controls',
  //       hasSubMenu: true,
  //       routerLink: 'admin-control/all-admins',
  //       icon: 'arrow_right',
  //     },
  //
  //   ],
  // },

  // {
  //   id: 9,
  //   name: 'Gallery',
  //   hasSubMenu: true,
  //   routerLink: null,
  //   icon: 'collections',
  //   subMenus: [
  //     {
  //       id: 1,
  //       name: 'Folders ',
  //       hasSubMenu: true,
  //       routerLink: 'gallery/all-folders',
  //       icon: 'arrow_right',
  //     },
  //     {
  //       id: 2,
  //       name: 'Images ',
  //       hasSubMenu: true,
  //       routerLink: 'gallery/all-images',
  //       icon: 'arrow_right',
  //     },
  //
  //   ],
  // },

  // {
  //   id: 10,
  //   name: 'Customization',
  //   hasSubMenu: true,
  //   routerLink: null,
  //   icon: 'receipt_long',
  //   subMenus: [
  //     {
  //       id: 1,
  //       name: 'Settings',
  //       hasSubMenu: true,
  //       routerLink: 'customization/shop-information',
  //       icon: 'arrow_right',
  //     },
  //   ],
  // },


]

export const EDITOR_MENU: AdminMenu[] = [
  {
    id: 0,
    name: 'Dashboard',
    hasSubMenu: false,
    routerLink: 'dashboard',
    icon: 'space_dashboard',
    subMenus: [],
  },
  {
    id: 1,
    name: 'Inventory',
    hasSubMenu: true,
    routerLink: null,
    icon: 'auto_fix_off',
    subMenus: [
      {
        id: 1,
        name: 'Product List',
        hasSubMenu: true,
        routerLink: 'inventory/product-list',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Add Product',
        hasSubMenu: true,
        routerLink: 'inventory/add-product',
        icon: 'arrow_right',
      },
      // {
      //   id: 100,
      //   name: 'Barcode',
      //   hasSubMenu: true,
      //   routerLink: 'inventory/barcode',
      //   icon: 'arrow_right',
      // },
      // {
      //   id: 1,
      //   name: 'Expired Products',
      //   hasSubMenu: true,
      //   routerLink: 'inventory/expired-product-list',
      //   icon: 'arrow_right',
      // },
      {
        id: 3,
        name: 'Presale Product List',
        hasSubMenu: true,
        routerLink: 'inventory/presale-product-list',
        icon: 'arrow_right',
      },
      {
        id: 4,
        name: 'Purchase History',
        hasSubMenu: true,
        routerLink: 'inventory/purchase-history',
        icon: 'arrow_right',
      },
      {
        id: 5,
        name: 'Out Stock History',
        hasSubMenu: true,
        routerLink: 'inventory/transfer-history',
        icon: 'arrow_right',
      },
      {
        id: 6,
        name: 'Category',
        hasSubMenu: true,
        routerLink: 'inventory/category-list',
        icon: 'arrow_right',
      },
      {
        id: 7,
        name: 'Sub Category',
        hasSubMenu: true,
        routerLink: 'inventory/sub-category-list',
        icon: 'arrow_right',
      },
      // {
      //   id: 8,
      //   name: 'Attribute',
      //   hasSubMenu: true,
      //   routerLink: 'inventory/attribute-list',
      //   icon: 'arrow_right',
      // },
      {
        id: 9,
        name: 'Color',
        hasSubMenu: true,
        routerLink: 'inventory/color-list',
        icon: 'arrow_right',
      },
      {
        id: 10,
        name: 'Storage',
        hasSubMenu: true,
        routerLink: 'inventory/size-list',
        icon: 'arrow_right',
      },
    ],
  },


  {
    id: 2,
    name: 'Sales',
    hasSubMenu: true,
    routerLink: null,
    icon: 'shopping_cart',
    subMenus: [
      {
        id: 1,
        name: 'Sales table',
        hasSubMenu: true,
        routerLink: 'sales/new-sales',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Sales Report',
        hasSubMenu: true,
        routerLink: 'sales/sales-list',
        icon: 'arrow_right',
      },
      {
        id: 3,
        name: 'Product Return',
        hasSubMenu: true,
        routerLink: 'sales/sale-return',
        icon: 'arrow_right',
      },
      {
        id: 33,
        name: 'Add Sales Return',
        hasSubMenu: true,
        routerLink: 'sales/new-sale-return',
        icon: 'arrow_right',
      },
      {
        id: 4,
        name: 'Sales Return Report',
        hasSubMenu: true,
        routerLink: 'sales/sale-return-list',
        icon: 'arrow_right',
      },
      {
        id: 5,
        name: 'Add Pre Order',
        hasSubMenu: true,
        routerLink: 'sales/pre-order',
        icon: 'arrow_right',
      },
      {
        id: 6,
        name: 'Pre Order List',
        hasSubMenu: true,
        routerLink: 'sales/pre-order-list',
        icon: 'arrow_right',
      },
      {
        id: 7,
        name: 'Point',
        hasSubMenu: true,
        routerLink: 'sales/point',
        icon: 'arrow_right',
      },
    ],
  },

  // {
  //   id: 44,
  //   name: 'Courier',
  //   hasSubMenu: true,
  //   routerLink: null,
  //   icon: 'accessible',
  //   subMenus: [
  //     {
  //       id: 1,
  //       name: 'Add Courier',
  //       hasSubMenu: true,
  //       routerLink: 'courier/add-courier',
  //       icon: 'arrow_right',
  //     },
  //     {
  //       id: 2,
  //       name: 'Courier List',
  //       hasSubMenu: true,
  //       routerLink: 'courier/all-courier',
  //       icon: 'arrow_right',
  //     }
  //   ],
  // },


  {
    id: 44,
    name: 'Buy Back',
    hasSubMenu: true,
    routerLink: null,
    icon: 'accessible',
    subMenus: [
      {
        id: 1,
        name: 'Add Buy Back',
        hasSubMenu: true,
        routerLink: 'buy-back/add-buy-back',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Buy Back List',
        hasSubMenu: true,
        routerLink: 'buy-back/all-buy-back',
        icon: 'arrow_right',
      }
    ],
  },

  {
    id: 6988,
    name: 'Reports',
    hasSubMenu: true,
    routerLink: null,
    icon: 'format_list_bulleted',
    subMenus: [
      {
        id: 2,
        name: 'Sale Record',
        hasSubMenu: true,
        routerLink: 'reports/sale-record',
        icon: 'arrow_right',
      },
      {
        id: 1,
        name: 'Top Sale Products',
        hasSubMenu: true,
        routerLink: 'reports/sale-statement',
        icon: 'arrow_right',
      },

    ],
  },


  {
    id: 3,
    name: 'Supplier',
    hasSubMenu: true,
    routerLink: null,
    icon: 'receipt_long',
    subMenus: [
      {
        id: 1,
        name: 'Supplier List',
        hasSubMenu: true,
        routerLink: 'purchase/vendor-list',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Supplier Transaction',
        hasSubMenu: true,
        routerLink: 'purchase/vendor-transition-list',
        icon: 'arrow_right',
      }
    ],
  },


  {
    id: 4,
    name: 'Payout',
    hasSubMenu: true,
    routerLink: null,
    icon: 'accessible',
    subMenus: [
      {
        id: 1,
        name: 'Add Payout',
        hasSubMenu: true,
        routerLink: 'expense/add-expense',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Payout List',
        hasSubMenu: true,
        routerLink: 'expense/expense-list',
        icon: 'arrow_right',
      }
    ],
  },


  {
    id: 555,
    name: 'Repair Invoice',
    hasSubMenu: true,
    routerLink: null,
    icon: 'accessible',
    subMenus: [
      {
        id: 1,
        name: 'Add Repair Invoice',
        hasSubMenu: true,
        routerLink: 'repair/add-repair',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Repair Invoice List',
        hasSubMenu: true,
        routerLink: 'repair/repair-list',
        icon: 'arrow_right',
      },

      {
        id: 3,
        name: 'Brand list',
        hasSubMenu: true,
        routerLink: 'repair/brand-list',
        icon: 'arrow_right',
      },
      {
        id: 4,
        name: 'Problem list',
        hasSubMenu: true,
        routerLink: 'repair/problem-list',
        icon: 'arrow_right',
      },
      {
        id: 5,
        name: 'Model list',
        hasSubMenu: true,
        routerLink: 'repair/model-list',
        icon: 'arrow_right',
      }
    ],
  },


  {
    id: 5,
    name: 'Income',
    hasSubMenu: true,
    routerLink: null,
    icon: 'post_add',
    subMenus: [
      {
        id: 1,
        name: 'Add Income',
        hasSubMenu: true,
        routerLink: 'income/add-income',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Income List',
        hasSubMenu: true,
        routerLink: 'income/income-list',
        icon: 'arrow_right',
      }
    ],
  },

  {
    id: 55,
    name: 'Notes',
    hasSubMenu: true,
    routerLink: null,
    icon: 'post_add',
    subMenus: [
      {
        id: 1,
        name: 'Add Note',
        hasSubMenu: true,
        routerLink: 'notes/add-note',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Notes List',
        hasSubMenu: true,
        routerLink: 'notes/notes-list',
        icon: 'arrow_right',
      }
    ],
  },
  {
    id: 6,
    name: 'Statement',
    hasSubMenu: true,
    routerLink: null,
    icon: 'format_list_bulleted',
    subMenus: [
      {
        id: 1,
        name: 'Sale Statement',
        hasSubMenu: true,
        routerLink: 'statement/sale-statement',
        icon: 'arrow_right',
      },
      {
        id: 2,
        name: 'Account Statement',
        hasSubMenu: true,
        routerLink: 'statement/account-statement',
        icon: 'arrow_right',
      }
    ],
  },



]
