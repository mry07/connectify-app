import React from "react";
import Colors from "../../../../../constants/colors";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import * as Common from "../../../../../components/common";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  View,
  Modal,
  Keyboard,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import {
  CommentsModalProps,
  CustomBackdropProps,
} from "../../../../../../@types/app/screens/app/bottom-tab/home/__modals__/comment-modal";
import Animated, {
  Extrapolate,
  interpolate,
  measure,
  runOnUI,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { MaterialIndicator } from "react-native-indicators";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { UserContext } from "../../../../../../contexts/user-context";

/** ********************************************************************** */

// COMPONENT

const CommentsModal = (props: CommentsModalProps) => {
  const { userDetails } = React.useContext(UserContext);

  const [measureInput, setMeasureInput] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [bottomSheetIndex, setBottomSheetIndex] = React.useState(1);
  const [comment, setComment] = React.useState("");
  const [data, setData] = React.useState([]);

  const svInput = useSharedValue(0);
  const insets = useSafeAreaInsets();
  const inputRef = React.useRef(null);
  const bottomSheetRef = React.useRef<BottomSheet>(null);

  /** **************************************** */

  // effect

  React.useEffect(() => {
    if (props.visible) {
      getComments();
      svInput.value = withTiming(0, { duration: 200 });
    }
  }, [props.visible]);

  React.useEffect(() => {
    const subscription1 = Keyboard.addListener("keyboardDidHide", () => {
      inputRef.current?.blur();
      bottomSheetRef.current?.snapToIndex(1);
      setBottomSheetIndex(1);
    });

    const subscription2 = Keyboard.addListener("keyboardDidShow", () => {
      bottomSheetRef.current?.snapToIndex(2);
      setBottomSheetIndex(2);
    });

    return () => {
      subscription1.remove();
      subscription2.remove();
    };
  }, []);

  /** **************************************** */

  // function

  const getComments = async () => {
    setLoading(true);
    try {
      const { data: json } = await my.api.app.post("post/get-comments", {
        post_id: props.postId,
        pagination: {
          limit: 20,
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

  const onAnimateBottomSheet = (fromIndex, toIndex) => {
    if (toIndex === -1) {
      svInput.value = withTiming(-measureInput?.height, { duration: 100 });
      setTimeout(() => {
        props.onRequestClose();
        setData([]);
      }, 100);
    }
  };

  const onLayoutInput = React.useCallback(
    ({ nativeEvent }) => {
      if (!measureInput) {
        setMeasureInput(nativeEvent.layout);
      }
    },
    [measureInput]
  );

  const onSendComment = async () => {
    try {
      const { data: json } = await my.api.app.post("post/comment", {
        post_id: props.postId,
        comment,
      });
      if (json.status === "ok") {
        const date = new Date();
        const createdAt = date.getTime();
        const comments = [...data];
        const newComment = {
          comment,
          id: props.postId,
          user_id: userDetails.id,
          name: userDetails.name,
          username: userDetails.username,
          avatar: userDetails.avatar,
          created_at: createdAt,
        };

        comments.unshift(newComment);

        setData(comments);
        setComment("");
      }
    } catch (error) {
      if (__DEV__) {
        console.error(error);
      }
    }
  };

  /** **************************************** */

  // render

  const snapPoints = React.useMemo(() => ["55%", "90%", "100%"], []);

  const animatedStyles = useAnimatedStyle(() => ({
    position: "absolute",
    width: "100%",
    bottom: svInput.value,
  }));

  const renderItem = React.useCallback(({ item }) => {
    const uri = my.url.uploads.avatars + item.avatar;

    return (
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 16,
          paddingVertical: 8,
        }}
      >
        <Image
          style={{
            width: 36,
            height: 36,
            marginRight: 8,
            marginTop: 4,
            resizeMode: "contain",
          }}
          source={{ uri }}
        />
        <View>
          <Common.Text size={12} weight="500">
            {item.name}{" "}
            <Common.Text size={12} color={Colors.p101 + Colors.o50}>
              @{item.username}
            </Common.Text>
          </Common.Text>
          <Common.Text>{item.comment}</Common.Text>
        </View>
      </View>
    );
  }, []);

  const renderBackdrop = React.useCallback((props) => {
    return (
      <CustomBackdropBottomSheet {...props} onClose={handleCloseBottomSheet} />
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
          index={bottomSheetIndex}
          topInset={insets.top}
          snapPoints={snapPoints}
          enablePanDownToClose
          onAnimate={onAnimateBottomSheet}
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
        <KeyboardAvoidingView
          style={styles.keyboard}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          pointerEvents="box-none"
        >
          <Animated.View style={animatedStyles} onLayout={onLayoutInput}>
            <View style={styles.divider} />
            <Common.Input
              ref={inputRef}
              placeholder="Tulis komentar"
              value={comment}
              onChangeText={setComment}
              iconRigth={({ style }) => (
                <Pressable style={style} onPress={onSendComment}>
                  <Common.Text weight="500" color={Colors.p30}>
                    Kirim
                  </Common.Text>
                </Pressable>
              )}
            />
          </Animated.View>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </Modal>
  );
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
      [-1, 0, 1, 2],
      [0, 0.3, 0.5, 0.6],
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
  keyboard: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  divider: {
    height: 1.2,
    backgroundColor: Colors.p101 + Colors.o30,
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
