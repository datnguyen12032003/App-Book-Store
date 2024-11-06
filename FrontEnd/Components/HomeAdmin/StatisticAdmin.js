import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import axios from "../../axiosConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

function StatisticAdmin() {
  const [loading, setLoading] = useState(true);
  const [totalQuantity, setTotalQuantity] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");

        // Fetch total orders count
        const quantityResponse = await axios.get("/api/orders/totalOrders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch total revenue (keeping this part the same if you have a revenue endpoint)
        const totalRevenueResponse = await axios.get(
          "api/dashboard/yearly-revenue",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Set total orders count from the new endpoint
        if (
          quantityResponse.data &&
          quantityResponse.data.total_orders !== undefined
        ) {
          setTotalQuantity(quantityResponse.data.total_orders);
        }

        // Handle revenue response
        if (totalRevenueResponse.data.length > 0) {
          setTotalRevenue(totalRevenueResponse.data[0]?.yearly_revenue || 0);
        }
      } catch (err) {
        setError(err.message);
        Alert.alert("Error", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#007BFF" />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Statistics Overview</Text>
      <View style={styles.statContainer}>
        <Text style={styles.label}>Total Successful Orders:</Text>
        <Text style={styles.totalQuantityText}>{totalQuantity}</Text>
      </View>

      <View style={styles.statContainer}>
        <Text style={styles.label}>Total Revenue:</Text>
        <Text style={styles.totalRevenueText}>${totalRevenue.toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa", // Light background color
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#343a40", // Darker text for the title
    marginBottom: 20,
  },
  statContainer: {
    width: "100%",
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: "#ffffff", // White background for stats
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.62,
    elevation: 4, // For Android shadow
  },
  label: {
    fontSize: 18,
    color: "#495057", // Dark gray for labels
  },
  totalQuantityText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#28a745", // Green color for quantity
    marginTop: 5,
  },
  totalRevenueText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007BFF", // Blue color for revenue
    marginTop: 5,
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
});

export default StatisticAdmin;
