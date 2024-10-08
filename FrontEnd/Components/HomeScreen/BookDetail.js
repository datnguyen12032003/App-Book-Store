import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import axios from '../../axiosConfig'; // Cấu hình axios
import AsyncStorage from '@react-native-async-storage/async-storage';

function BookDetail({ route, navigation }) {
    const { bookId } = route.params; // Nhận bookId từ tham số

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [updatedBook, setUpdatedBook] = useState({});

  useEffect(() => {
    const fetchBookDetail = async () => {
      const token = await AsyncStorage.getItem("userToken");
      try {
        const response = await axios.get(`api/books/${bookId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBook(response.data);
        setUpdatedBook(response.data); // Để dữ liệu sách đã tải được điền vào form
      } catch (error) {
        console.error("Error fetching book details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetail();
  }, [bookId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!book) {
    return (
      <View style={styles.container}>
        <Text>Không tìm thấy sách.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.detailText}>Author: {book.author}</Text>
      <Text style={styles.detailText}>Publisher: {book.publisher}</Text>
      <Text style={styles.detailText}>Price: ${book.price}</Text>
      <Text style={styles.detailText}>Description: {book.description}</Text>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Quay lại</Text>
      </TouchableOpacity>

      {/* Modal Update */}
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F5F5F5',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default BookDetail;
