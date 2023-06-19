export interface UserContext {
  permissions: {
    [key: string]: boolean;
  };
  handleSetPermissions: (k: string, v: boolean) => void;
}
