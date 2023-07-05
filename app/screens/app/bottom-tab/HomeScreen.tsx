/** **************************************************************************************************** */

// PHASE 2

import React from "react";
import Colors from "../../../constants/colors";
import CommentsModal from "./home/__modals__/CommentsModal";
import * as Common from "../../../components/common";
import { FontWeight } from "../../../components/common/Text";
import { IconPrefix } from "@fortawesome/fontawesome-svg-core";
import { abortSignal } from "../../../../utils/api";
import { UserContext } from "../../../../contexts/user-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { MaterialIndicator } from "react-native-indicators";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, StyleSheet, Pressable, Image, FlatList } from "react-native";
import Animated, {
  interpolate,
  useSharedValue,
  interpolateColor,
  useAnimatedStyle,
  useAnimatedScrollHandler,
} from "react-native-reanimated";

const AVATAR_SIZE = 46;
const POST_AVATAR_SIZE = 42;
const HEADER_HEIGHT = AVATAR_SIZE + 12 * 2;

/** ********************************************************************** */

// COMPONENT

const HomeScreen = () => {
  const { userDetails } = React.useContext(UserContext);

  const [measurePost, setMeasurePost] = React.useState(null);
  const [showComment, setShowComment] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [postId, setPostId] = React.useState(0);
  const [data, setData] = React.useState([]);

  /** **************************************** */

  // effect

  React.useEffect(() => {
    if (userDetails) {
      (async () => {
        try {
          const { data: json } = await my.api.app.post("post/get-posts");
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
    }
  }, [userDetails]);

  /** **************************************** */

  // function

  const handleShowComment = (id: number) => {
    setPostId(id);
    setShowComment(true);
  };

  const onFollow = async (userId, recursive = false) => {
    setData((s) => {
      let flag = false;

      return s.map((e) => {
        if (e.user_id !== userId) {
          return e;
        }

        const result = { ...e };
        result.is_followed = !result.is_followed;

        if (!flag && !recursive) {
          flag = true;
          my.api.app
            .post("user/follow-unfollow", {
              user_id: result.user_id,
              follow: result.is_followed,
            })
            .then(({ data: json }) => {
              if (json.status !== "ok" && json.status !== "dev_error") {
                onFollow(result.user_id, true);
              } else {
                if (
                  json.status === "dev_error" &&
                  json.error_code === "missing_parameters"
                ) {
                  onFollow(result.user_id, true);
                }
              }
            })
            .catch((error) => {
              if (__DEV__) {
                console.log(error);
              }

              onFollow(result.user_id, true);
            });
        }

        return result;
      });
    });
  };

  const onMeasurePost = React.useCallback((e) => {
    if (!measurePost) {
      setMeasurePost(e.nativeEvent.layout);
    }
  }, []);

  /** **************************************** */

  // render

  const renderPost = React.useCallback(
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

            {item.user_id !== userDetails?.id && (
              <Common.Button
                style={[postStyles.buttonFollow, { borderColor: buttonColor }]}
                titleStyle={buttonTitleStyle}
                title={buttonTitle}
                size="small"
                onPress={() => onFollow(item.user_id)}
              />
            )}
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
      <Header />

      {loading ? (
        <MaterialIndicator color={Colors.p30} />
      ) : !!data.length ? (
        <View style={styles.container}>
          <FlatList
            contentContainerStyle={postStyles.content}
            data={data}
            showsVerticalScrollIndicator={false}
            renderItem={renderPost}
          />
        </View>
      ) : (
        <Common.Text style={postStyles.empty} weight="500">
          No Posts
        </Common.Text>
      )}

      <CommentsModal
        visible={showComment}
        postId={postId}
        onRequestClose={() => setShowComment(false)}
      />
    </View>
  );
};

const Header = () => {
  const { userDetails } = React.useContext(UserContext);

  const insets = useSafeAreaInsets();
  const uri = my.url.uploads.avatars + userDetails?.avatar;

  return (
    <View style={[headerStyles.container, { marginTop: insets.top }]}>
      <Image style={headerStyles.avatar} source={{ uri }} />
      <View>
        <Common.Text style={headerStyles.name} size={18} weight="700">
          Hi, {userDetails?.name.split(" ")[0]} 👋
        </Common.Text>
        <Common.Text style={headerStyles.username}>
          @{userDetails?.username}
        </Common.Text>
      </View>
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

/** ********************************************************************** */

// STYLE

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: HEADER_HEIGHT,
    paddingHorizontal: 16,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE * 0.5,
    marginRight: 12,
  },
  name: {
    bottom: -2,
  },
  username: {
    top: -2,
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

export default HomeScreen;

/** **************************************************************************************************** */

// PHASE 1

// import React from "react";
// import Colors from "../../../constants/colors";
// import CommentsModal from "./home/__modals__/CommentsModal";
// import * as Common from "../../../components/common";
// import { FlashList } from "@shopify/flash-list";
// import { IconPrefix } from "@fortawesome/fontawesome-svg-core";
// import { abortSignal } from "../../../../utils/api";
// import { UserContext } from "../../../../contexts/user-context";
// import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
// import { MaterialIndicator } from "react-native-indicators";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { View, StyleSheet, Pressable, Image } from "react-native";

// const AVATAR_SIZE = 46;
// const POST_AVATAR_SIZE = 43;

// /** ********************************************************************** */

// // COMPONENT

// const HomeScreen = () => {
//   const { userDetails } = React.useContext(UserContext);

//   const [showComment, setShowComment] = React.useState(false);
//   const [loading, setLoading] = React.useState(true);
//   const [postId, setPostId] = React.useState(0);
//   const [data, setData] = React.useState([]);

//   const insets = useSafeAreaInsets();

//   /** **************************************** */

//   // effect

//   React.useEffect(() => {
//     if (userDetails) {
//       (async () => {
//         try {
//           const { data: json } = await my.api.app.post("post/get-posts");
//           if (json.status === "ok") {
//             setData(json.data);
//           }
//         } catch (error) {
//           if (__DEV__) {
//             console.log(error);
//           }
//         } finally {
//           setLoading(false);
//         }
//       })();
//     }
//   }, [userDetails]);

//   /** **************************************** */

//   // function

//   const handleShowBottomSheet = React.useCallback((id: number) => {
//     setShowComment(true);
//     setPostId(id);
//   }, []);

//   const onFollow = async (userId, recursive = false) => {
//     setData((s) => {
//       let flag = false;

//       return s.map((e) => {
//         if (e.user_id !== userId) {
//           return e;
//         }

//         const result = { ...e };
//         result.is_followed = !result.is_followed;

//         if (!flag && !recursive) {
//           flag = true;
//           my.api.app
//             .post("user/follow-unfollow", {
//               user_id: result.user_id,
//               follow: result.is_followed,
//             })
//             .then(({ data: json }) => {
//               if (json.status !== "ok" && json.status !== "dev_error") {
//                 onFollow(result.user_id, true);
//               } else {
//                 if (
//                   json.status === "dev_error" &&
//                   json.error_code === "missing_parameters"
//                 ) {
//                   onFollow(result.user_id, true);
//                 }
//               }
//             })
//             .catch((error) => {
//               if (__DEV__) {
//                 console.log(error);
//               }

//               onFollow(result.user_id, true);
//             });
//         }

//         return result;
//       });
//     });
//   };

//   /** **************************************** */

//   // render

//   const renderImage = React.useCallback(({ item }) => {
//     return (
//       <Image
//         style={postImagesStyles.image}
//         source={{ uri: my.url.uploads.posts + item.image }}
//       />
//     );
//   }, []);

//   const renderItem = React.useCallback(({ item }) => {
//     return (
//       <View style={listStyles.list}>
//         <View style={listStyles.postHeader}>
//           <View style={{ flexDirection: "row", alignItems: "center" }}>
//             <Image
//               style={listStyles.avatar}
//               source={{ uri: my.url.uploads.avatars + item.avatar }}
//             />
//             <View>
//               <Common.Text style={listStyles.name} size={14} weight="600">
//                 {item.name}
//               </Common.Text>
//               <Common.Text style={listStyles.username} size={12}>
//                 @{item.username}
//               </Common.Text>
//             </View>
//           </View>

//           {item.user_id !== userDetails?.id && (
//             <Common.Button
//               style={{
//                 borderRadius: 8,
//                 backgroundColor: "transparent",
//                 borderWidth: 1,
//                 borderColor: item.is_followed ? Colors.red400 : Colors.p30,
//               }}
//               titleStyle={{
//                 color: item.is_followed ? Colors.red400 : Colors.p30,
//                 weight: "600",
//               }}
//               title={item.is_followed ? "Batal" : "Ikuti"}
//               size="small"
//               onPress={() => onFollow(item.user_id)}
//             />
//           )}
//         </View>

//         {!!item.post_content && (
//           <Common.Text style={listStyles.postContent}>
//             {item.post_content}
//           </Common.Text>
//         )}

//         {!!item.post_images.length && (
//           <View style={postImagesStyles.container}>
//             <View style={postImagesStyles.imagesWrapper}>
//               <FlashList
//                 data={item.post_images}
//                 horizontal
//                 pagingEnabled
//                 showsHorizontalScrollIndicator={false}
//                 estimatedItemSize={WINDOW_WIDTH}
//                 renderItem={renderImage}
//               />

//               <PostActionsBar
//                 data={item}
//                 type="images"
//                 setData={setData}
//                 onComment={() => handleShowBottomSheet(item.id)}
//               />
//             </View>
//           </View>
//         )}

//         <PostActionsBar
//           data={item}
//           type="content"
//           setData={setData}
//           onComment={() => handleShowBottomSheet(item.id)}
//         />
//       </View>
//     );
//   }, []);

//   return (
//     <View style={styles.container}>
//       <View style={[styles.statusBar, { paddingTop: insets.top }]}>
//         <View style={styles.header}>
//           <Image
//             style={styles.profile}
//             source={{ uri: my.url.uploads.avatars + userDetails?.avatar }}
//           />
//           <Common.Text size={18} weight="700">
//             Hi, {userDetails?.name.split(" ")[0]} 👋
//           </Common.Text>
//         </View>
//       </View>

//       {loading ? (
//         <MaterialIndicator color={Colors.p30} />
//       ) : data.length > 0 ? (
//         <View style={listStyles.container}>
//           <FlashList
//             contentContainerStyle={listStyles.content}
//             data={data}
//             estimatedItemSize={WINDOW_WIDTH}
//             showsVerticalScrollIndicator={false}
//             renderItem={renderItem}
//           />
//         </View>
//       ) : (
//         <Common.Text style={listStyles.empty} weight="500">
//           No Posts
//         </Common.Text>
//       )}

//       <CommentsModal
//         visible={showComment}
//         postId={postId}
//         onRequestClose={() => setShowComment(false)}
//       />
//     </View>
//   );
// };

// const PostActionsBar = (props) => {
//   if (props.type === "images") {
//     return (
//       <View style={postActionsBarStyles.container1}>
//         <PostActions {...props} />
//       </View>
//     );
//   }

//   if (props.type === "content") {
//     if (props.data.post_images.length < 1) {
//       return (
//         <View style={postActionsBarStyles.container2}>
//           <PostActions {...props} />
//         </View>
//       );
//     }

//     return <View style={postActionsBarStyles.gap} />;
//   }
// };

// const PostActions = ({ data, type, setData, onComment }) => {
//   /** **************************************** */

//   // function

//   const onLikeDislike = async (action, recursive = false) => {
//     setData((s) => {
//       return s.map((e) => {
//         if (e.id !== data.id) {
//           return e;
//         }

//         const result = { ...e };

//         if (action === "liked") {
//           if (e.is_disliked) {
//             result.is_disliked = false;
//             result.dislikes -= 1;
//           }
//           result.is_liked = !e.is_liked;
//           result.likes += result.is_liked ? +1 : -1;
//         }

//         if (action === "disliked") {
//           if (e.is_liked) {
//             result.is_liked = false;
//             result.likes -= 1;
//           }
//           result.is_disliked = !e.is_disliked;
//           result.dislikes += result.is_disliked ? +1 : -1;
//         }

//         if (!recursive) {
//           my.api.app
//             .post(
//               "post/like-dislike",
//               {
//                 post_id: result.id,
//                 like: result.is_liked,
//                 dislike: result.is_disliked,
//               },
//               {
//                 signal: abortSignal(5000),
//               }
//             )
//             .then(({ data: json }) => {
//               if (json.status !== "ok") {
//                 onLikeDislike(action, true);
//               }
//             })
//             .catch((error) => {
//               if (__DEV__) {
//                 console.error(error);
//               }

//               onLikeDislike(action, true);
//             });
//         }

//         return result;
//       });
//     });
//   };

//   /** **************************************** */

//   // render

//   const actions = React.useMemo(() => {
//     if (type === "images") {
//       return {
//         color: Colors.p101,
//         iconType: "far",
//       };
//     }

//     return {
//       color: Colors.white,
//       iconType: "far",
//     };
//   }, []);

//   const liked = React.useMemo(() => {
//     if (data.is_liked) {
//       return {
//         color: Colors.p102,
//         iconType: "fas",
//       };
//     }

//     return actions;
//   }, [data.is_liked]);

//   const disliked = React.useMemo(() => {
//     if (data.is_disliked) {
//       return {
//         color: Colors.p102,
//         iconType: "fas",
//       };
//     }

//     return actions;
//   }, [data.is_disliked]);

//   return (
//     <View style={postActionsBarStyles.wrapper}>
//       <Pressable
//         style={{
//           paddingHorizontal: 16,
//           paddingVertical: type === "images" ? 12 : 16,
//         }}
//         onPress={() => onComment(data.id)}
//       >
//         <FontAwesomeIcon
//           icon={["fas", "comment"]}
//           size={18}
//           color={actions.color}
//         />
//       </Pressable>
//       <View style={postActionsBarStyles.row1}>
//         <Pressable
//           style={[
//             postActionsBarStyles.row2,
//             { paddingVertical: type === "images" ? 12 : 16 },
//           ]}
//           onPress={() => onLikeDislike("disliked")}
//         >
//           <Common.Text size={14} weight="600" color={disliked.color}>
//             {data.dislikes}
//           </Common.Text>
//           <FontAwesomeIcon
//             style={postActionsBarStyles.iconWithNumber}
//             icon={[disliked.iconType as IconPrefix, "thumbs-down"]}
//             color={disliked.color}
//             size={18}
//           />
//         </Pressable>
//         <Pressable
//           style={[
//             postActionsBarStyles.row2,
//             { paddingVertical: type === "images" ? 12 : 16 },
//           ]}
//           onPress={() => onLikeDislike("liked")}
//         >
//           <Common.Text size={14} weight="600" color={liked.color}>
//             {data.likes}
//           </Common.Text>
//           <FontAwesomeIcon
//             style={postActionsBarStyles.iconWithNumber}
//             icon={[liked.iconType as IconPrefix, "thumbs-up"]}
//             color={liked.color}
//             size={18}
//           />
//         </Pressable>
//       </View>
//     </View>
//   );
// };

// /** ********************************************************************** */

// // STYLE

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 24,
//     paddingVertical: 16,
//     backgroundColor: Colors.p60,
//   },
//   profile: {
//     marginRight: 14,
//     width: AVATAR_SIZE,
//     height: AVATAR_SIZE,
//     borderRadius: AVATAR_SIZE * 0.5,
//   },
//   statusBar: {
//     zIndex: 1,
//   },
// });

// const listStyles = StyleSheet.create({
//   container: {
//     flex: 1,
//     marginTop: -10,
//   },
//   content: {
//     paddingHorizontal: 10,
//     paddingBottom: 42,
//   },
//   list: {
//     backgroundColor: Colors.white,
//     margin: 10,
//     borderRadius: 22,
//     overflow: "hidden",
//   },
//   postHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingTop: 16,
//     paddingHorizontal: 16,
//   },
//   avatar: {
//     width: POST_AVATAR_SIZE,
//     height: POST_AVATAR_SIZE,
//     borderRadius: POST_AVATAR_SIZE * 0.5,
//     marginRight: 8,
//   },
//   name: {
//     bottom: -1,
//   },
//   username: {
//     top: -1,
//   },
//   postContent: {
//     paddingTop: 16,
//     paddingHorizontal: 16,
//   },
//   empty: {
//     flex: 1,
//     textAlign: "center",
//     textAlignVertical: "center",
//   },
// });

// const postImagesStyles = StyleSheet.create({
//   container: {
//     width: WINDOW_WIDTH - 40,
//     height: WINDOW_WIDTH - 56,
//     paddingTop: 16,
//     paddingHorizontal: 16,
//   },
//   imagesWrapper: {
//     flex: 1,
//     borderRadius: 12,
//     overflow: "hidden",
//   },
//   image: {
//     width: WINDOW_WIDTH - 72,
//     height: WINDOW_WIDTH - 72,
//   },
// });

// const postActionsBarStyles = StyleSheet.create({
//   container1: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: Colors.white + Colors.o90,
//   },
//   container2: {
//     backgroundColor: Colors.p30,
//     marginTop: 16,
//   },
//   gap: {
//     marginTop: 16,
//   },
//   wrapper: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   row1: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 8,
//   },
//   row2: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 8,
//   },
//   iconWithNumber: {
//     marginLeft: 8,
//   },
// });

// export default HomeScreen;
