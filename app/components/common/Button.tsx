import Text from "./Text";
import React from "react";
import Colors from "../../constants/colors";
import {
  ButtonProps,
  Customize,
} from "../../../@types/app/components/common/button";
import {
  View,
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";

const DEFAULT_PROPS: ButtonProps = {
  size: "medium",
  options: {
    titleColor: Colors.p60,
    titleWeight: "400",
  },
};

const Button = React.forwardRef<View, ButtonProps>(
  ({ style, title, size, options, iconLeft, iconRight, ...props }, ref) => {
    const customize = React.useMemo<Customize>(() => {
      let result: Customize = {};

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
    }, [title, size, iconLeft, iconRight]);

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
export default Button;

/** **************************************************************************************************** */

// PHASE 1

// import React from "react";
// import Text, { FontWeight } from "./Text";
// import Colors from "../../constants/colors";
// import { Pressable, ViewStyle, StyleSheet, PressableProps } from "react-native";

// type TSize = "small" | "medium" | "large";

// interface CommonButtonProps {
//   style?: ViewStyle;
//   title?: string;
//   size?: TSize;
//   titleStyle?: {
//     color?: string;
//     weight?: FontWeight;
//   };
//   iconLeft?: ({ style, size }: IconProps) => React.ReactNode;
//   iconRight?: ({ style, size }: IconProps) => React.ReactNode;
// }

// interface IconProps {
//   style?: ViewStyle;
//   size?: number;
// }

// const DEFAULT_COMMON_BUTTON_PROPS: CommonButtonProps = {
//   size: "medium",
//   titleStyle: {
//     color: Colors.p60,
//     weight: "400",
//   },
//   iconLeft: () => null,
//   iconRight: () => null,
// };

// const Button: React.FC<CommonButtonProps & PressableProps> = (props) => {
//   const { style, title, titleStyle, size, iconLeft, iconRight } = props;

//   const customize = React.useMemo(() => {
//     let textSize: number;
//     let iconProps: IconProps = { style: {} };
//     let buttonStyle: ViewStyle = {};

//     if (size === "small") {
//       textSize = 12;
//       iconProps.size = 16;
//       buttonStyle = {
//         height: 32,
//         minWidth: 32,
//         paddingLeft: 16,
//         paddingRight: 16,
//       };

//       if (iconLeft) {
//         if (title) {
//           buttonStyle.paddingLeft = 12;
//           iconProps.style.marginRight = 4;
//         }
//       }

//       if (iconRight) {
//         if (title) {
//           buttonStyle.paddingRight = 12;
//           iconProps.style.marginLeft = 4;
//         }
//       }
//     }

//     if (size === "medium") {
//       textSize = 14;
//       iconProps.size = 20;
//       buttonStyle = {
//         height: 44,
//         minWidth: 44,
//         paddingLeft: 24,
//         paddingRight: 24,
//       };

//       if (iconLeft) {
//         if (title) {
//           buttonStyle.paddingLeft = 20;
//           iconProps.style.marginRight = 8;
//         }
//       }

//       if (iconRight) {
//         if (title) {
//           buttonStyle.paddingRight = 20;
//           iconProps.style.marginLeft = 8;
//         }
//       }
//     }

//     if (size === "large") {
//       textSize = 16;
//       iconProps.size = 24;
//       buttonStyle = {
//         height: 52,
//         minWidth: 52,
//         paddingLeft: 32,
//         paddingRight: 32,
//       };

//       if (iconLeft) {
//         if (title) {
//           buttonStyle.paddingLeft = 24;
//           iconProps.style.marginRight = 8;
//         }
//       }

//       if (iconRight) {
//         if (title) {
//           buttonStyle.paddingRight = 24;
//           iconProps.style.marginLeft = 8;
//         }
//       }
//     }

//     return { textSize, buttonStyle, iconProps };
//   }, [title, size, iconLeft, iconRight]);

//   return (
//     <Pressable
//       {...props}
//       style={[styles.container, customize.buttonStyle, style]}
//     >
//       {iconLeft(customize.iconProps)}
//       <Text
//         style={styles.text}
//         size={customize.textSize}
//         color={titleStyle.color}
//         weight={titleStyle.weight}
//       >
//         {title}
//       </Text>
//       {iconRight(customize.iconProps)}
//     </Pressable>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: Colors.p30,
//     justifyContent: "center",
//     alignItems: "center",
//     flexDirection: "row",
//   },
//   text: {
//     textAlign: "center",
//     textAlignVertical: "center",
//   },
// });

// Button.defaultProps = DEFAULT_COMMON_BUTTON_PROPS;
// export default Button;
