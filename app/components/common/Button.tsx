import React from "react";
import Colors from "../../constants/colors";
import { Text } from "./Text";
import { ButtonProps, CustomizeButtonProps } from "./Button.types";
import {
  View,
  Pressable,
  ViewStyle,
  StyleProp,
  StyleSheet,
} from "react-native";

const DEFAULT_PROPS: ButtonProps = {
  size: "medium",
  options: {
    titleColor: Colors.p60,
    titleWeight: "400",
  },
};

/** ********************************************************************** */

// COMPONENT

export const Button = React.forwardRef<View, ButtonProps>(
  ({ style, title, size, options, iconLeft, iconRight, ...props }, ref) => {
    const customize = useCustomize({
      title,
      size,
      options,
      iconLeft,
      iconRight,
    });

    const containerStyle: StyleProp<ViewStyle> = [
      styles.container,
      customize.containerStyle,
      style,
    ];

    return (
      <Pressable {...props} ref={ref} style={containerStyle}>
        {iconLeft && (
          <View style={customize.iconLeftStyle}>
            {iconLeft({ size: customize.iconSize })}
          </View>
        )}
        <Text
          style={styles.title}
          size={customize.titleSize}
          color={options.titleColor}
          weight={options.titleWeight}
        >
          {title}
        </Text>
        {iconRight && (
          <View style={customize.iconRightStyle}>
            {iconRight({ size: customize.iconSize })}
          </View>
        )}
      </Pressable>
    );
  }
);

/** ********************************************************************** */

// HOOK

const useCustomize = ({ title, size, options, iconLeft, iconRight }) => {
  const customize = React.useMemo<CustomizeButtonProps>(() => {
    let result: CustomizeButtonProps = {};

    switch (size) {
      case "small":
        result.containerStyle = {
          height: 32,
          minWidth: 32,
          paddingLeft: 16,
          paddingRight: 16,
        };
        result.iconSize = 16;
        result.titleSize = 14;

        if (title) {
          if (iconLeft) {
            result.containerStyle.paddingLeft = 12;
            result.iconLeftStyle = {
              marginRight: 4,
            };
          }

          if (iconRight) {
            result.containerStyle.paddingRight = 12;
            result.iconRightStyle = {
              marginLeft: 4,
            };
          }
        } else {
          result.containerStyle.paddingLeft = 8;
          result.containerStyle.paddingRight = 8;
        }
        break;
      case "medium":
        result.containerStyle = {
          height: 44,
          minWidth: 44,
          paddingLeft: 24,
          paddingRight: 24,
        };
        result.iconSize = 20;
        result.titleSize = 16;

        if (title) {
          if (iconLeft) {
            result.containerStyle.paddingLeft = 20;
            result.iconLeftStyle = {
              marginRight: 8,
            };
          }

          if (iconRight) {
            result.containerStyle.paddingRight = 20;
            result.iconRightStyle = {
              marginLeft: 8,
            };
          }
        } else {
          result.containerStyle.paddingLeft = 12;
          result.containerStyle.paddingRight = 12;
        }
        break;
      case "large":
        result.containerStyle = {
          height: 52,
          minWidth: 52,
          paddingLeft: 32,
          paddingRight: 32,
        };
        result.iconSize = 24;
        result.titleSize = 16;

        if (title) {
          if (iconLeft) {
            result.containerStyle.paddingLeft = 24;
            result.iconLeftStyle = {
              marginRight: 8,
            };
          }

          if (iconRight) {
            result.containerStyle.paddingRight = 24;
            result.iconRightStyle = {
              marginLeft: 8,
            };
          }
        } else {
          result.containerStyle.paddingLeft = 14;
          result.containerStyle.paddingRight = 14;
        }
        break;
    }

    result.titleSize = options.titleSize || result.titleSize;

    return result;
  }, [title, size, options, iconLeft, iconRight]);

  return customize;
};

/** ********************************************************************** */

// STYLE

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.p30,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  title: {
    textAlign: "center",
  },
});

Button.defaultProps = DEFAULT_PROPS;
