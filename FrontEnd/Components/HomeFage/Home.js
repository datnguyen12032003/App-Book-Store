import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  StatusBar,
  ScrollView,
  View,
  ImageBackground,
  Text,
  TouchableOpacity,
} from "react-native";

const Home = ({ navigation }) => {
  const [imgActive, setimgActive] = useState(0);
  const scrollViewRef = useRef(null);

  const onchange = (nativeEvent) => {
    const slide = Math.ceil(
      nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width
    );
    if (slide !== imgActive) {
      setimgActive(slide);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/Images/onboarding/orangebackgroung.jpg")} // Đường dẫn đến hình nền
      style={styles.background}
      resizeMode="cover" // Thay đổi cách hiển thị hình ảnh nền
    >
      <View style={styles.wrapper}>
        <ImageBackground
          source={require("../../assets/Images/onboarding/pngtree-white-book-pages-png-file-png-image_10162601.png")}
          style={styles.image}
          resizeMode="contain" // Thay đổi cách hiển thị hình ảnh
          imageStyle={{ opacity: 0.8 }} // Thêm hiệu ứng mờ cho hình nền
        ></ImageBackground>

        <Text style={{ bottom: 200, fontSize: 40, textAlign: "center" }}>
          <Text style={{ color: "#ffffff" }}>Explore</Text>
          <Text style={{ color: "black" }}> The World Around You Now</Text>
        </Text>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("Login")} // Chuyển hướng đến màn hình Display
        >
          <Text style={{ color: "#ffffff", fontSize: 18 }}>Read now</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center", // Căn giữa theo chiều dọc
    alignItems: "center", // Căn giữa theo chiều ngang
  },
  wrapper: {
    flex: 1,
    justifyContent: "center", // Căn giữa theo chiều dọc
    alignItems: "center", // Căn giữa theo chiều ngang
  },
  image: {
    width: "100%", // Thay đổi chiều rộng theo phần trăm
    height: "100%", // Thay đổi chiều cao theo phần trăm
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -350,
    marginTop: -200,
  },
  textContainer: {
    position: "absolute",
    top: "50%", // Căn giữa theo chiều dọc
    left: "50%", // Căn giữa theo chiều ngang
    transform: [{ translateX: -200 }, { translateY: -50 }], // Dịch chuyển để căn chính xác giữa
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    flexWrap: "wrap", // Cho phép xuống dòng
    width: "80%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  btn: {
    marginTop: -70,
    backgroundColor: "#FF9933",
    paddingVertical: 30, // Tăng độ lớn theo chiều dọc
    paddingHorizontal: 20, // Tăng độ lớn theo chiều ngang
    borderRadius: 20,
    justifyContent: "center",

    width: "150%", // Thay đổi độ rộng của nút
    marginLeft: 0,
    bottom: 50,
    borderWidth: 2, // Độ dày của viền
    borderColor: "white", // Màu sắc của viền
  },
});

export default Home;
