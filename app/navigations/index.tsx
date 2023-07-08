import React from "react";
import AuthStack from "./auth-stack";
import { AuthContext } from "../../contexts/auth-context";
import {
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";
import AppStack from "./app-stack";

const Navigations = () => {
  const { hasLogged } = React.useContext(AuthContext);

  return (
    <NavigationContainer>
      {!hasLogged ? <AuthStack /> : <AppStack />}
    </NavigationContainer>
  );
};

export default Navigations;
