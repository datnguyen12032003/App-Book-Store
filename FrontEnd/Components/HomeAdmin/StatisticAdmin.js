import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from '../../axiosConfig'; // Cấu hình axios của bạn
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";

function StatisticAdmin() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [totalQuantity, setTotalQuantity] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTotalQuantity = async () => {
      try {
        
const token = await AsyncStorage.getItem("userToken");
        console.log("Token:", token);
        
        const response = await axios.get("api/dashboard/total-quantity", {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token nếu cần
          },
        });

        // Kiểm tra nếu không có dữ liệu
        if (response.data.length > 0) {
          setTotalQuantity(response.data[0]?.total_quantity || 0);
        } else {
          setTotalQuantity(0);
        }
      } catch (err) {
        setError(err.message);
        Alert.alert("Error", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalQuantity();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Đã xảy ra lỗi: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Total order successfully:</Text>
      <Text style={styles.totalQuantityText}>{totalQuantity}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalQuantityText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'green',
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});

export default StatisticAdmin;
