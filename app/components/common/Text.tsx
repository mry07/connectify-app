import React from "react";
import Colors from "../../constants/colors";
import { fonts } from "../../constants/fonts";
import { TextProps } from "./Text.types";
import { StyleProp, Text as RNText, TextStyle } from "react-native";

const DEFAULT_PROPS: TextProps = {
  size: 14,
  font: "poppins",
  weight: "400",
  variant: "normal",
  color: Colors.p101,
};

export const Text = ({
  style,
  size,
  font,
  color,
  align,
  weight,
  variant,
  children,
}: TextProps) => {
  const fontFamily = fonts[font][variant][weight];

  if (!fontFamily) {
    console.warn(`Unknown font or variant or weight: ${font}`);
  }

  const textStyle: StyleProp<TextStyle> = [
    {
      fontFamily,
      color: color,
      fontSize: size,
      textAlign: align,
      includeFontPadding: false,
    },
    style,
  ];

  return <RNText style={textStyle}>{children}</RNText>;
};

Text.defaultProps = DEFAULT_PROPS;
