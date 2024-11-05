import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "../../axiosConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OrderDetailPage = ({ route, navigation }) => {
  const { selectedItems, totalAmount } = route.params;
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleConfirmOrder = async () => {
    if (!phone || !address) {
      Alert.alert(
        "Missing Information",
        "Please enter your phone and address."
      );
      return;
    }

    try {
      const token = await AsyncStorage.getItem("userToken");
      const orderData = {
        amount: totalAmount,
        quantity: selectedItems.reduce(
          (total, item) => total + item.quantity,
          0
        ),
        order_details: selectedItems.map((item) => ({
          book: item.book._id,
          order_quantity: item.quantity,
          order_price: item.price.toFixed(2),
        })),
        address: address,
        phone: phone,
      };

      await axios.post("/api/orders/createOrder", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert(
        "Order Confirmed",
        "Your order has been created successfully!",
        [
          {
            text: "OK",
            onPress: () =>
              navigation.navigate("Cart", {
                confirmedItems: selectedItems.map((item) => item.book._id),
              }),
          },
        ]
      );
    } catch (error) {
      console.error("Error creating order:", error);
      Alert.alert("Order Failed", "There was an issue creating your order.");
    }
  };

  const handleCancelOrder = () => {
    Alert.alert("Order Canceled", "Your order has been canceled.", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.outlinePage}>
      <Text style={styles.header}>Order Details</Text>
      <FlatList
        data={selectedItems}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.outlineItem}>
            <View style={styles.item}>
              <Image
                source={{
                  uri:
                    item.book.imageurls?.find((img) => img.defaultImg)
                      ?.imageUrl ||
                    item.book.imageurls?.[0]?.imageUrl ||
                    null,
                }}
                style={styles.image}
              />
              <View style={styles.rightContent}>
                <Text style={styles.title}>{item.book.title}</Text>
                <Text style={styles.text}>Quantity: {item.quantity}</Text>
                <Text style={styles.text}>Price: ${item.price.toFixed(2)}</Text>
                <Text style={styles.text}>
                  Total: ${item.total_price.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        )}
      />
      <Text style={styles.totalText}>
        Total Amount: ${totalAmount.toFixed(2)}
      </Text>

      <View style={styles.contactContainer}>
        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your address"
          value={address}
          onChangeText={setAddress}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancelOrder}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmOrder}
        >
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outlinePage: {
    flex: 1,
    padding: 16,
  },
  outlineItem: {
    flexDirection: "column",
    backgroundColor: "white",
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    elevation: 5,
  },
  item: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  rightContent: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
  },
  text: {
    fontSize: 14,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
  contactContainer: {
    marginVertical: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 16,
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: "#f44336",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default OrderDetailPage;
