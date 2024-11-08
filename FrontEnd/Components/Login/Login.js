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
  Dimensions,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "../../axiosConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

const Login = () => {
  const [isSelected, setIsSelected] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const toggleSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };
// Hàm xử lý đăng nhập qua API
const handleLogin = async () => {
  console.log("Username:", username);
  console.log("Password:", password);
  if (username === '' || password === '') {
    Alert.alert("Notification", "Please fill full username and password!");
    return;
  }

  try {
    const response = await axios.post("/api/users/login", {
      username,
      password,
    });
    console.log("Response data:", response.data);

    const { token, role } = response.data; // Lấy token và role từ phản hồi API
    console.log("Token:", token);
    console.log("Role:", role);

    // Kiểm tra xem token có hợp lệ không
    if (token) {
      // Lưu token vào AsyncStorage
      try {
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userRole', role); // Lưu role vào AsyncStorage
        console.log("Token đã được lưu:", token);
        console.log("Role đã được lưu:", role);

        // Điều hướng tới màn hình dựa trên role
        if (role === 'admin') {
          navigation.navigate("HomeAdmin"); // Điều hướng đến màn hình quản trị 
        } else if (role === 'user') {
          navigation.navigate("HomeScreen"); // Điều hướng đến màn hình người dùng 
        }
      } catch (error) {
        console.error('Lỗi khi lưu token hoặc role:', error);
      }
    } else {
      Alert.alert("Error", "Invalid token!");
      console.log(token);
    }
  } catch (error) {
    if (error.response) {
      console.error("Error response data:", error.response.data);
      Alert.alert("Login failed!", "Invalid username or password!");
    } else {
      console.error("Lỗi:", error);
    }
  }
};


// quay lại trnag trướcccc
  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <ImageBackground
      source={require("../../assets/Images/onboarding/background.jpg")}
      resizeMode="cover"
      style={{ width: "100%", height: "100%" }}
    >
      <StatusBar backgroundColor={"#ffffff"} barStyle="dark-content" />
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <View style={{ alignItems: "center", marginTop: 20 }}>

        
      <Text style={styles.welcomeText}>WELCOME</Text>



      </View>
      <View style={{ padding: 30,marginTop: 60 }}>
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
          <View style={{ position: "absolute", top:-40, left: "40%" }}>
            <Image
              style={styles.imgPerson}
              source={require("../../assets/Images/onboarding/aa.jpg")}
            />
          </View>

          <View style={styles.form}>
            <View style={styles.group}>
              <Image
                style={styles.imgIcon}
                source={require("../../assets/Images/onboarding/username-icon-png-7.jpg")}
              />
               <TextInput
                placeholder="User Name"
                style={styles.inpt}
                onChangeText={text => setUsername(text)}
                value={username}
              />
            </View>

            <View style={styles.group}>
              <Image
                style={styles.imgIcon}
                source={require("../../assets/Images/onboarding/130-1303682_security-password-2-icon-password-icon-in-png.png")}
              />
              <TextInput
                placeholder="Password"
                style={styles.inpt}
                secureTextEntry={secureTextEntry}
                onChangeText={text => setPassword(text)}
                value={password}
              />
              <TouchableOpacity onPress={toggleSecureTextEntry}>
                <Image
                  style={{ width: 25, height: 25 }}
                  source={require("../../assets/Images/onboarding/Show_password_icon_eye_symbol_vector_vision-1024.png")}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.group1}>
            <TouchableOpacity
                onPress={() => navigation.navigate("ForgotPassword")}
              >
                <Text style={styles.forgotPasswordText}>Forgot password</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.btn} onPress={handleLogin}>
              <Text style={{ color: "black" }}>Login</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>For already member?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text style={styles.forgotPasswordText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
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
  form: {
    marginTop: WIDTH / 20,
    marginTop: HEIGHT / 20,
  },
  group: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "gray",
    marginBottom: 15,
  },
  imgIcon: {
    width: 20,
    height: 23,
    marginRight: 10,
  },
  inpt: {
    flex: 1,
    paddingVertical: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
  group1: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',  // Màu chữ
    textShadowColor: '#000', // Màu đổ bóng
    textShadowOffset: { width: 2, height: 2 }, // Độ lệch bóng
    textShadowRadius: 5, // Độ mờ của bóng
    marginTop: 20, // Điều chỉnh khoảng cách
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
    textShadowColor: "#000",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0,
    textDecorationLine: "underline",
    textDecorationColor: "black",
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: {
    marginRight: 5,
    color: "black",
  },
  backButton: {
    position: "absolute",
    top: 12,
    left: 10,
    zIndex: 1,
    padding: 10,
  },
});

export default Login;

