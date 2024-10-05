import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import axios from "../../../axiosConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation(); // Khai báo useNavigation

  // Định nghĩa fetchData ngoài useEffect
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

  // Gọi fetchData khi component được hiển thị
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const handleUpdateProfile = () => {
    navigation.navigate("UpdateProfile");
  };

  const handleChangePassword = () => {
    navigation.navigate("ChangePassword");
  };

  return (
    <View style={styles.container}>
      {userData ? (
        <ScrollView contentContainerStyle={styles.profileContainer}>
          <Text style={styles.title}>Profile</Text>
          <Image
            source={{ uri: "https://via.placeholder.com/150" }}
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
    justifyContent: "space-between",
    marginTop: 20,
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
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Profile;
