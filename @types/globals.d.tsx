import { AxiosInstance } from "axios";

interface Api {
  app?: AxiosInstance;
  auth?: AxiosInstance;
}

interface Url {
  endpoint?: {
    app: string;
    auth: string;
  };
  uploads?: {
    avatars: string;
    posts: string;
  };
}

interface My {
  api?: Api;
  url?: Url;
  loading?: (value: boolean) => void;
}

declare global {
  var my: My;
  var SCREEN_HEIGHT: number;
  var SCREEN_WIDTH: number;
  var WINDOW_HEIGHT: number;
  var WINDOW_WIDTH: number;
}
