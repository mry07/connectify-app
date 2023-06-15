import React from "react";
import AuthStack from "./auth-stack";
import { AuthContext } from "../../contexts/auth-context";
import {
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";
import AppTabs from "./app-tabs";
import AppStack from "./app-stack";

const Navigations = () => {
  const { hasLogged } = React.useContext(AuthContext);

  const containerRef =
    React.useRef<NavigationContainerRef<ReactNavigation.RootParamList>>();

  // React.useEffect(() => {
  //   if (hasLogged) {
  //     containerRef.current.resetRoot({ index: 0, routes: [{ name: "Home" }] });
  //   }
  // }, [hasLogged]);

  return (
    <NavigationContainer ref={containerRef}>
      {/* {!hasLogged ? <AuthStack /> : <AppTabs />} */}
      {!hasLogged ? <AuthStack /> : <AppStack />}
    </NavigationContainer>
  );
};

export default Navigations;
