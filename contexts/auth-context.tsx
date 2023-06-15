import React from "react";
import JWTDecode from "jwt-decode";
import { ApiRequestConfig } from "../services/api";
import { storageClear, storageGet, storageSet } from "../utils/storage";

interface AuthContext {
  hasLogged: boolean;
  setHasLogged: (value: boolean) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
  register: (value: any) => Promise<any>;
  getToken: (url: string) => Promise<string>;
}

interface JsonWebTokenDecode {
  exp: number;
}

export const AuthContext = React.createContext<Partial<AuthContext>>({});

const AuthContextProvider = ({ children }) => {
  const [hasLogged, setHasLogged] = React.useState(false);

  /** **************************************** */

  // function

  const login = async (email, password) => {
    my.loading(true);
    try {
      const { data: json } = await my.api.post(
        "auth/login",
        { email, password },
        { _port: 3021 } as ApiRequestConfig
      );

      if (json.status === "ok") {
        await storageSet("@token", json.data.token);
        await storageSet("@refresh_token", json.data.refresh_token);
        await storageSet("@has_logged", true);

        setHasLogged(true);
      }
    } catch (error) {
      // console.error(error);
    } finally {
      my.loading(false);
    }
  };

  const logout = async () => {
    my.loading(true);
    try {
      const { data: json } = await my.api.delete("auth/logout", {
        _port: 3021,
      } as ApiRequestConfig);

      if (json.status === "ok") {
        await storageClear(["@uuid"]);

        setHasLogged(false);
      }
    } catch (error) {
      // console.error(error);
    } finally {
      my.loading(false);
    }
  };

  const register = async (form) => {
    my.loading(true);
    try {
      const { data: json } = await my.api.post("auth/register", form, {
        _port: 3021,
      } as ApiRequestConfig);
      return json;
    } catch (error) {
      // console.error(error);
    } finally {
      my.loading(false);
    }
  };

  const getToken = async (url) => {
    const token = await storageGet("@token");
    const refreshToken = await storageGet("@refresh_token");

    if (token && url !== "auth/refresh-token") {
      const decodedToken = JWTDecode(token) as JsonWebTokenDecode;
      const currentTimeInSeconds = Date.now() / 1000;

      if (decodedToken.exp < currentTimeInSeconds) {
        const { data: json } = await my.api.post(
          "auth/refresh-token",
          { refresh_token: refreshToken },
          { _port: 3021 } as ApiRequestConfig
        );

        if (json.status === "ok") {
          const newToken = json.data.token;
          await storageSet("@token", newToken);

          return newToken;
        }
      }
    }

    return token;
  };

  /** **************************************** */

  // render

  const value = React.useMemo(
    () => ({
      hasLogged,
      setHasLogged,
      login,
      logout,
      register,
      getToken,
    }),
    [hasLogged]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
