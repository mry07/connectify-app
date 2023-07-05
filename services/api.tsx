import React from "react";
import Axios from "axios";
import { Alert } from "react-native";
import { AuthContext } from "../contexts/auth-context";
import { storageClear, storageGet } from "../utils/storage";
import { InternalAxiosRequestConfig } from "axios";

const Api = ({ children }) => {
  const { getToken, setHasLogged } = React.useContext(AuthContext);

  const [showNetworkError, setShowNetworkError] = React.useState(false);

  /** **************************************** */

  // effect

  React.useEffect(() => {
    // instance
    my.api.app = Axios.create({
      baseURL: my.url.endpoint.app,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "connectify-app",
        "Cache-Control": "no-cache",
      },
    });

    // interceptor request
    const request = my.api.app.interceptors.request.use(
      requestInterceptor,
      errorRequestInterceptor
    );

    // interceptor response
    const response = my.api.app.interceptors.response.use(
      responseInterceptor,
      errorResponseInterceptor
    );

    return () => {
      my.api.app.interceptors.request.eject(request);
      my.api.app.interceptors.response.eject(response);
    };
  }, []);

  React.useEffect(() => {
    // instance
    my.api.auth = Axios.create({
      baseURL: my.url.endpoint.auth,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "connectify-app",
        "Cache-Control": "no-cache",
      },
    });

    // interceptor request
    const request = my.api.auth.interceptors.request.use(
      requestInterceptor,
      errorRequestInterceptor
    );

    // interceptor response
    const response = my.api.auth.interceptors.response.use(
      responseInterceptor,
      errorResponseInterceptor
    );

    return () => {
      my.api.auth.interceptors.request.eject(request);
      my.api.auth.interceptors.response.eject(response);
    };
  }, []);

  React.useEffect(() => {
    if (showNetworkError) {
      Alert.alert("Terjadi kesalahan", "Mohon coba beberapa saat lagi", [
        { text: "Ok", onPress: () => setShowNetworkError(false) },
      ]);
    }
  }, [showNetworkError]);

  /** **************************************** */

  // function

  const requestInterceptor = async (config: InternalAxiosRequestConfig) => {
    const token = await getToken(config.url);

    config.headers["App-Id"] = await storageGet("@uuid");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // log request
    if (__DEV__) {
      console.log("====================");
      console.log(
        "PAYLOAD\n\t" +
          config.baseURL +
          config.url +
          "\n\t" +
          JSON.stringify(config.data ?? {})
      );
      console.log("");
    }

    return config;
  };

  const errorRequestInterceptor = async (error) => {
    return Promise.reject(error);
  };

  const responseInterceptor = async (response) => {
    // log response
    if (__DEV__) {
      console.log("RESPONSE\n\t" + JSON.stringify(response.data));
      console.log("====================");
    }

    return response;
  };

  const errorResponseInterceptor = async (error) => {
    if (error.message === "Network Error") {
      setShowNetworkError(true);
      return Promise.reject(error);
    }

    const data = error.response?.data;
    const status = data?.status;

    switch (status) {
      case "api_error":
      case "dev_error":
      case "validation_error":
      case "token_error":
        // log response
        if (__DEV__) {
          console.log(`RESPONSE\n\t${JSON.stringify(data)}`);
          console.log("====================");
        }

        if (status === "dev_error" && data?.error_code === "relogin_required") {
          await storageClear(["@uuid"]);

          setHasLogged(false);
        }

        return error.response;

      default:
        return Promise.reject(error);
    }
  };

  /** **************************************** */

  // render

  return children;
};

export default Api;
