import React from "react";
import Colors from "../../constants/colors";
import { View, Pressable, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PLUS_SIZE = 64;
const BOTTOM_TABS_HEIGHT = Platform.OS === "ios" ? 54 : 56;

const BottomTabs = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const insetBottom = Platform.OS === "ios" ? insets.bottom : 0;

  return (
    <View
      style={[
        styles.container,
        {
          height: BOTTOM_TABS_HEIGHT + insetBottom,
          paddingBottom: insetBottom,
        },
      ]}
    >
      {state.routes.map((e, i) => {
        const { options } = descriptors[e.key];

        const isFocused = state.index === i;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: e.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: e.name, merge: true });
          }
        };

        if (i === 1) {
          return (
            <View key={i} style={buttonPlusStyles.container}>
              <Pressable
                style={buttonPlusStyles.button}
                onPress={() => navigation.navigate("NewPost")}
              >
                {options.tabBarIcon({ color: Colors.p30 })}
              </Pressable>
            </View>
          );
        }

        return (
          <Pressable
            key={i}
            style={styles.routes}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
          >
            {options.tabBarIcon({
              focused: isFocused,
              color: isFocused
                ? options.tabBarActiveTintColor
                : options.tabBarInactiveTintColor,
            })}
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.white,
  },
  routes: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

const buttonPlusStyles = StyleSheet.create({
  container: {
    width: PLUS_SIZE,
  },
  button: {
    width: PLUS_SIZE,
    height: PLUS_SIZE,
    top: -PLUS_SIZE * 0.5,
    borderRadius: PLUS_SIZE * 0.5,
    backgroundColor: Colors.p102,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default BottomTabs;
