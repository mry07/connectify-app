export interface Context {
  userDetails: any;
  permissions: {
    [key: string]: boolean;
  };
  loading: {
    [key: string]: boolean;
  };
  toSetPermissions: (k: string, v: boolean) => void;
  getUserDetails: () => void;
}
