import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const navigation = useNavigation(); // Sử dụng useNavigation bên trong component

  

  // Hàm xử lý LogOut
  const handleLogout = async () => {
    try {
      // Xóa token và role khỏi AsyncStorage
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userRole');
      Alert.alert("Đăng xuất thành công", "Bạn đã đăng xuất thành công.");
      
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
      <Text style={styles.text}>Chào mừng đến với Home Screen</Text>

      {/* Nút LogOut */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
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
  backButton: {
    position: "absolute",
    top: 12,
    left: 10,
    zIndex: 1,
    padding: 10,
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
});

export default HomeScreen;
