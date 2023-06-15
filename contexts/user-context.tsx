import React from "react";

interface UserContext {
  permissions: {
    [key: string]: boolean;
  };
  handleSetPermissions: (k: string, v: boolean) => void;
}

export const UserContext = React.createContext<Partial<UserContext>>({});

const UserContextProvider = ({ children }) => {
  const [permissions, setPermissions] = React.useState({});

  /** **************************************** */

  // function

  const handleSetPermissions = (k, v) => {
    setPermissions((s) => ({ ...s, [k]: v }));
  };

  /** **************************************** */

  // render

  const value = React.useMemo(
    () => ({
      permissions,
      handleSetPermissions,
    }),
    [permissions]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContextProvider;
