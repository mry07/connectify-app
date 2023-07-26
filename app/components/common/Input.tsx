import React from "react";
import Colors from "../../constants/colors";
import { Text } from "./Text";
import { InputProps } from "./Input.types";
import {
  View,
  TextInput,
  StyleProp,
  TextStyle,
  Pressable,
  ViewStyle,
  StyleSheet,
} from "react-native";
import { fonts } from "../../constants/fonts";

const INPUT_HEIGHT = 48;

const DEFAULT_PROPS: InputProps = {
  size: 14,
  font: "poppins",
  weight: "400",
  variant: "normal",
  color: Colors.p101,
};

export const Input = React.forwardRef<TextInput, InputProps>(
  (
    {
      containerStyle,
      inputContainerStyle,
      inputStyle,
      label,
      error,
      font,
      variant,
      weight,
      color,
      size,
      onIconLeftPress,
      onIconRightPress,
      iconLeft,
      iconRight,
      ...props
    },
    ref
  ) => {
    const fontFamily = fonts[font][variant][weight];

    const textInputContainerStyle: StyleProp<ViewStyle> = [
      styles.inputContainer,
      { paddingLeft: !iconLeft ? 16 : 0, paddingRight: !iconRight ? 16 : 0 },
      inputContainerStyle,
    ];

    const textInputStyle: StyleProp<TextStyle> = [
      styles.input,
      { fontFamily, color, fontSize: size },
      inputStyle,
    ];

    const iconLeftStyle: StyleProp<ViewStyle> = [
      styles.iconLeft,
      { paddingLeft: !iconLeft ? 0 : 16 },
    ];

    const iconRightStyle: StyleProp<ViewStyle> = [
      styles.iconRight,
      { paddingRight: !iconRight ? 0 : 16 },
    ];

    return (
      <View style={containerStyle}>
        <InputLabel text={label} />
        <View style={textInputContainerStyle}>
          {iconLeft && (
            <Pressable style={iconLeftStyle} onPress={onIconLeftPress}>
              {iconLeft({ size: 16 })}
            </Pressable>
          )}
          <TextInput
            {...props}
            ref={ref}
            style={textInputStyle}
            placeholderTextColor={Colors.p101 + Colors.o30}
          />
          {iconRight && (
            <Pressable style={iconRightStyle} onPress={onIconRightPress}>
              {iconRight({ size: 16 })}
            </Pressable>
          )}
        </View>
        <InputError text={error} />
      </View>
    );
  }
);

const InputLabel = ({ text }) => {
  if (!text) {
    return null;
  }

  return (
    <Text style={styles.label} size={12} weight="500">
      {text}
    </Text>
  );
};

const InputError = ({ text }) => {
  if (!text) {
    return null;
  }

  return (
    <Text style={styles.error} size={12} color={Colors.red400}>
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 8,
    height: INPUT_HEIGHT,
    overflow: "hidden",
  },
  input: {
    flex: 1,
    includeFontPadding: false,
    height: "100%",
  },
  iconLeft: {
    paddingRight: 8,
    height: "100%",
    justifyContent: "center",
  },
  iconRight: {
    paddingLeft: 8,
    height: "100%",
    justifyContent: "center",
  },
  label: {
    marginLeft: 4,
    marginBottom: 4,
  },
  error: {
    marginLeft: 4,
    marginTop: 4,
  },
});

Input.defaultProps = DEFAULT_PROPS;
