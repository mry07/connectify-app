import { Dimensions } from "react-native";

my = {};
my.api = {};
my.url = {};

my.url.endpoint = {
  app: "http://192.168.18.8:3000/api/v1/",
  auth: "http://192.168.18.8:3001/api/v1/",
};

my.url.uploads = {
  posts: "http://192.168.18.8:3000/uploads/posts/",
};

SCREEN_HEIGHT = Dimensions.get("screen").height;
SCREEN_WIDTH = Dimensions.get("screen").width;
WINDOW_HEIGHT = Dimensions.get("window").height;
WINDOW_WIDTH = Dimensions.get("window").width;
