import React from "react";
import AppStack from "./app-stack";
import AuthStack from "./auth-stack";
import { AuthContext } from "../../contexts/auth-context";
import { NavigationContainer } from "@react-navigation/native";

const Navigations = () => {
  const { hasLogged } = React.useContext(AuthContext);

  return (
    <NavigationContainer>
      {!hasLogged ? <AuthStack /> : <AppStack />}
    </NavigationContainer>
  );
};

export default Navigations;
