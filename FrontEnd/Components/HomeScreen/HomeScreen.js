import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import BookList from "./BookList";

const HomeScreen = () => {
  const navigation = useNavigation(); // Sử dụng useNavigation bên trong component

  // Hàm xử lý LogOut
  const handleLogout = async () => {
    try {
      // Xóa token và role khỏi AsyncStorage
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userRole');
      Alert.alert("Log out successfully!", "You're logged out successfully!");
      
      // Kiểm tra lại xem token đã bị xóa chưa
      const token = await AsyncStorage.getItem('userToken');
      const role = await AsyncStorage.getItem('userRole');
      console.log("Token sau khi đăng xuất:", token); // Sẽ in ra null nếu token đã bị xóa
      console.log("Role sau khi đăng xuất:", role);   // Sẽ in ra null nếu role đã bị xóa
      // Điều hướng trở lại trang Login
      
      navigation.navigate("Login");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.text}>Chào mừng đến với Home Screen</Text> */}

      {/* Nút điều hướng đến BookList */}
      {/* <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('BookList')}>
        <Text style={styles.logoutText}>Book List</Text>
      </TouchableOpacity> */}

      <BookList />

      {/* Nút LogOut */}
      {/* <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity> */}
      {/* <TouchableOpacity
        style={styles.outlineCartBtn}
        onPress={() => navigation.navigate("Cart")}
      >
        <Image
          style={styles.cartIcon}
          source={require("../../assets/Images/onboarding/icons8-shopping-cart-96.png")}
        />
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#FF9933",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
  },
  cartIcon: {
    width: 30,
    height: 30,
  },
  outlineCartBtn: {
    position: "absolute",
    top: 460,
    right: 30,
  },
});

export default HomeScreen;
