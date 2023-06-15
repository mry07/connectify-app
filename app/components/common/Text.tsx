import React from "react";
import Colors from "../../constants/colors";
import { fonts } from "../../constants/fonts";
import { StyleProp, Text as RNText, TextProps, TextStyle } from "react-native";

type FontFamily = "poppins" | "nunito";
type FontStyle = "normal" | "italic";
type FontWeight =
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900";

export interface CommonTextProps {
  style?: StyleProp<TextStyle>;
  color?: string;
  font?: FontFamily;
  size?: number;
  weight?: FontWeight;
  variant?: FontStyle;
}

export const DEFAULT_COMMON_TEXT_PROPS: CommonTextProps = {
  color: Colors.p101,
  font: "poppins",
  variant: "normal",
  weight: "400",
  size: 14,
};

const Text: React.FC<CommonTextProps & TextProps> = (props) => {
  const fontFamily = fonts[props.font][props.variant][props.weight];

  if (!fontFamily) {
    console.warn(`Unknown font or variant or weight: ${props.font}`);
  }

  return (
    <RNText
      {...props}
      style={[
        {
          fontFamily,
          color: props.color,
          fontSize: props.size,
          includeFontPadding: false,
        },
        props.style,
      ]}
    >
      {props.children}
    </RNText>
  );
};

Text.defaultProps = DEFAULT_COMMON_TEXT_PROPS;
export default Text;
