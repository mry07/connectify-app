import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Colors from "../../../constants/colors";
import * as Common from "../../../components/common";
import { AuthContext } from "../../../../contexts/auth-context";

const ProfileScreen = () => {
  const { logout } = React.useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Common.Button title="Logout" onPress={logout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.p60,
  },
});

export default ProfileScreen;
