import React from "react";
import Navigations from "./navigations";
import LoadingModal from "./components/modals/LoadingModal";
import * as Font from "expo-font";
import * as Crypto from "expo-crypto";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { toUseFonts } from "./constants/fonts";
import { AuthContext } from "../contexts/auth-context";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { storageGet, storageSet } from "../utils/storage";

SplashScreen.preventAutoHideAsync();

const App = () => {
  const { setHasLogged } = React.useContext(AuthContext);

  const [fontsLoaded] = Font.useFonts(toUseFonts);
  const [loading, setLoading] = React.useState(false);
  const [appIsReady, setAppIsReady] = React.useState(false);

  const insets = useSafeAreaInsets();

  /** **************************************** */

  // effect

  React.useEffect(() => {
    my.loading = setLoading;
  }, []);

  React.useEffect(() => {
    (async () => {
      if (fontsLoaded) {
        const hasLogged = await storageGet("@has_logged");
        setHasLogged(hasLogged);

        let uuid = await storageGet("@uuid");
        if (!uuid) {
          uuid = Crypto.randomUUID();
          await storageSet("@uuid", uuid);
        }

        setAppIsReady(true);
      }
    })();
  }, [fontsLoaded]);

  /** **************************************** */

  // function

  const onLayoutRootView = React.useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  /** **************************************** */

  // render

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <StatusBar style="dark" />
      <Navigations />
      <LoadingModal visible={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
