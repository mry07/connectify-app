import { FontFamily, FontVariant, FontWeight } from "./Text.types";
import { StyleProp, TextInputProps, TextStyle, ViewStyle } from "react-native";

export interface IconProps {
  size?: number;
}

export interface InputProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  label?: string;
  error?: string;
  size?: number;
  color?: string;
  font?: FontFamily;
  weight?: FontWeight;
  variant?: FontVariant;
  align?: "left" | "center" | "right";
  onIconLeftPress?: (event: any) => void;
  onIconRightPress?: (event: any) => void;
  iconLeft?: ({ size }: IconProps) => React.ReactNode;
  iconRight?: ({ size }: IconProps) => React.ReactNode;
}
