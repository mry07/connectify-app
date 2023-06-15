import React from "react";
import Colors from "../constants/colors";
import BottomTabs from "../components/ui/BottomTabs";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  CardStyleInterpolators,
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

/** ********************************************************************** */

// SCREENS

import Test from "../screens/__TestScreen__";

import Home from "../screens/app/HomeScreen";
// --->

import AddPost from "../screens/app/AddPostScreen";
// --->

import Profile from "../screens/app/ProfileScreen";
// --->

/** ********************************************************************** */

// NAVIGATOR

const Stack = createStackNavigator();

const HomeStackScreen = () => {
  return (
    <Stack.Navigator
      initialRouteName="A"
      screenOptions={{ cardStyle: { backgroundColor: Colors.p60 } }}
    >
      <Stack.Screen
        name="A"
        component={Home}
        options={{ title: "Home", headerShown: false }}
      />
      <Stack.Screen
        name="Test"
        component={Test}
        options={{
          headerShown: false,
          ...TransitionPresets.ModalTransition,
        }}
      />
    </Stack.Navigator>
  );
};

const AddPostStackScreen = () => {
  return (
    <Stack.Navigator
      initialRouteName="B"
      screenOptions={{ cardStyle: { backgroundColor: Colors.p60 } }}
    >
      <Stack.Screen
        name="B"
        component={AddPost}
        options={{
          title: "Add Post",
          headerShown: false,

          ...TransitionPresets.ModalSlideFromBottomIOS,
          detachPreviousScreen: false,
          presentation: "modal",
          cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
        }}
      />
    </Stack.Navigator>
  );
};

const Tab = createBottomTabNavigator();
const AppTabs = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomTabs {...props} />}
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.p30,
        tabBarInactiveTintColor: Colors.p30 + Colors.o20,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={["fas", "home"]} size={18} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AddPost"
        component={AddPostStackScreen}
        options={{
          tabBarIcon: () => (
            <FontAwesomeIcon icon={["fas", "plus"]} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={["fas", "user"]} size={18} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppTabs;
