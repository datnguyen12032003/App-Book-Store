import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import axios from "../../../axiosConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      console.log("Retrieved Token:", token);

      if (token) {
        const response = await axios.get("/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } else {
        console.error("No token found");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  // Hàm xử lý LogOut
  const handleLogout = async () => {
    try {
      // Xóa token và role khỏi AsyncStorage
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userRole");
      Alert.alert("Logout successfully!", "You're logged out successfully!");

      // Kiểm tra lại xem token đã bị xóa chưa
      const token = await AsyncStorage.getItem("userToken");
      const role = await AsyncStorage.getItem("userRole");
      console.log("Token sau khi đăng xuất:", token); // Sẽ in ra null nếu token đã bị xóa
      console.log("Role sau khi đăng xuất:", role); // Sẽ in ra null nếu role đã bị xóa
      // Điều hướng trở lại trang Login

      navigation.navigate("Login");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  const handleUpdateProfile = () => {
    navigation.navigate("UpdateProfile");
  };

  const handleChangePassword = () => {
    navigation.navigate("ChangePassword");
  };

  const handleHistoryPurchase = () => {
    navigation.navigate("HistoryPurchase");
  };

  return (
    <View style={styles.container}>
      {userData ? (
        <ScrollView contentContainerStyle={styles.profileContainer}>
          <Text style={styles.title}>Profile</Text>
          <Image
            source={{
              uri: "https://th.bing.com/th/id/R.677d3abf75ddc6139ac411467c792eef?rik=Lqi7AtlZe%2fFXbw&pid=ImgRaw&r=0",
            }}
            style={styles.profileImage}
          />
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Full Name:</Text>
            <Text style={styles.info}>{userData.fullname}</Text>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.info}>{userData.email}</Text>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.info}>{userData.phone}</Text>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.info}>{userData.address}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleUpdateProfile}
            >
              <Text style={styles.buttonText}>Update Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={handleChangePassword}
            >
              <Text style={styles.buttonText}>Change Password</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleHistoryPurchase}
            >
              <Text style={styles.buttonText}>History Purchase</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
              <Text style={styles.buttonText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  profileContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    minHeight: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: "center",
    marginBottom: 16,
  },
  infoContainer: {
    marginTop: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  info: {
    fontSize: 16,
    marginBottom: 12,
    color: "#555",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
    display: "flex",
    gap: 5
  },
  historyButtonContainer: {
    marginTop: 20, // Add some margin for spacing
    alignItems: "center", // Center the History Purchase button
  },
  button: {
    backgroundColor: "#FF8C00",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    width: 150
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Profile;
