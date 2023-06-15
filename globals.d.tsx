import { EdgeInsets } from "react-native-safe-area-context";
import { AxiosInstance } from "axios";

interface My {
  api: AxiosInstance;
  insets: EdgeInsets;
  url: Url;
  loading: (value: boolean) => void;
}

interface Url {
  endpoint: string;
  uploads: {
    posts: string;
  };
}

declare global {
  var my: Partial<My>;
  var SCREEN_HEIGHT: number;
  var SCREEN_WIDTH: number;
  var WINDOW_HEIGHT: number;
  var WINDOW_WIDTH: number;
}
