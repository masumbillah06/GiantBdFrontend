/**
 * API Endpoint Registry
 *
 * All backend API URL paths are declared here.
 * Services import from this file so that if a URL changes,
 * you change it in one place only.
 *
 * Convention: paths start with "/" and do NOT include the base URL.
 * The base URL is handled by the http-client.
 */

export const API = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
  },

  inventory: {
    // Stock In
    stockIn: '/inventory/stock-in',
    stockInById: (id: number) => `/inventory/stock-in/${id}`,

    // Stock Out
    stockOut: '/inventory/stock-out',
    stockOutById: (id: number) => `/inventory/stock-out/${id}`,
    stockOutList: '/inventory/stock-out/list',

    // Batches
    batches: '/inventory/batches',
    batchById: (id: string) => `/inventory/batches/${id}`,
  },

  products: {
    master: '/products/master',
    masterById: (id: number) => `/products/master/${id}`,
    variants: '/products/variants',
    variantById: (id: number) => `/products/variants/${id}`,
  },

  crm: {
    buyers: '/crm/buyers',
    buyerById: (id: number) => `/crm/buyers/${id}`,
  },

  attributes: {
    categories: '/attributes/categories',
    subCategories: '/attributes/sub-categories',
    materials: '/attributes/materials',
    colors: '/attributes/colors',
    warehouses: '/attributes/warehouses',
    zones: '/attributes/zones',
    subZones: '/attributes/sub-zones',
    racks: '/attributes/racks',
  },

  iam: {
    users: '/iam/users',
    userById: (id: number) => `/iam/users/${id}`,
    roles: '/iam/roles',
    roleById: (id: number) => `/iam/roles/${id}`,
    permissions: '/iam/permissions',
    permissionById: (id: number) => `/iam/permissions/${id}`,
  },

  reports: {
    weekllyDelivery: '/reports/weekly-delivery',
    monthlyDelivery: '/reports/monthly-delivery',
    deliverySummary: '/reports/delivery-summary',
    stockAging: '/reports/stock-aging',
    fgMasterStock: '/reports/fg-master-stock',
    locationWiseStock: '/reports/location-wise-stock',
    batchProductList: '/reports/batch-product-list',
    fgCurrentStock: '/reports/fg-current-stock',
    stockLedger: '/reports/stock-ledger',
  },

  dashboard: {
    stats: '/dashboard/stats',
    recentStockIn: '/dashboard/recent-stock-in',
    requisitions: '/dashboard/requisitions',
  },
} as const;

