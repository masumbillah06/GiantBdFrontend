/**
 * API Endpoint Registry
 *
 * All backend API URL paths matching the NestJS backend controllers.
 * Global prefix `/api` is handled automatically by the API client.
 */

export const API = {
  auth: {
    login: '/auth/login',
    verifyOtp: '/auth/verify-otp',
    resendOtp: '/auth/resend-otp',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    changePassword: '/auth/change-password',
  },

  users: {
    list: '/users',
    me: '/users/me',
    byId: (id: string) => `/users/${id}`,
    register: '/users/register',
    avatar: (id: string) => `/users/${id}/avatar`,
    signature: (id: string) => `/users/${id}/signature`,
    restore: (id: string) => `/users/${id}/restore`,
  },

  roles: {
    list: '/roles',
    create: '/roles',
    byId: (id: string) => `/roles/${id}`,
    restore: (id: string) => `/roles/${id}/restore`,
  },

  permissions: {
    list: '/permissions',
    byId: (id: string) => `/permissions/${id}`,
    seed: '/permissions/seed',
  },

  attributes: {
    categories: '/attributes/categories',
    categoryById: (id: string) => `/attributes/categories/${id}`,
    categoryRestore: (id: string) => `/attributes/categories/${id}/restore`,
    subCategories: '/attributes/subcategories',
    subCategoryById: (id: string) => `/attributes/subcategories/${id}`,
    materials: '/attributes/materials',
    materialById: (id: string) => `/attributes/materials/${id}`,
    colors: '/attributes/colors',
    colorById: (id: string) => `/attributes/colors/${id}`,
    warehouses: '/attributes/warehouses',
    warehouseById: (id: string) => `/attributes/warehouses/${id}`,
    zones: '/attributes/zones',
    zoneById: (id: string) => `/attributes/zones/${id}`,
    subZones: '/attributes/subzones',
    subZoneById: (id: string) => `/attributes/subzones/${id}`,
    racks: '/attributes/racks',
    rackById: (id: string) => `/attributes/racks/${id}`,
    racksBulk: '/attributes/racks/bulk',
    locations: '/attributes/locations',
    locationById: (id: string) => `/attributes/locations/${id}`,
    locationByBarcode: (code: string) => `/attributes/locations/barcode/${code}`,
  },

  products: {
    master: '/master-products',
    masterById: (id: string) => `/master-products/${id}`,
    masterRestore: (id: string) => `/master-products/${id}/restore`,
    variants: '/variants',
    variantById: (id: string) => `/variants/${id}`,
    variantBulk: '/variants/bulk',
    variantPicture: (id: string) => `/variants/${id}/picture`,
    variantRestore: (id: string) => `/variants/${id}/restore`,
  },

  crm: {
    buyers: '/buyers',
    buyerById: (id: string) => `/buyers/${id}`,
    buyerRestore: (id: string) => `/buyers/${id}/restore`,
    lc: '/lc',
    lcById: (id: string) => `/lc/${id}`,
    lcRestore: (id: string) => `/lc/${id}/restore`,
    po: '/po',
    poById: (id: string) => `/po/${id}`,
    poItems: (id: string) => `/po/${id}/items`,
    poRestore: (id: string) => `/po/${id}/restore`,
  },

  inventory: {
    stock: '/inventory/stock',
    stockIn: '/inventory/stock-in',
    stockInPreview: '/inventory/stock-in/preview',
    stockOut: '/inventory/stock-out',
    stockOutById: (id: string) => `/inventory/stock-out/${id}`,
    stockOutPreviewPo: (poId: string) => `/inventory/stock-out/preview-po/${poId}`,
    stockOutStatus: (id: string) => `/inventory/stock-out/${id}/status`,
    stockOutCancel: (id: string) => `/inventory/stock-out/${id}/cancel`,
    batches: '/inventory/batches',
    batchById: (id: string) => `/inventory/batches/${id}`,
    batchItemById: (id: string) => `/inventory/batch-items/${id}`,
    movements: '/inventory/movements',
  },

  dashboard: {
    metrics: '/dashboard/metrics',
  },
} as const;

export default API;
