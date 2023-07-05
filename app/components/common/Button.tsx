import React from "react";
import Text, { FontWeight } from "./Text";
import Colors from "../../constants/colors";
import { Pressable, ViewStyle, StyleSheet, PressableProps } from "react-native";

type TSize = "small" | "medium" | "large";

interface CommonButtonProps {
  style?: ViewStyle;
  title?: string;
  size?: TSize;
  titleStyle?: {
    color?: string;
    weight?: FontWeight;
  };
  iconLeft?: ({ style, size }: IconProps) => React.ReactNode;
  iconRight?: ({ style, size }: IconProps) => React.ReactNode;
}

interface IconProps {
  style?: ViewStyle;
  size?: number;
}

const DEFAULT_COMMON_BUTTON_PROPS: CommonButtonProps = {
  size: "medium",
  titleStyle: {
    color: Colors.p60,
    weight: "400",
  },
  iconLeft: () => null,
  iconRight: () => null,
};

const Button: React.FC<CommonButtonProps & PressableProps> = (props) => {
  const { style, title, titleStyle, size, iconLeft, iconRight } = props;

  const customize = React.useMemo(() => {
    let textSize: number;
    let iconProps: IconProps = { style: {} };
    let buttonStyle: ViewStyle = {};

    if (size === "small") {
      textSize = 12;
      iconProps.size = 16;
      buttonStyle = {
        height: 32,
        minWidth: 32,
        paddingLeft: 16,
        paddingRight: 16,
      };

      if (iconLeft) {
        if (title) {
          buttonStyle.paddingLeft = 12;
          iconProps.style.marginRight = 4;
        }
      }

      if (iconRight) {
        if (title) {
          buttonStyle.paddingRight = 12;
          iconProps.style.marginLeft = 4;
        }
      }
    }

    if (size === "medium") {
      textSize = 14;
      iconProps.size = 20;
      buttonStyle = {
        height: 44,
        minWidth: 44,
        paddingLeft: 24,
        paddingRight: 24,
      };

      if (iconLeft) {
        if (title) {
          buttonStyle.paddingLeft = 20;
          iconProps.style.marginRight = 8;
        }
      }

      if (iconRight) {
        if (title) {
          buttonStyle.paddingRight = 20;
          iconProps.style.marginLeft = 8;
        }
      }
    }

    if (size === "large") {
      textSize = 16;
      iconProps.size = 24;
      buttonStyle = {
        height: 52,
        minWidth: 52,
        paddingLeft: 32,
        paddingRight: 32,
      };

      if (iconLeft) {
        if (title) {
          buttonStyle.paddingLeft = 24;
          iconProps.style.marginRight = 8;
        }
      }

      if (iconRight) {
        if (title) {
          buttonStyle.paddingRight = 24;
          iconProps.style.marginLeft = 8;
        }
      }
    }

    return { textSize, buttonStyle, iconProps };
  }, [title, size, iconLeft, iconRight]);

  return (
    <Pressable
      {...props}
      style={[styles.container, customize.buttonStyle, style]}
    >
      {iconLeft(customize.iconProps)}
      <Text
        style={styles.text}
        size={customize.textSize}
        color={titleStyle.color}
        weight={titleStyle.weight}
      >
        {title}
      </Text>
      {iconRight(customize.iconProps)}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.p30,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  text: {
    textAlign: "center",
    textAlignVertical: "center",
  },
});

Button.defaultProps = DEFAULT_COMMON_BUTTON_PROPS;
export default Button;
