import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';


const HomeAdmin = () => {
  const navigation = useNavigation();

  

  // Hàm xử lý đăng xuất
  
  const handleLogout = async () => {
    try {
      // Xóa token và role khỏi AsyncStorage
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userRole');
      Alert.alert("Log out successfully!", "Logged out successfully!");
      
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
      <StatusBar backgroundColor={"black"} barStyle="dark-content" />
     
      <Text style={styles.title}>Admin Dashboard</Text>

      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* Các nút chức năng */}
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('UserManagement')}>
          <Ionicons name="people" size={32} color="#000" />
          <Text style={styles.cardText}>User Management</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('BookListAdmin')}>
          <Ionicons name="cube" size={32} color="#000" />
          <Text style={styles.cardText}>Book Management</Text>
        </TouchableOpacity>
        
        {/* <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('CreateBookScreen')}>
          <Ionicons name="create" size={32} color="#000" />
          <Text style={styles.cardText}>Thêm Sản Phẩm</Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('OrderManagement')}>
          <Ionicons name="receipt" size={32} color="#000" />
          <Text style={styles.cardText}>Order management</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('StatisticAdmin')}>
          <Ionicons name="bar-chart" size={32} color="#000" />
          <Text style={styles.cardText}>Statistics</Text>
        </TouchableOpacity>

        {/* Thay Cài đặt bằng LogOut */}
        <TouchableOpacity style={styles.card} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={32} color="#000" />
          <Text style={styles.cardText}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  backButton: {
    position: "absolute",
    top: 12,
    left: 10,
    zIndex: 1,
    padding: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 50,
    color: "#333",
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
    color: "#333",
  },
});

export default HomeAdmin;
