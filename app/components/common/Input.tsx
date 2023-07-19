import { Text } from "./Text";
import React from "react";
import Colors from "../../constants/colors";
import { fonts } from "../../constants/fonts";
import {
  View,
  ViewStyle,
  TextStyle,
  TextInput,
  StyleProp,
  StyleSheet,
  TextInputProps,
} from "react-native";
import { TextProps } from "./types/text";

interface IconProps {
  style?: ViewStyle;
  size?: number;
}

export interface CommonTextInputProps extends TextProps {
  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  label?: string;
  error?: string;
  iconLeft?: ({ style, size }: IconProps) => React.ReactNode;
  iconRigth?: ({ style, size }: IconProps) => React.ReactNode;
}

const DEFAULT_PROPS: TextProps = {
  color: Colors.p101,
  font: "poppins",
  variant: "normal",
  weight: "400",
  size: 14,
};

export const Input = React.forwardRef<
  TextInput,
  CommonTextInputProps & TextInputProps
>((props, ref) => {
  const fontFamily = fonts[props.font][props.variant][props.weight];

  return (
    <View style={props.containerStyle}>
      {!!props.label && (
        <Text style={styles.label} size={12} weight="500">
          {props.label}
        </Text>
      )}
      <View style={[styles.inputContainer, props.inputContainerStyle]}>
        {props.iconLeft?.({ style: { marginRight: 8 }, size: 16 })}
        <TextInput
          {...props}
          ref={ref}
          style={[
            styles.input,
            {
              fontFamily,
              color: props.color,
              fontSize: props.size,
            },
            props.inputStyle,
          ]}
          placeholderTextColor={Colors.p101 + Colors.o30}
        />
        {props.iconRigth?.({ style: { marginLeft: 8 }, size: 16 })}
      </View>
      {!!props.error && (
        <Text style={styles.error} size={12} color={Colors.red400}>
          {props.error}
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    // paddingVertical: Platform.OS === "ios" ? 12 : 8,
    includeFontPadding: false,
    paddingTop: 12,
    paddingBottom: 12,
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
