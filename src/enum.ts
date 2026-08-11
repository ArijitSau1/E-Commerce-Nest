export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  CUSTOMER = 'CUSTOMER',
}

export enum DefaultStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
}

export enum LoginType {
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
}

export enum PageType {
  DASHBOARD = 'DASHBOARD',
  MASTER = 'MASTER',
  TRANSACTION = 'TRANSACTION',
  REPORT = 'REPORT',
  SETTINGS = 'SETTINGS',
}

export enum PermissionAction {
  CREATE = 'Create',
  READ = 'Read',
  UPDATE = 'Update',
  DELETE = 'Delete',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum ProductSort {
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  NEWEST = 'newest',
}

export enum ReturnType {
  RETURN = 'return',
  EXCHANGE = 'exchange',
}

export enum ReturnStatus {
  REQUESTED = 'requested',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PICKED_UP = 'picked_up',
  RECEIVED = 'received',
  REFUNDED = 'refunded',
}

export enum RefundStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}
