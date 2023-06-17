import React from "react";
import { UserContext as UserContextInterface } from "../types/context/user-context.d";

export const UserContext = React.createContext<Partial<UserContextInterface>>(
  {}
);

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
