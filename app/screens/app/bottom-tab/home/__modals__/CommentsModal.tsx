import React from "react";
import Colors from "../../../../../constants/colors";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import * as Common from "../../../../../components/common";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, Modal, Pressable, StyleSheet } from "react-native";
import {
  CommentsModalProps,
  CustomBackdropProps,
} from "../../../../../../@types/app/screens/app/bottom-tab/home/__modals__/comment-modal";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { MaterialIndicator } from "react-native-indicators";

/** ********************************************************************** */

// COMPONENT

const CommentsModal = (props: CommentsModalProps) => {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState([]);

  const bottomSheetRef = React.useRef<BottomSheet>(null);

  /** **************************************** */

  // effect

  React.useEffect(() => {
    if (props.visible) {
      getComments();
    }
  }, [props.visible]);

  /** **************************************** */

  // function

  const getComments = async () => {
    setLoading(true);
    try {
      const { data: json } = await my.api.app.post("post/get-comments", {
        post_id: props.postId,
        pagination: {
          limit: 10,
          last_id: 0,
        },
      });
      if (json.status === "ok") {
        setData(json.data);
      }
    } catch (error) {
      if (__DEV__) {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  const onChangeBottomSheet = (index) => {
    if (index === -1) {
      props.onRequestClose();
      setData([]);
    }
  };

  /** **************************************** */

  // render

  const snapPoints = React.useMemo(() => ["50%", "85%"], []);

  const renderBackdrop = React.useCallback((props) => {
    return (
      <CustomBackdropBottomSheet {...props} onClose={handleCloseBottomSheet} />
    );
  }, []);

  const renderItem = React.useCallback(({ item }) => {
    return (
      <View>
        <Common.Text>{item.comment}</Common.Text>
      </View>
    );
  }, []);

  return (
    <Modal
      {...props}
      transparent
      statusBarTranslucent
      onRequestClose={handleCloseBottomSheet}
    >
      <GestureHandlerRootView style={styles.container}>
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          enablePanDownToClose
          onChange={onChangeBottomSheet}
          backdropComponent={renderBackdrop}
        >
          <View style={styles.container}>
            {loading ? (
              <MaterialIndicator color={Colors.p30} />
            ) : data.length > 0 ? (
              <BottomSheetFlatList
                data={data}
                keyExtractor={(_, i) => `key-${i}`}
                renderItem={renderItem}
              />
            ) : (
              <View style={listStyles.empty}>
                <Common.Text>Belum ada komentar</Common.Text>
              </View>
            )}
          </View>
        </BottomSheet>
      </GestureHandlerRootView>
    </Modal>
  );
};

const CommentList = () => {
  return null;
};

const CustomBackdropBottomSheet = ({
  style,
  animatedIndex,
  onClose,
}: CustomBackdropProps) => {
  // animated variables
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [-1, 0, 1],
      [0, 0.3, 0.5],
      Extrapolate.CLAMP
    ),
  }));

  // styles
  const containerStyle = React.useMemo(
    () => [style, { backgroundColor: Colors.black }, containerAnimatedStyle],
    [style, containerAnimatedStyle]
  );

  return (
    <Animated.View style={containerStyle}>
      <Pressable style={styles.container} onPress={onClose} />
    </Animated.View>
  );
};

/** ********************************************************************** */

// STYLE

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const listStyles = StyleSheet.create({
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CommentsModal;
