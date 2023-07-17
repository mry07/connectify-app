import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  FlatList,
} from "react-native";
import React from "react";
import Colors from "../../../constants/colors";
import * as Common from "../../../components/common";
import { AuthContext } from "../../../../contexts/auth-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { UserContext } from "../../../../contexts/user-context";
import { FontWeight } from "../../../components/common/Text";
import Animated, {
  interpolate,
  useSharedValue,
  interpolateColor,
  useAnimatedStyle,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import { abortSignal } from "../../../../utils/api";
import { IconPrefix } from "@fortawesome/fontawesome-svg-core";
import CommentsModal from "./home/__modals__/CommentsModal";

const AVATAR_SIZE = WINDOW_WIDTH * 0.3;
const BUTTON_LOGOUT = 46;
const HEADER_HEIGHT = BUTTON_LOGOUT + 16 * 2;
const POST_AVATAR_SIZE = 42;

const ProfileScreen = () => {
  const { userDetails } = React.useContext(UserContext);
  const { logout } = React.useContext(AuthContext);

  const [measurePost, setMeasurePost] = React.useState(null);
  const [showComment, setShowComment] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [postId, setPostId] = React.useState(0);
  const [data, setData] = React.useState([]);

  const insets = useSafeAreaInsets();

  React.useEffect(() => {
    (async () => {
      const { data: json } = await my.api.app.get("user/get-posts");
      if (json.status === "ok") {
        setData(json.data);
      }
    })();
  }, []);

  const onMeasurePost = React.useCallback((e) => {
    if (!measurePost) {
      setMeasurePost(e.nativeEvent.layout);
    }
  }, []);

  const handleShowComment = (id: number) => {
    setPostId(id);
    setShowComment(true);
  };

  const listHeader = React.useCallback(() => {
    const uri = my.url.uploads.avatars + userDetails?.avatar;

    return (
      <View style={{ marginVertical: 32 }}>
        <Image
          source={{ uri }}
          style={{
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
            resizeMode: "contain",
            alignSelf: "center",
            marginBottom: 18,
          }}
        />

        <Common.Text align="center" size={20} weight="600">
          @{userDetails.username}
        </Common.Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 18,
          }}
        >
          <View style={{ flex: 1, alignItems: "center" }}>
            <Common.Text size={16} weight="600">
              {userDetails.following}
            </Common.Text>
            <Common.Text
              size={12}
              weight="500"
              color={Colors.p101 + Colors.o50}
            >
              Mengikuti
            </Common.Text>
          </View>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Common.Text size={16} weight="600">
              {userDetails.followers}
            </Common.Text>
            <Common.Text
              size={12}
              weight="500"
              color={Colors.p101 + Colors.o50}
            >
              Pengikut
            </Common.Text>
          </View>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Common.Text size={16} weight="600">
              {userDetails.posts}
            </Common.Text>
            <Common.Text
              size={12}
              weight="500"
              color={Colors.p101 + Colors.o50}
            >
              Posting
            </Common.Text>
          </View>
        </View>
      </View>
    );
  }, [userDetails]);

  const renderItem = React.useCallback(
    ({ item }) => {
      const uri = my.url.uploads.avatars + item.avatar;
      const buttonColor = item.is_followed ? Colors.red400 : Colors.p30;
      const buttonTitle = item.is_followed ? "Batal" : "Ikuti";
      const buttonTitleStyle = {
        color: buttonColor,
        weight: "600" as FontWeight,
      };

      return (
        <View style={postStyles.list} onLayout={onMeasurePost}>
          <View style={postStyles.wrap}>
            <View style={postStyles.row}>
              <Image style={postStyles.avatar} source={{ uri }} />
              <View>
                <Common.Text style={postStyles.name} size={14} weight="600">
                  {item.name}
                </Common.Text>
                <Common.Text style={postStyles.username} size={12}>
                  @{item.username}
                </Common.Text>
              </View>
            </View>
          </View>

          {!!item.post_content && (
            <Common.Text style={postStyles.postContent}>
              {item.post_content}
            </Common.Text>
          )}

          <PostImages data={item.post_images} measureLayout={measurePost} />

          <PostActions
            data={item}
            setData={setData}
            onComment={handleShowComment}
          />
        </View>
      );
    },
    [measurePost]
  );

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          height: HEADER_HEIGHT,
          paddingHorizontal: 16,
          marginTop: insets.top,
        }}
      >
        <Common.Text size={18} weight="700">
          User Test
        </Common.Text>
        <Pressable
          style={{
            backgroundColor: Colors.red400 + Colors.o15,
            width: BUTTON_LOGOUT,
            height: BUTTON_LOGOUT,
            borderRadius: BUTTON_LOGOUT * 0.5,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={logout}
        >
          <FontAwesomeIcon
            icon="arrow-right-from-bracket"
            size={18}
            color={Colors.red400}
          />
        </Pressable>
      </View>

      <FlatList
        data={data}
        keyExtractor={(_, i) => `key-${i}`}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
      />

      <CommentsModal
        visible={showComment}
        postId={postId}
        onRequestClose={() => setShowComment(false)}
      />
    </View>
  );
};

const PostImages = ({ data, measureLayout }) => {
  const transX = useSharedValue(0);

  /** **************************************** */

  // function

  const scrollHandler = useAnimatedScrollHandler((e) => {
    transX.value = e.contentOffset.x;
  });

  /** **************************************** */

  // render

  const renderImage = React.useCallback(
    ({ item }) => {
      const uri = my.url.uploads.posts + item.image;

      const imageStyle = {
        width: measureLayout?.width || 0,
        height: measureLayout?.width || 0,
      };

      return <Image style={imageStyle} source={{ uri }} />;
    },
    [measureLayout]
  );

  if (!data.length || !measureLayout) {
    return null;
  }

  return (
    <View style={postImageStyles.container}>
      <Animated.FlatList
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        renderItem={renderImage}
      />

      <PostImagesIndicator
        data={data}
        transX={transX}
        measureLayout={measureLayout}
      />
    </View>
  );
};

