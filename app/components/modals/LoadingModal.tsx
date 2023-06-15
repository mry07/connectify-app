import React from "react";
import { MaterialIndicator } from "react-native-indicators";
import { View, Modal, StyleSheet } from "react-native";

const LoadingModal = ({ visible }) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
    >
      <View style={styles.container}>
        <View style={styles.brgd} />
        <View style={styles.loadingContainer}>
          <MaterialIndicator size={45} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  brgd: {
    position: "absolute",
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  loadingContainer: {
    width: 110,
    height: 110,
    backgroundColor: "#fff",
    borderRadius: 15,
  },
});

export default LoadingModal;
