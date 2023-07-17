import { PressableProps, StyleProp, ViewStyle } from "react-native";
import { FontWeight } from "./text";

export interface Customize {
  containerStyle?: StyleProp<ViewStyle>;
  iconLeftStyle?: StyleProp<ViewStyle>;
  iconRightStyle?: StyleProp<ViewStyle>;
  iconSize?: number;
  titleSize?: number;
}

export interface Options {
  titleSize?: number;
  titleColor?: string;
  titleWeight?: FontWeight;
}

export interface ButtonIconProps {
  size: number;
}

export interface ButtonProps extends PressableProps {
  style?: StyleProp<ViewStyle>;
  title?: string;
  size?: "small" | "medium" | "large";
  options?: Options;
  iconLeft?: ({ size }: ButtonIconProps) => React.ReactNode;
  iconRight?: ({ size }: ButtonIconProps) => React.ReactNode;
}
