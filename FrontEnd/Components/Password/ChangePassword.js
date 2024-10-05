import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import axios from "../../axiosConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
const ChangePassword = ({ navigation }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Toast.show({
        type: "info",
        text1: "All fields are required",
        style: { borderLeftColor: "#F44336", borderLeftWidth: 5 },
        text1Style: { fontSize: 16, fontWeight: "bold" },
        text2Style: { fontSize: 16 },
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      Toast.show({
        type: "info",
        text1: "Password not match",
        style: { borderLeftColor: "#F44336", borderLeftWidth: 5 },
        text1Style: { fontSize: 16, fontWeight: "bold" },
        text2Style: { fontSize: 16 },
      });
      return;
    }

    const token = await AsyncStorage.getItem("userToken");
    try {
      await axios.post(
        "/api/users/changePassword",
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Toast.show({
        type: "success",
        text1: "Password updated successfully",
        style: { borderLeftColor: "#F44336", borderLeftWidth: 5 },
        text1Style: { fontSize: 16, fontWeight: "bold" },
        text2Style: { fontSize: 16 },
      });
      navigation.goBack();
    } catch (error) {
      console.error("Error changing password:", error);
      Toast.show({
        type: "error",
        text1: "Password updated failed",
        style: { borderLeftColor: "#F44336", borderLeftWidth: 5 },
        text1Style: { fontSize: 16, fontWeight: "bold" },
        text2Style: { fontSize: 16 },
      });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Old Password"
        value={oldPassword}
        onChangeText={setOldPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Change Password</Text>
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
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});

export default ChangePassword;
