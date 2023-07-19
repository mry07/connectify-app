import { StyleProp, TextProps as RNTextProps, TextStyle } from "react-native";

export type FontFamily = "poppins" | "nunito";

export type FontVariant = "normal" | "italic";

export type FontWeight =
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900";

export interface TextProps extends RNTextProps {
  style?: StyleProp<TextStyle>;
  size?: number;
  color?: string;
  font?: FontFamily;
  weight?: FontWeight;
  variant?: FontVariant;
  align?: "left" | "center" | "right";
}
