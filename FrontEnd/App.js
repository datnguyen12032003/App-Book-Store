import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Toast from "react-native-toast-message";
import Ionicons from "react-native-vector-icons/Ionicons";
import Home from "./Components/HomeFage/Home";
import Login from "./Components/Login/Login";
import SignUp from "./Components/SignUp/SignUp";
import HomeScreen from "./Components/HomeScreen/HomeScreen";
import HomeAdmin from "./Components/HomeAdmin/HomeAdmin";
import ForgotPassword from "./Components/Password/forgotpassword";
import Profile from "./Components/HomeScreen/Profile/Profile";
import UpdateProfile from "./Components/HomeScreen/Profile/UpdateProfile";
import ChangePassword from "./Components/Password/ChangePassword";
import CreateBookScreen from "./Components/HomeAdmin/CreateBookScreen";
import BookListAdmin from "./Components/HomeAdmin/BookListAdmin";
import BookDetailAdmin from "./Components/HomeAdmin/BookDetailAdmin";
import BookList from "./Components/HomeScreen/BookList";
import BookDetail from "./Components/HomeScreen/BookDetail";
import StatisticAdmin from "./Components/HomeAdmin/StatisticAdmin";

import OrderManagement from "./Components/HomeAdmin/OrderManagements/OrderManagement";
import HistoryPurchase from "./Components/HomeScreen/Profile/HistoryPurchase";
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#FF8C00",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeScreen"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeAdmin"
          component={HomeAdmin}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UpdateProfile"
          component={UpdateProfile}
          options={{ title: "Update Profile" }}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePassword}
          options={{ title: "Change Password" }}
        />
        {/* Thang */}
          <Stack.Screen
          name="CreateBookScreen"
          component={CreateBookScreen}
          options={{ title: "Create Book Screen" }}
        />
        <Stack.Screen
          name="BookListAdmin"
          component={BookListAdmin}
          options={{ title: "Book List For Admin" }}
        />
         <Stack.Screen
          name="BookDetailAdmin"
          component={BookDetailAdmin}
          options={{ title: "Book Detail For Admin" }}
        />
            <Stack.Screen
          name="BookList"
          component={BookList}
          options={{ title: "Book List For User" }}
        />
                <Stack.Screen
          name="BookDetail"
          component={BookDetail}
          options={{ title: "Book Detail For User" }}
        />

<Stack.Screen
          name="StatisticAdmin"
          component={StatisticAdmin}
          options={{ title: "Statistic For Admin" }}
        />


        <Stack.Screen
          name="OrderManagement"
          component={OrderManagement}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HistoryPurchase"
          component={HistoryPurchase}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});