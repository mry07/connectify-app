import React from "react";
import * as Common from "../../components/common";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../../../contexts/auth-context";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import Colors from "../../constants/colors";
import { Camera, CameraType } from "expo-camera";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { MaterialIndicator } from "react-native-indicators";
import { IconPrefix } from "@fortawesome/fontawesome-svg-core";

const AVATAR = require("../../../assets/images/profile2.png");
const AVATAR_SIZE = 46;
const POST_AVATAR_SIZE = 43;

/** ********************************************************************** */

// COMPONENT

const HomeScreen = () => {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      try {
        const { data: json } = await my.api.post("post/get-posts");
        if (json.status === "ok") {
          setData(json.data);
        }
      } catch (error) {
        if (__DEV__) {
          console.log(error);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /** **************************************** */

  // render

  const renderImage = React.useCallback(({ item }) => {
    return (
      <Image
        style={postImagesStyles.image}
        source={{ uri: my.url.uploads.posts + item.image }}
        contentFit="cover"
        placeholder={item.blurhash}
        transition={300}
      />
    );
  }, []);

  const renderItem = React.useCallback(({ item }) => {
    return (
      <View style={listStyles.list}>
        <View style={listStyles.postHeader}>
          <Image style={listStyles.avatar} source={AVATAR} />
          <View>
            <Common.Text style={listStyles.name} size={14} weight="600">
              {item.name}
            </Common.Text>
            <Common.Text style={listStyles.username} size={12}>
              @{item.username}
            </Common.Text>
          </View>
        </View>

        {!!item.post_content && (
          <Common.Text style={listStyles.postContent}>
            {item.post_content}
          </Common.Text>
        )}

        {!!item.post_images.length && (
          <View style={postImagesStyles.container}>
            <View style={postImagesStyles.imagesWrapper}>
              <FlashList
                data={item.post_images}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                estimatedItemSize={WINDOW_WIDTH}
                renderItem={renderImage}
              />

              <PostActionsBar data={item} type="images" />
            </View>
          </View>
        )}

        <PostActionsBar data={item} type="content" />
      </View>
    );
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ zIndex: 1, paddingTop: my.insets.top }}>
        <View style={styles.header}>
          <Image style={styles.profile} source={AVATAR} />
          <Common.Text size={18} weight="700">
            Hi, User 👋
          </Common.Text>
        </View>
      </View>

      {loading ? (
        <MaterialIndicator color={Colors.p30} />
      ) : data.length > 0 ? (
        <View style={listStyles.container}>
          <FlashList
            contentContainerStyle={listStyles.content}
            data={data}
            estimatedItemSize={WINDOW_WIDTH}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
          />
        </View>
      ) : (
        <Common.Text style={listStyles.empty} weight="500">
          No Posts
        </Common.Text>
      )}
    </View>
  );
};

const PostActionsBar = ({ data, type }) => {
  if (type === "images") {
    return (
      <View style={postActionsBarStyles.container1}>
        <PostActions data={data} type={type} />
      </View>
    );
  }

  if (type === "content") {
    if (data.post_images.length < 1) {
      return (
        <View style={postActionsBarStyles.container2}>
          <PostActions data={data} type={type} />
        </View>
      );
    }

    return <View style={postActionsBarStyles.gap} />;
  }
};

const PostActions = ({ data, type }) => {
  /** **************************************** */

  // function

  const onLiked = async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      const { data: json } = await my.api.post("post/like-dislike", undefined, {
        signal: controller.signal,
      });

      console.log("like");
    } catch (error) {
      console.log(error.name);
    } finally {
      clearTimeout(timeout);
    }
  };

  const onDisliked = () => {
    console.log("dislike");
  };

  /** **************************************** */

  // render

  const actions = React.useMemo(() => {
    if (type === "images") {
      return {
        color: Colors.p101,
        iconType: "far",
      };
    }

    return {
      color: Colors.white,
      iconType: "far",
    };
  }, []);

  const liked = React.useMemo(() => {
    if (data.is_liked) {
      return {
        color: Colors.p102,
        iconType: "fas",
      };
    }

    return actions;
  }, [data.is_liked]);

  const disliked = React.useMemo(() => {
    if (data.is_disliked) {
      return {
        color: Colors.p102,
        iconType: "fas",
      };
    }

    return actions;
  }, [data.is_disliked]);

  return (
    <View style={postActionsBarStyles.wrapper}>
      <FontAwesomeIcon
        icon={["fas", "comment"]}
        size={18}
        color={actions.color}
      />
      <View style={postActionsBarStyles.row1}>
        <View style={postActionsBarStyles.row2}>
          <Common.Text size={14} weight="600" color={disliked.color}>
            {data.dislikes}
          </Common.Text>
          <Pressable onPress={onDisliked}>
            <FontAwesomeIcon
              style={postActionsBarStyles.iconWithNumber}
              icon={[disliked.iconType as IconPrefix, "thumbs-down"]}
              color={disliked.color}
              size={18}
            />
          </Pressable>
        </View>
        <View style={postActionsBarStyles.row2}>
          <Common.Text size={14} weight="600" color={liked.color}>
            {data.likes}
          </Common.Text>
          <Pressable onPress={onLiked}>
            <FontAwesomeIcon
              style={postActionsBarStyles.iconWithNumber}
              icon={[liked.iconType as IconPrefix, "thumbs-up"]}
              color={liked.color}
              size={18}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

/** ********************************************************************** */

// STYLES

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: Colors.p60,
  },
  profile: {
    marginRight: 14,
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE * 0.5,
  },
});

const listStyles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -10,
  },
  content: {
    paddingHorizontal: 10,
    paddingBottom: 42,
  },
  list: {
    backgroundColor: Colors.white,
    margin: 10,
    borderRadius: 22,
    overflow: "hidden",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  avatar: {
    width: POST_AVATAR_SIZE,
    height: POST_AVATAR_SIZE,
    borderRadius: POST_AVATAR_SIZE * 0.5,
    marginRight: 8,
  },
  name: {
    bottom: -1,
  },
  username: {
    top: -1,
  },
  postContent: {
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  empty: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
  },
});

const postImagesStyles = StyleSheet.create({
  container: {
    width: WINDOW_WIDTH - 40,
    height: WINDOW_WIDTH - 56,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  imagesWrapper: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: WINDOW_WIDTH - 72,
    height: WINDOW_WIDTH - 72,
  },
});

const postActionsBarStyles = StyleSheet.create({
  container1: {
    padding: 12,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white + Colors.o90,
  },
  container2: {
    padding: 16,
    backgroundColor: Colors.p30,
    marginTop: 16,
  },
  gap: {
    marginTop: 16,
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  row1: {
    flexDirection: "row",
    alignItems: "center",
  },
  row2: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },
  iconWithNumber: {
    marginLeft: 8,
  },
});

export default HomeScreen;
