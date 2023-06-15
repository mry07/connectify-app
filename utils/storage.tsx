import AsyncStorage from "@react-native-async-storage/async-storage";

export const storageSet = (k, v) => {
  const json = JSON.stringify(v);
  AsyncStorage.setItem(k, json);
};

export const storageGet = async (k) => {
  const value = await AsyncStorage.getItem(k);
  return value && JSON.parse(value);
};

export const storageGetAllKey = async () => {
  const keys = await AsyncStorage.getAllKeys();
  const values = await AsyncStorage.multiGet(keys);
  const result = {};

  values.forEach(([key, value]) => {
    result[key] = value;
  });

  if (__DEV__) console.log(result);

  return result;
};

export const storageClear = async (except: string[]) => {
  try {
    if (except.length > 0) {
      const keys = await AsyncStorage.getAllKeys();
      const keysToRemove = keys.filter((key) => !except.includes(key));
      await AsyncStorage.multiRemove(keysToRemove);
    } else {
      await AsyncStorage.clear();
    }

    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};
