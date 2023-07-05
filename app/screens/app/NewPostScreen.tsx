import React from "react";
import Colors from "../../constants/colors";
import * as Common from "../../components/common";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import * as ImageManipulator from "expo-image-manipulator";
import { Camera } from "expo-camera";
import { UserContext } from "../../../contexts/user-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  View,
  Image,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  FlatList,
  Alert,
} from "react-native";
// import { FlashList } from "@shopify/flash-list";

const IMAGE_HEIGHT = 210;

const NewPostScreen = ({ navigation }) => {
  const { permissions, toSetPermissions } = React.useContext(UserContext);

  // const [measureInput, setMeasureInput] = React.useState(null);
  const [content, setContent] = React.useState("");
  const [images, setImages] = React.useState([]);

  const imagesRef = React.useRef(null);

  /** **************************************** */

  // effect

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      (async () => {
        const { status: cameraStatus } =
          await ImagePicker.requestCameraPermissionsAsync();
        toSetPermissions("camera", cameraStatus === "granted");

        const { status: mediaLibraryStaus } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        toSetPermissions("mediaLibrary", mediaLibraryStaus === "granted");
      })();
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  /** **************************************** */

  // function

  const pickImageWithCamera = async () => {
    const { assets, canceled } = await ImagePicker.launchCameraAsync();
    if (!canceled) {
      setImages(assets);
    }
  };

  const pickImageWithGallery = async () => {
    const { assets, canceled } = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      exif: false,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!canceled) {
      setImages(assets);
    }
  };

  const onSubmitNewPost = async () => {
    my.loading(true);

    const form = new FormData();
    form.append("content", content);

    for (let i = 0; i < images.length; i++) {
      const name = images[i].uri.split("/").pop();
      const extension = images[i].uri.split(".").pop();
      form.append("images", {
        name,
        uri: images[i].uri,
        type: images[i].type + "/" + extension,
      } as any);
    }

    try {
      const { data: json } = await my.api.app.postForm("post/new-post", form, {
        onUploadProgress: (e) => {
          const progress = Math.round((e.loaded / e.total) * 100);
          console.log(progress);
        },
      });
      if (json.status === "ok") {
        navigation.goBack();
      } else {
        if (json.status === "api_error") {
          Alert.alert("Gagal", json.message);
        }
      }
    } catch (error) {
      if (__DEV__) {
        console.log(error);
      }
    } finally {
      my.loading(false);
    }
  };

  // const onMeasureInput = React.useCallback((e) => {
  //   setMeasureInput(e.nativeEvent.contentSize);
  // }, []);

  const removeImage = (i) => {
    setImages((s) => {
      if (i === s.length - 1) {
        imagesRef.current.scrollToIndex({ index: s.length - 1 });
      }
      return s.filter((_, j) => j !== i);
    });
  };

  /** **************************************** */

  // render

  const renderImages = React.useCallback(({ item, index }) => {
    const width = (IMAGE_HEIGHT * item.width) / item.height;

    return (
      <View key={index} style={contentStyles.imageList}>
        <Pressable
          style={contentStyles.imageRemove}
          onPress={() => removeImage(index)}
        >
          <FontAwesomeIcon icon="xmark" size={16} color={Colors.white} />
        </Pressable>
        <Image
          style={[contentStyles.image, { width }]}
          source={{ uri: item.uri }}
        />
      </View>
    );
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Common.Button
          style={styles.close}
          size="small"
          onPress={navigation.goBack}
          iconLeft={() => (
            <FontAwesomeIcon
              icon={["fas", "xmark"]}
              size={16}
              color={Colors.p101}
            />
          )}
        />
        <Common.Button
          style={styles.post}
          title="Posting"
          size="small"
          onPress={onSubmitNewPost}
        />
      </View>

      <ScrollView style={styles.container}>
        <TextInput
          style={contentStyles.input}
          placeholder="Tulis disini..."
          multiline
          onChangeText={setContent}
        />
        <View>
          <FlatList
            ref={imagesRef}
            contentContainerStyle={contentStyles.imagesContainer}
            data={images}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderImages}
          />
        </View>
      </ScrollView>

      <View style={styles.buttonUploadContainer}>
        {permissions.camera && (
          <Common.Button
            style={styles.buttonUpload}
            size="large"
            onPress={pickImageWithCamera}
            iconLeft={({ size }) => (
              <FontAwesomeIcon
                icon={["fas", "camera"]}
                size={size}
                color={Colors.p30}
              />
            )}
          />
        )}

        {permissions.mediaLibrary && (
          <Common.Button
            style={styles.buttonUpload}
            size="large"
            onPress={pickImageWithGallery}
            iconLeft={({ size }) => (
              <FontAwesomeIcon
                icon={["fas", "image"]}
                size={size}
                color={Colors.p30}
              />
            )}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 22,
    paddingHorizontal: 22,
  },
  close: {
    backgroundColor: Colors.p30 + Colors.o15,
    borderRadius: 16,
  },
  post: {
    borderRadius: 16,
  },
  buttonUploadContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    marginHorizontal: 8,
  },
  buttonUpload: {
    flex: 1,
    backgroundColor: "transparent",
    borderColor: Colors.p30,
    borderWidth: 2,
    borderRadius: 8,
    marginHorizontal: 8,
  },
});

const contentStyles = StyleSheet.create({
  input: {
    padding: 16,
    textAlignVertical: "top",
    fontSize: 16,
  },
  imagesContainer: {
    flexGrow: 1,
    paddingHorizontal: 12,
  },
  imageList: {
    marginHorizontal: 4,
  },
  image: {
    height: IMAGE_HEIGHT,
    borderRadius: 8,
  },
  imageRemove: {
    zIndex: 1,
    position: "absolute",
    width: 28,
    height: 28,
    borderRadius: 28 * 0.5,
    backgroundColor: Colors.black + Colors.o40,
    top: 4,
    right: 4,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default NewPostScreen;
