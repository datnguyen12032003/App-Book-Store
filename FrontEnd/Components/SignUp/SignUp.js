import { React, useState } from "react";
import {
  Text,
  View,
  StatusBar,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from "react-native";
import CheckBox from "expo-checkbox";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "../../axiosConfig";
const SignUp = () => {
  const [isSelected, setIsSelected] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // Thêm số điện thoại
  const [address, setAddress] = useState(""); // Thêm địa chỉ
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [admin, setAdmin] = useState(false);
  const navigation = useNavigation();

  const toggleSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSignUp = async () => {
    console.log("Sign Up button pressed");
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Invalid email!", "Please enter valid email!");
      return;
    }
  
    // Validate password length
    if (password.length < 6) {
      Alert.alert("Password too short!", "Password must have at least 6 characters!");
      return;
    }
  
    // Validate phone number (10 or 11 digits)
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phone)) {
      Alert.alert("Invalid phone number!", "Please enter valid phone number!");
      return;
    }
  
    // Check if all required fields are filled
    if (fullname === "" || email === "" || phone === "" || address === "" || password === "") {
      Alert.alert("Fill out full information!", "Please fill out full information!");
      return;
    }
  
    // Check if terms of service are accepted
    if (!isSelected) {
      Alert.alert("Acceptance of terms & conditions", "Please acceptance of terms& conditions!");
      return;
    }
  
    try {
      // Make the API call to sign up
      const response = await axios.post("/api/users/signup", {
        username,
        fullname,
        email,
        phone,
        address,
        password,
        admin,
      });
  
      // Success Alert
      Alert.alert("Signup successfully!", "You're signed up successfully!");
      navigation.navigate("Login");
  
    } catch (error) {
      // Handle errors
      if (error.response) {
        Alert.alert("Signup failed!", "This account existed!");
        console.error("Error response data:", error.response.data);
      } else if (error.request) {
        Alert.alert("Signup failed!", "No response from server!");
      } else {
        Alert.alert("Signup failed!", "Something happened in request handle's processing!");
      }
      console.error("Error config:", error.config);
    }
  };
  

  return (
    <ImageBackground
      source={require("../../assets/Images/onboarding/background.jpg")}
      resizeMode="cover"
      style={{ width: "100%", height: "100%" }}
    >
      <StatusBar backgroundColor={"pink"} barStyle="dark-content" />
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <View style={{ alignItems: "center", marginTop: 20 }}>
        <Text style={styles.welcomeText}>SIGN UP NOW</Text>
      </View>

      <View style={{ padding: 30, marginTop: -10 }}>
        <View
          style={{
            position: "relative",
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            padding: 20,
            opacity: 1,
            borderRadius: 30,
            marginTop: 0,
          }}
        >
          <View style={styles.group}>
            <TextInput
              placeholder="Username"
              style={styles.inpt}
              value={username}
              onChangeText={setUsername}
            />
          </View>
          <View style={styles.group}>
            <TextInput
              placeholder="Full Name"
              style={styles.inpt}
              value={fullname}
              onChangeText={setFullName}
            />
          </View>

          <View style={styles.group}>
            <TextInput
              placeholder="E-mail"
              style={styles.inpt}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.group}>
            <TextInput
              placeholder="Phone Number"
              style={styles.inpt}
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <View style={styles.group}>
            <TextInput
              placeholder="Address"
              style={styles.inpt}
              value={address}
              onChangeText={setAddress}
            />
          </View>

          <View style={styles.group}>
            <TextInput
              placeholder="Password"
              style={styles.inpt}
              secureTextEntry={secureTextEntry}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={toggleSecureTextEntry}>
              <Image
                style={{ width: 25, height: 25 }}
                source={require("../../assets/Images/onboarding/Show_password_icon_eye_symbol_vector_vision-1024.png")}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.checkboxContainer}>
            <View style={styles.checkBoxCover}>
              <CheckBox
                value={isSelected}
                onValueChange={setIsSelected}
                tintColors={{ true: "#1bcdff", false: "#000" }}
              />
              <Text style={styles.checkboxLabel}>
                I accept to the <Text style={styles.link}></Text>
              </Text>
            </View>
            <View style={styles.group1}>
              <TouchableOpacity onPress={() => Alert.alert("hello")}>
                <Text style={styles.forgotPasswordText}>Terms of service</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.btn, { opacity: isSelected ? 1 : 0.5 }]}
            disabled={!isSelected}
            onPress={handleSignUp}
          >
            <Text style={{ color: "black" }}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>For already member?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.forgotPasswordText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingHorizontal: 50,
  },
  title: {
    marginTop: 30,
    alignItems: "center",
    paddingBottom: 50,
  },

  welcomeText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white", // Màu chữ
    textShadowColor: "#000", // Màu đổ bóng
    textShadowOffset: { width: 2, height: 2 }, // Độ lệch bóng
    textShadowRadius: 5, // Độ mờ của bóng
    marginTop: 20, // Điều chỉnh khoảng cách
  },
  group: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "gray",
    marginBottom: 15,
  },
  group1: {},
  inpt: {
    flex: 1,
    paddingVertical: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
  checkBoxCover: {
    flexDirection: "row",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    marginTop: -4,
    justifyContent: "space-between",
  },
  checkboxLabel: {
    marginLeft: 10,
    color: "black",
  },
  link: {
    color: "#1bcdff",
    textDecorationLine: "underline",
  },
  btn: {
    marginTop: 20,
    backgroundColor: "#FF9933",
    paddingVertical: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    marginLeft: 25,
  },
  imgPerson: {
    width: 80,
    height: 80,
    borderRadius: 50,
    resizeMode: "cover",
    alignSelf: "center",
  },
  forgotPasswordText: {
    color: "black",
    textShadowColor: "#000", // Màu của viền chữ
    textShadowOffset: { width: 0, height: 1 }, // Độ lệch của viền
    textShadowRadius: 0, // Độ mờ của viền
    textDecorationLine: "underline", // Gạch dưới chữ
    textDecorationColor: "black", // Màu của gạch dưới chữ
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center", // Căn giữa nội dung trong hàng
    marginTop: 10, // Khoảng cách trên để tách biệt với các phần trên
  },
  footerText: {
    marginRight: 5, // Khoảng cách giữa các thành phần trong hàng
    color: "black",
  },
  backButton: {
    position: "absolute",
    top: 12,
    left: 10,
    zIndex: 1, // Đảm bảo nút nằm trên các thành phần khác
    padding: 10,
  },
});

export default SignUp;
