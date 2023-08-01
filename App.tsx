import "./global";
import "react-native-gesture-handler";
import Api from "./services/api";
import App from "./app/index";
import React from "react";
import Contexts from "./contexts";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { SafeAreaProvider } from "react-native-safe-area-context";

library.add(fab, fas, far);

export default () => {
  return (
    <SafeAreaProvider>
      <Contexts>
        <Api>
          <App />
        </Api>
      </Contexts>
    </SafeAreaProvider>
  );
};
