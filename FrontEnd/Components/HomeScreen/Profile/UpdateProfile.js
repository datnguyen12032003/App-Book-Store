import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import axios from "../../../axiosConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const UpdateProfile = ({ navigation }) => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem("userToken");
      const response = await axios.get("/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFullname(response.data.fullname);
      setEmail(response.data.email);
      setPhone(response.data.phone);
      setAddress(response.data.address);
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!fullname || !email || !phone || !address) {
      Toast.show({
        type: "error",
        text1: "All fields are required",
        style: { borderLeftColor: "#F44336", borderLeftWidth: 5 },
        text1Style: { fontSize: 16, fontWeight: "bold" },
        text2Style: { fontSize: 16 },
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Toast.show({
        type: "error",
        text1: "Please enter a valid email address",
        style: { borderLeftColor: "#F44336", borderLeftWidth: 5 },
        text1Style: { fontSize: 16, fontWeight: "bold" },
        text2Style: { fontSize: 16 },
      });
      return;
    }

    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phone)) {
      Toast.show({
        type: "error",
        text1: "Phone number must be 10 or 11 digits.",
        style: { borderLeftColor: "#F44336", borderLeftWidth: 5 },
        text1Style: { fontSize: 16, fontWeight: "bold" },
        text2Style: { fontSize: 16 },
      });
      return;
    }

    const token = await AsyncStorage.getItem("userToken");
    console.log("Retrieved Token:", token);
    try {
      await axios.post(
        "/api/users/editProfile",
        {
          fullname,
          email,
          phone,
          address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Toast.show({
        type: "success",
        text1: "Profile updated successfully",
        style: { borderLeftColor: "#F44336", borderLeftWidth: 5 },
        text1Style: { fontSize: 16, fontWeight: "bold" },
        text2Style: { fontSize: 16 },
      });
      navigation.goBack();
    } catch (error) {
      console.error(
        "Error updating profile:",
        error.response ? error.response.data : error.message
      );

      Alert.alert("Error updating profile");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullname}
        onChangeText={setFullname}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#FF8C00",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});

export default UpdateProfile;
