import React from "react";
import { Context } from "../@types/context/user-context.d";

export const UserContext = React.createContext<Partial<Context>>({});

const UserContextProvider = ({ children }) => {
  const [loading, setLoading] = React.useState({});
  const [userDetails, setUserDetails] = React.useState(null);
  const [permissions, setPermissions] = React.useState({});

  /** **************************************** */

  // function

  const toSetPermissions = (k, v) => {
    setPermissions((s) => ({ ...s, [k]: v }));
  };

  const getUserDetails = async () => {
    setLoading((s) => ({ ...s, userDetails: true }));

    try {
      const { data: json } = await my.api.app.post("user/details");
      if (json.status === "ok") {
        setUserDetails(json.data);
      }
    } catch (error) {
      if (__DEV__) {
        console.error(error);
      }
    } finally {
      setLoading((s) => ({ ...s, userDetails: true }));
    }
  };

  /** **************************************** */

  // render

  const value = React.useMemo(
    () => ({
      permissions,
      userDetails,
      toSetPermissions,
      getUserDetails,
      loading,
    }),
    [permissions, userDetails]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContextProvider;
