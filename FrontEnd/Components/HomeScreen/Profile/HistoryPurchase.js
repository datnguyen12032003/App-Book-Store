import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  ImageBackground,
} from "react-native";
import axios from "../../../axiosConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";

const HistoryPurchase = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          console.error("Token not found. Please log in again.");
          return;
        }

        const response = await axios.get("/api/orders/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(response.data);
      } catch (error) {
        console.error(
          "Error fetching orders:",
          error.response ? error.response.data : error.message
        );
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <ImageBackground
      source={require("../../../assets/Images/onboarding/background.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text>
              <Icon name="arrow-left" size={20} color="#fff" />
            </Text>
          </TouchableOpacity>
          <Text style={styles.title}>My Orders</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollView}>
          {orders.length === 0 ? (
            <Text style={styles.noOrdersText}>You have no orders yet.</Text>
          ) : (
            orders.map((order) => (
              <TouchableOpacity
                key={order._id}
                style={styles.card}
                onPress={() => handleOrderClick(order)}
              >
                <Text style={styles.cardText}>ID: {order._id}</Text>
                <Text style={styles.cardText}>User: {order.user.fullname}</Text>
                <Text style={styles.cardText}>
                  Status: {order.order_status}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {selectedOrder && (
                <View>
                  <Text style={styles.modalText}>Order Details</Text>
                  <Text style={styles.modalDetailText}>
                    ID: {selectedOrder._id}
                  </Text>
                  <Text style={styles.modalDetailText}>
                    User: {selectedOrder.user.fullname}
                  </Text>
                  <Text style={styles.modalDetailText}>
                    Address: {selectedOrder.address}
                  </Text>
                  <Text style={styles.modalDetailText}>
                    Phone: {selectedOrder.phone}
                  </Text>
                  <Text style={styles.modalDetailText}>
                    Total Price: {selectedOrder.total_price}
                  </Text>
                  <Text style={styles.modalDetailText}>
                    Status: {selectedOrder.order_status}
                  </Text>
                  <Text style={styles.modalDetailText}>
                    Order Date:{" "}
                    {new Date(selectedOrder.order_date).toLocaleDateString()}
                  </Text>

                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[styles.button, styles.closeButton]}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    backgroundColor: "transparent",
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(248, 248, 248, 0.2)",
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#000",
    flex: 1,
    textAlign: "center",
  },
  scrollView: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    alignItems: "center",
  },
  modalText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalDetailText: {
    fontSize: 16,
    marginVertical: 5,
    color: "#555",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    width: "40%",
  },
  closeButton: {
    backgroundColor: "#FF8C00",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  noOrdersText: {
    fontSize: 18,
    color: "#808080",
    textAlign: "center",
    marginTop: 20,
  },
});

export default HistoryPurchase;
