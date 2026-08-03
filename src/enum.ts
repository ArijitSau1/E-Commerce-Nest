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