const PostImagesIndicator = ({ data, transX, measureLayout }) => {
  if (data.length < 2) {
    return null;
  }

  return (
    <View style={postImageStyles.indicatorContainer}>
      {data.map((_, i) => {
        const animatedIndicatorStyle = useAnimatedStyle(() => {
          const inputRange = data.map((_, j) => measureLayout.width * j);
          const widthRange = data.map((_, j) => (i === j ? 13.5 : 4.5));
          const backgroundColorRange = data.map((_, j) =>
            i === j ? Colors.p102 : Colors.white + Colors.o50
          );

          const width = interpolate(transX.value, inputRange, widthRange);
          const backgroundColor = interpolateColor(
            transX.value,
            inputRange,
            backgroundColorRange
          );

          return { width, backgroundColor };
        }, []);

        return (
          <Animated.View
            key={i}
            style={[postImageStyles.indicator, animatedIndicatorStyle]}
          />
        );
      })}
    </View>
  );
};

const PostActions = ({ data, setData, onComment }) => {
  /** **************************************** */

  // function

  const onAction = (type: string) => {
    switch (type) {
      case "like":
      case "dislike":
        handleLikeAndDislike(type, false);
        break;
      case "comment":
        onComment(data.id);
        break;
    }
  };

  const handleLikeAndDislike = (action: string, recursive: boolean) => {
    setData((s) => {
      return s.map((e) => {
        if (e.id !== data.id) {
          return e;
        }

        const result = { ...e };

        if (action === "like") {
          if (e.is_disliked) {
            result.is_disliked = false;
            result.dislikes -= 1;
          }
          result.is_liked = !e.is_liked;
          result.likes += result.is_liked ? +1 : -1;
        }

        if (action === "dislike") {
          if (e.is_liked) {
            result.is_liked = false;
            result.likes -= 1;
          }
          result.is_disliked = !e.is_disliked;
          result.dislikes += result.is_disliked ? +1 : -1;
        }

        if (!recursive) {
          sendRequestLikeDislike(result, action);
        }

        return result;
      });
    });
  };

  const sendRequestLikeDislike = async (data: any, action: string) => {
    try {
      const { data: json } = await my.api.app.post(
        "post/like-dislike",
        {
          post_id: data.id,
          like: data.is_liked,
          dislike: data.is_disliked,
        },
        { signal: abortSignal(5000) }
      );
      if (json.status !== "ok") {
        handleLikeAndDislike(action, true);
      }
    } catch (error) {
      if (__DEV__) {
        console.error(error);
      }

      handleLikeAndDislike(action, true);
    }
  };

  /** **************************************** */

  // render

  const active = React.useMemo(() => {
    return {
      likeColor: data.is_liked ? Colors.p102 : Colors.white,
      dislikeColor: data.is_disliked ? Colors.p102 : Colors.white,
      likeIcon: (data.is_liked ? "fas" : "far") as IconPrefix,
      dislikeIcon: (data.is_disliked ? "fas" : "far") as IconPrefix,
    };
  }, [data.is_liked, data.is_disliked]);

  return (
    <View style={postActionStyles.container}>
      <Pressable
        style={postActionStyles.comment}
        onPress={() => onAction("comment")}
      >
        <FontAwesomeIcon icon="comment" size={18} color={Colors.white} />
      </Pressable>

      <View style={postActionStyles.likeDislikeContainer}>
        <Pressable
          style={postActionStyles.likeDislike}
          onPress={() => onAction("dislike")}
        >
          <Common.Text size={14} weight="600" color={active.dislikeColor}>
            {data.dislikes}
          </Common.Text>
          <FontAwesomeIcon
            style={postActionStyles.likeDislikeCount}
            color={active.dislikeColor}
            icon={[active.dislikeIcon, "thumbs-down"]}
            size={18}
          />
        </Pressable>
        <Pressable
          style={postActionStyles.likeDislike}
          onPress={() => onAction("like")}
        >
          <Common.Text size={14} weight="600" color={active.likeColor}>
            {data.likes}
          </Common.Text>
          <FontAwesomeIcon
            style={postActionStyles.likeDislikeCount}
            color={active.likeColor}
            icon={[active.likeIcon, "thumbs-up"]}
            size={18}
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const postStyles = StyleSheet.create({
  content: {
    paddingBottom: 42,
  },
  list: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 22,
    overflow: "hidden",
  },
  name: {
    bottom: -1,
  },
  username: {
    top: -1,
  },
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: POST_AVATAR_SIZE,
    height: POST_AVATAR_SIZE,
    borderRadius: POST_AVATAR_SIZE * 0.5,
    marginRight: 8,
  },
  postContent: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  buttonFollow: {
    borderRadius: 8,
    backgroundColor: "transparent",
    borderWidth: 1,
  },
  empty: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
  },
});

const postImageStyles = StyleSheet.create({
  container: {
    marginBottom: 2,
  },
  indicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 8,
    left: 0,
    right: 0,
  },
  indicator: {
    height: 4.5,
    borderRadius: 3,
    marginHorizontal: 1,
  },
});

const postActionStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.p30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
  },
  comment: {
    height: "100%",
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  likeDislikeContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    height: "100%",
  },
  likeDislike: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    height: "100%",
  },
  likeDislikeCount: {
    marginLeft: 8,
  },
});

export default ProfileScreen;
