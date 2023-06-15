import React from "react";
import Axios from "axios";
import { Alert } from "react-native";
import { storageGet } from "../utils/storage";
import { AuthContext } from "../contexts/auth-context";
import { InternalAxiosRequestConfig } from "axios";

export interface ApiRequestConfig extends InternalAxiosRequestConfig {
  _port?: number;
}

const Api = ({ children }) => {
  const { getToken } = React.useContext(AuthContext);

  /** **************************************** */

  // effect

  React.useEffect(() => {
    // instance
    my.api = Axios.create({
      baseURL: my.url.endpoint,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "my-app",
        "Cache-Control": "no-cache",
      },
    });

    // interceptor request
    const request = my.api.interceptors.request.use(
      requestInterceptor,
      errorRequestInterceptor
    );

    // interceptor response
    const response = my.api.interceptors.response.use(
      responseInterceptor,
      errorResponseInterceptor
    );

    return () => {
      my.api.interceptors.request.eject(request);
      my.api.interceptors.response.eject(response);
    };
  }, []);

  /** **************************************** */

  // function

  const requestInterceptor = async (config: ApiRequestConfig) => {
    const token = await getToken(config.url);

    config.headers["App-Id"] = await storageGet("@uuid");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    if (config._port === 3021) {
      config.baseURL = `http://192.168.18.8:${config._port}/api/`;
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
      Alert.alert("Terjadi kesalahan", "Mohon coba beberapa saat lagi", [
        { text: "Ok" },
      ]);
      return;
    }

    switch (error.response?.data?.status) {
      case "api_error":
      case "dev_error":
      case "validation_error":
      case "expired_token_error":
        // log response
        if (__DEV__) {
          console.log("RESPONSE\n\t" + JSON.stringify(error.response.data));
          console.log("====================");
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
