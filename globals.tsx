import { Dimensions } from "react-native";

my = {};
my.api = {};
my.url = {};

my.url.endpoint = {
  app: "http://192.168.18.8:3000/api/v1/",
  auth: "http://192.168.18.8:3001/api/v1/",
  // app: "https://02bb-2404-8000-1004-db0a-ecaa-e803-b1a8-9d3a.ngrok-free.app/api/v1/",
  // auth: "https://c4c3-2404-8000-1004-db0a-ecaa-e803-b1a8-9d3a.ngrok-free.app/api/v1/",
};

my.url.uploads = {
  avatars: "http://192.168.18.8:3000/uploads/avatars/",
  // "https://02bb-2404-8000-1004-db0a-ecaa-e803-b1a8-9d3a.ngrok-free.app/uploads/avatars/",
  posts: "http://192.168.18.8:3000/uploads/posts/",
  // "https://02bb-2404-8000-1004-db0a-ecaa-e803-b1a8-9d3a.ngrok-free.app/uploads/posts/",
};

SCREEN_HEIGHT = Dimensions.get("screen").height;
SCREEN_WIDTH = Dimensions.get("screen").width;
WINDOW_HEIGHT = Dimensions.get("window").height;
WINDOW_WIDTH = Dimensions.get("window").width;
