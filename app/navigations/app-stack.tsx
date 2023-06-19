import React from "react";
import Colors from "../constants/colors";
import BottomTabs from "../components/ui/BottomTabs";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  TransitionPresets,
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";

/** ********************************************************************** */

// SCREEN

import TestScreen from "../screens/__TestScreen__";
import BlankScreen from "../screens/__BlankScreen__";

import HomeScreen from "../screens/app/bottom-tab/HomeScreen";
import NewPostScreen from "../screens/app/NewPostScreen";

import ProfileScreen from "../screens/app/bottom-tab/ProfileScreen";

/** ********************************************************************** */

// NAVIGATOR

const AStack = createStackNavigator();
const AStackScreen = () => {
  return (
    <AStack.Navigator
      initialRouteName="AA"
      screenOptions={{ cardStyle: { backgroundColor: Colors.p60 } }}
    >
      <AStack.Screen
        name="AA"
        component={HomeScreen}
        options={{ title: "Home", headerShown: false }}
      />
      <AStack.Screen name="Test" component={TestScreen} />
    </AStack.Navigator>
  );
};

const HomeTab = createBottomTabNavigator();
const HomeTabScreen = () => {
  return (
    <HomeTab.Navigator
      tabBar={(props) => <BottomTabs {...props} />}
      initialRouteName="A"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.p30,
        tabBarInactiveTintColor: Colors.p30 + Colors.o20,
      }}
    >
      <HomeTab.Screen
        name="A"
        component={AStackScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={["fas", "home"]} size={18} color={color} />
          ),
        }}
      />
      <HomeTab.Screen
        name="__BLANK__"
        component={BlankScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={["fas", "plus"]} size={22} color={color} />
          ),
        }}
      />
      <HomeTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={["fas", "user"]} size={18} color={color} />
          ),
        }}
      />
    </HomeTab.Navigator>
  );
};

const Stack = createStackNavigator();
const AppStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ cardStyle: { backgroundColor: Colors.p60 } }}
    >
      <Stack.Screen
        name="Home"
        component={HomeTabScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NewPost"
        component={NewPostScreen}
        options={{
          cardStyle: { backgroundColor: Colors.p60 + Colors.o95 },
          headerShown: false,
          ...TransitionPresets.ModalPresentationIOS,
          cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
        }}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
