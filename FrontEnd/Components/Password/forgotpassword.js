import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
} from "react-native";
import axios from "../../axiosConfig";
import Toast from "react-native-toast-message";
import Ionicons from "react-native-vector-icons/Ionicons";
const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleBackPress = () => {
    navigation.goBack();
  };
  const handleForgotPassword = async () => {
    if (!email) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter your email address.",
        style: { borderLeftColor: "#F44336", borderLeftWidth: 5 },
        text1Style: { fontSize: 16, fontWeight: "bold" },
        text2Style: { fontSize: 16 },
      });
      return;
    }

    try {
      const response = await axios.post("/api/users/forgotpassword", { email });
      Toast.show({
        type: "success",
        text1: "OTP has been sent to your email",
        text2: response.data.message,
        style: { borderLeftColor: "#F44336", borderLeftWidth: 5 },
        text1Style: { fontSize: 16, fontWeight: "bold" },
        text2Style: { fontSize: 16 },
      });
      setIsOtpSent(true);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Email may be invalid or not registered",
        text2: error.response?.data?.message || "Something went wrong.",
        style: { borderLeftColor: "#F44336", borderLeftWidth: 5 },
        text1Style: { fontSize: 16, fontWeight: "bold" },
        text2Style: { fontSize: 16 },
      });
    }
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter OTP and new password.",
        style: { borderLeftColor: "#F44336", borderLeftWidth: 5 },
        text1Style: { fontSize: 16, fontWeight: "bold" },
        text2Style: { fontSize: 16 },
      });
      return;
    }

    try {
      const response = await axios.post("/api/users/resetpassword", {
        email,
        otp,
        newPassword,
      });
      Toast.show({
        type: "success",
        text1: "Password recovered successfully",
        text2: "Please log in again",
        style: { borderLeftColor: "#F44336", borderLeftWidth: 5 },
        text1Style: { fontSize: 16, fontWeight: "bold" },
        text2Style: { fontSize: 16 },
      });

      navigation.navigate("Login");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "An error occurred.",
        text2: error.response?.data?.message || "Something went wrong.",
        style: { borderLeftColor: "#F44336", borderLeftWidth: 5 },
        text1Style: { fontSize: 16, fontWeight: "bold" },
        text2Style: { fontSize: 16 },
      });
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/Images/onboarding/background.jpg")}
      resizeMode="cover"
      style={styles.container}
    >
      <StatusBar backgroundColor={"#ffffff"} barStyle="dark-content" />
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.form}>
        <Text style={styles.title}>
          {isOtpSent ? "Reset Password" : "Forgot Password"}
        </Text>

        <TextInput
          placeholder="Enter your email"
          style={styles.input}
          onChangeText={setEmail}
          value={email}
        />

        {isOtpSent && (
          <>
            <TextInput
              placeholder="Enter OTP"
              style={styles.input}
              onChangeText={setOtp}
              value={otp}
            />
            <TextInput
              placeholder="Enter new password"
              style={styles.input}
              secureTextEntry
              onChangeText={setNewPassword}
              value={newPassword}
            />
          </>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={isOtpSent ? handleResetPassword : handleForgotPassword}
        >
          <Text style={styles.buttonText}>
            {isOtpSent ? "Reset Password" : "Send OTP"}
          </Text>
        </TouchableOpacity>

        {isOtpSent && (
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.linkText}>Go back to Login</Text>
          </TouchableOpacity>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    width: "80%",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#FF8C00",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  linkText: {
    marginTop: 15,
    textAlign: "center",
    color: "#FF8C00",
  },
  backButton: {
    position: "absolute",
    top: 12,
    left: 10,
    zIndex: 1,
    padding: 10,
  },
});

export default ForgotPassword;
