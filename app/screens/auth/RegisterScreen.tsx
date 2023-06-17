import React from "react";
import Colors from "../../constants/colors";
import * as Common from "../../components/common";
import {
  View,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { Form } from "../../../types/app/screens/auth/register-screen";
import { AuthContext } from "../../../contexts/auth-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const RegisterScreen = ({ navigation }) => {
  const { register } = React.useContext(AuthContext);

  const [form, setForm] = React.useState<Partial<Form>>({});

  const insets = useSafeAreaInsets();

  /** **************************************** */

  // function

  const onChangeField = (k, v) => {
    setForm((s) => ({ ...s, [k]: v }));
  };

  const onSubmit = async () => {
    const { status } = await register(
      form.name,
      form.username,
      form.email,
      form.password
    );
    if (status === "ok") {
      Alert.alert("Registrasi Berhasil", "Akun Anda berhasil dibuat", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    }
  };

  /** **************************************** */

  // render

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={{ paddingTop: insets.top }}>
        <View style={styles.header}>
          <Pressable style={styles.back} onPress={navigation.goBack}>
            <FontAwesomeIcon size={20} icon={["fas", "arrow-left"]} />
          </Pressable>
          <Common.Text size={24} weight="700" color={Colors.p30}>
            Register
          </Common.Text>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Common.Input
          containerStyle={inputStyles.container}
          label="Nama"
          placeholder="masukkan nama kamu"
          onChangeText={(v) => onChangeField("name", v)}
        />
        <Common.Input
          containerStyle={inputStyles.container}
          label="Username"
          placeholder="masukkan username kamu"
          autoCapitalize="none"
          onChangeText={(v) => onChangeField("username", v)}
        />
        <Common.Input
          containerStyle={inputStyles.container}
          label="Email"
          placeholder="masukkan email kamu"
          autoCapitalize="none"
          onChangeText={(v) => onChangeField("email", v)}
        />
        <Common.Input
          containerStyle={inputStyles.container}
          label="Passoword"
          placeholder="masukkan password kamu"
          autoCapitalize="none"
          onChangeText={(v) => onChangeField("password", v)}
        />
        <Common.Button
          style={styles.button}
          title="Register"
          onPress={onSubmit}
        />
      </ScrollView>
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
    flexDirection: "row",
    alignItems: "center",
  },
  back: {
    marginRight: 16,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 8,
  },
  button: {
    marginHorizontal: 16,
    marginBottom: 8,
    marginTop: 16,
    borderRadius: 8,
  },
});

const inputStyles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
});

export default RegisterScreen;
