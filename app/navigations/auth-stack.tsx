import React from "react";
import Colors from "../constants/colors";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

/** ********************************************************************** */

// SCREEN

import Login from "../screens/auth/LoginScreen";
import Register from "../screens/auth/RegisterScreen";

/** ********************************************************************** */

// NAVIGATOR

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ cardStyle: { backgroundColor: Colors.p60 } }}
    >
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
