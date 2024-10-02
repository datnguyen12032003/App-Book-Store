import AsyncStorage from '@react-native-async-storage/async-storage';

// Khóa token và thông tin người dùng
export const AUTH_KEY = 'AUTH_TOKEN';
export const USER_KEY = 'USER_KEY';

// Lấy đối tượng theo KEY từ AsyncStorage
export const getObjectByKey = async (KEY) => {
  try {
    const value = await AsyncStorage.getItem(KEY);
    return value;
  } catch (error) {
    console.error('Error retrieving data from AsyncStorage', error);
    return null;
  }
};

// Lưu đối tượng theo KEY vào AsyncStorage
export const setObjectByKey = async (KEY, VAL) => {
  try {
    await AsyncStorage.setItem(KEY, VAL);
  } catch (error) {
    console.error('Error saving data to AsyncStorage', error);
  }
};

// Xóa đối tượng theo KEY khỏi AsyncStorage
export const removeObjectByKey = async (KEY) => {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch (error) {
    console.error('Error removing data from AsyncStorage', error);
  }
};

// Lấy token từ AsyncStorage
export const getToken = async () => {
  return await getObjectByKey(AUTH_KEY);
};

// Lưu token vào AsyncStorage
export const setToken = async (token) => {
  await setObjectByKey(AUTH_KEY, token);
};

// Xóa token khỏi AsyncStorage
export const removeToken = async () => {
  await removeObjectByKey(AUTH_KEY);
};

// Lấy thông tin người dùng từ AsyncStorage
export const getUserInfo = async () => {
  const userInfo = await getObjectByKey(USER_KEY);
  return userInfo ? JSON.parse(userInfo) : null;
};

// Lưu thông tin người dùng vào AsyncStorage
export const setUserInfo = async (info) => {
  await setObjectByKey(USER_KEY, JSON.stringify(info));
};

// Xóa thông tin người dùng khỏi AsyncStorage
export const removeUserInfo = async () => {
  await removeObjectByKey(USER_KEY);
};
