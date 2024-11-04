import Checkbox from "expo-checkbox";
import React, { useState, useEffect } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../../axiosConfig";
import { useNavigation } from "@react-navigation/native";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const response = await axios.get("api/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCart(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Hàm xác nhận xóa sách
  const confirmDelete = (cartId, bookId) => {
    Alert.alert(
      "Confirm Delete",
      "Do you want to delete this item?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => deleteBook(cartId, bookId),
          style: "destructive",
        },
      ]
    );
  };

  const deleteBook = async (cartId, bookId) => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      // Gửi yêu cầu xóa tới backend với cartId và bookId đúng
      const response = await axios.delete(
        `api/cart/${cartId}/product/${bookId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data);

      if (response.status === 200) {
        // Cập nhật lại giỏ hàng sau khi xóa thành công
        setCart((prevCart) =>
          prevCart.filter((item) => item.book._id !== bookId)
        );
        console.log("Book deleted:", response.data);
      } else {
        console.warn("Failed to delete book, response:", response.data);
      }
    } catch (error) {
      console.error(
        "Error deleting book:",
        error.response ? error.response.data : error.message
      );
      console.log(cartId, bookId);
    }
  };

  const confirmDeleteSelected = async () => {
    Alert.alert(
      "Confirm Delete",
      "Do you want to delete all item ?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async() => {
            try {
              const token = await AsyncStorage.getItem("userToken");
        
              // Gửi yêu cầu xóa tới backend với cartId và bookId đúng
              const response = await axios.delete(
                `api/cart/deleteCart`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              console.log(response.data);
        
              if (response.status === 200) {
                // Cập nhật lại giỏ hàng sau khi xóa thành công
                setCart([]);
                console.log("Book deleted:", response.data);
              } else {
                console.warn("Failed to delete book, response:", response.data);
              }
            } catch (error) {
              console.error(
                "Error deleting book:",
                error.response ? error.response.data : error.message
              );
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const toggleCheckbox = (id) => {
    setSelectedItems((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const increaseQuantity = async (cartId, productId) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await axios.put(
        `api/cart/increase/${cartId}/product/${productId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setCart((prevCart) =>
          prevCart.map((item) =>
            item._id === cartId
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                  total_price: response.data.total_price,
                }
              : item
          )
        );
      } else {
        console.warn("Failed to increase quantity:", response.data);
      }
    } catch (error) {
      console.error(
        "Error increasing quantity:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const decreaseQuantity = async (cartId, productId) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await axios.put(
        `api/cart/decrease/${cartId}/product/${productId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setCart((prevCart) =>
          prevCart.map((item) =>
            item._id === cartId
              ? {
                  ...item,
                  quantity: item.quantity - 1,
                  total_price: response.data.total_price,
                }
              : item
          )
        );
      } else {
        console.warn("Failed to decrease quantity:", response.data);
      }
    } catch (error) {
      console.error(
        "Error decreasing quantity:",
        error.response ? error.response.data : error.message
      );
    }
  };

  useEffect(() => {
    const selectedBooks = cart.filter((book) => selectedItems[book._id]); // Use _id for filtering
    const total = selectedBooks.reduce(
      (sum, book) => sum + book.total_price,
      0
    );
    setTotalAmount(total);
  }, [selectedItems, cart]);

  function currencyFormat(num) {
    return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  return (
    <View style={styles.outlinePage}>
      {cart.length === 0 ? (
        <View>
          <Text>Cart Empty</Text>
        </View>
      ) : (
        <View style={styles.outlinePage}>
          <FlatList
            data={cart}
            renderItem={({ item }) => (
              <View style={styles.outlineItem}>
                <View style={styles.item} key={item._id}>
                  <View style={styles.leftContent}>
                    <Checkbox
                      value={selectedItems[item._id] || false} // Use _id for checkbox
                      onValueChange={() => toggleCheckbox(item._id)}
                      style={styles.checkbox}
                    />
                    <Image
                      source={{
                        uri:
                          item.book.imageurls?.find((img) => img.defaultImg)
                            ?.imageUrl || // Use default image if available
                          item.book.imageurls?.[0]?.imageUrl || // Fallback to the first image if no default is set
                          null,
                      }}
                      style={styles.image}
                    />
                  </View>
                  <View style={styles.rightContent}>
                    <Text
                      style={styles.title}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.book.title}
                    </Text>
                    <Text style={styles.text}>
                      Price: ${currencyFormat(item.price)}
                    </Text>
                    <View style={styles.quantityContainer}>
                      <TouchableOpacity
                        onPress={() =>
                          decreaseQuantity(item._id, item.book._id)
                        } // Use _id for the button
                        style={styles.quantityBtn}
                      >
                        <Text style={styles.quantityBtnText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                      <TouchableOpacity
                        onPress={() =>
                          increaseQuantity(item._id, item.book._id)
                        } // Use _id for the button
                        style={styles.quantityBtn}
                      >
                        <Text style={styles.quantityBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.text}>
                      Total: ${currencyFormat(item.total_price)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.layoutTrashBin}
                    onPress={() => confirmDelete(item._id, item.book._id)} // gọi deleteBook với cartId và bookId
                  >
                    <Image
                      style={styles.trashBin}
                      source={require("../../assets/Images/onboarding/recycle-bin_3574096.png")}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={(item) => item._id} // Use _id for key extraction
          />

          <View style={styles.bottomBar}>
            <Text style={styles.totalText}>
              Total: ${totalAmount.toFixed(2)}
            </Text>
            <View style={styles.layoutBtnBottom}>
              <TouchableOpacity
                style={styles.outlineOrderBtn}
                onPress={confirmDeleteSelected} // gọi deleteBook với cartId và bookId
              >
                <Text style={styles.orderText}>Delete All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.outlineOrderBtn}>
                <Text style={styles.orderText}>Buy Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  outlinePage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 5,
  },
  outlineItem: {
    flexDirection: "column",
    alignItems: "center",
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
    width: 300,
    alignItems: "center",
  },
  leftContent: {
    display: "flex",
    flexDirection: "row",
  },
  rightContent: {
    flex: 1,
    flexDirection: "column",
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    lineHeight: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  text: {
    fontSize: 14,
  },
  checkbox: {
    marginRight: 10,
    borderRadius: 75,
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  outlineOrderBtn: {
    padding: 10,
    backgroundColor: "#e35940",
    borderRadius: 5,
  },
  orderText: {
    color: "white",
    fontWeight: "bold",
  },
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",

    width: 120,
    height: 40,
  },
  quantityBtn: {
    flex: 1,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
  },
  quantityBtnText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  layoutTrashBin: {
    bottom: 40,
  },
  trashBin: {
    width: 20,
    height: 20,
  },
  layoutBtnBottom: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
  },
});

export default CartPage;
