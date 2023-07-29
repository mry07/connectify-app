import React from "react";
import Colors from "../../constants/colors";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { AuthContext } from "../../../contexts/auth-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, Input, Button } from "../../components";
import { View, Platform, StyleSheet, KeyboardAvoidingView } from "react-native";

const LoginScreen = ({ navigation }) => {
  const { login } = React.useContext(AuthContext);

  const [seePassword, setSeePassword] = React.useState(false);
  const [email, setEmail] = React.useState("user3@gmail.com");
  const [password, setPassword] = React.useState("1234");

  const insets = useSafeAreaInsets();

  /** **************************************** */

  // render

  const iconEye = React.useCallback(
    ({ size }) => {
      const eyeIcon: IconProp = seePassword
        ? ["fas", "eye"]
        : ["fas", "eye-slash"];

      return <FontAwesomeIcon size={size} icon={eyeIcon} color={Colors.p30} />;
    },
    [seePassword]
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={{ paddingTop: insets.top }}>
        <View style={styles.header}>
          <Text size={24} weight="700" color={Colors.p30}>
            Login
          </Text>
        </View>
      </View>
      <View style={styles.center}>
        <Input
          containerStyle={inputStyles.container}
          label="Email"
          placeholder="masukkan email kamu"
          value={email}
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
        />
        <Input
          containerStyle={inputStyles.container}
          label="Password"
          placeholder="masukkan password kamu"
          value={password}
          autoCapitalize="none"
          secureTextEntry={!seePassword}
          onChangeText={setPassword}
          onIconRightPress={() => setSeePassword((s) => !s)}
          iconRight={iconEye}
        />
        <Button
          style={styles.button}
          title="Login"
          onPress={() => login(email, password)}
        />
        <Text style={styles.register}>
          Belum punya akun?{" "}
          <Text
            color={Colors.p30}
            weight="700"
            onPress={() => navigation.navigate("Register")}
          >
            Daftar
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginHorizontal: 16,
    paddingVertical: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
  },
  button: {
    marginHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  register: {
    textAlign: "center",
    marginTop: 16,
  },
});

const inputStyles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
});

export default LoginScreen;
