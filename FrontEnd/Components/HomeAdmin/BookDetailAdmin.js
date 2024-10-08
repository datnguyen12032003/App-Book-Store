import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import axios from '../../axiosConfig'; // Cấu hình axios
import AsyncStorage from '@react-native-async-storage/async-storage';

function BookDetailAdmin({ route, navigation }) {
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

  const updateBook = async () => {
    const token = await AsyncStorage.getItem("userToken");
    try {
      const response = await axios.put(`api/books/${bookId}`, updatedBook, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Book updated:", response.data);
      setBook(response.data); // Cập nhật thông tin sách
      setModalVisible(false); // Đóng modal
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

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
      
      <TouchableOpacity style={styles.updateButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.updateButtonText}>Cập nhật</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Quay lại</Text>
      </TouchableOpacity>

      {/* Modal Update */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cập nhật thông tin sách</Text>
            <Text style={styles.modalLabel}>Title:</Text>
            <TextInput
              style={styles.modalInput}
              value={updatedBook.title}
              onChangeText={(text) => setUpdatedBook({ ...updatedBook, title: text })}
            />

            <Text style={styles.modalLabel}>Author:</Text>
            <TextInput
              style={styles.modalInput}
              value={updatedBook.author}
              onChangeText={(text) => setUpdatedBook({ ...updatedBook, author: text })}
            />

            <Text style={styles.modalLabel}>Publisher:</Text>
            <TextInput
              style={styles.modalInput}
              value={updatedBook.publisher}
              onChangeText={(text) => setUpdatedBook({ ...updatedBook, publisher: text })}
            />

                <TextInput
                style={styles.modalInput}
                value={updatedBook.price.toString()}
                keyboardType="numeric"
                onChangeText={(text) => {
                    const priceValue = text.trim(); // loại bỏ khoảng trắng
                    setUpdatedBook({ ...updatedBook, price: priceValue ? parseFloat(priceValue) : 0 }); // Nếu trường rỗng, gán giá trị bằng 0
                }}
                />

            <Button title="Cập nhật" onPress={updateBook} />
            <Button title="Hủy" onPress={() => setModalVisible(false)} color="red" />
          </View>
        </View>
      </Modal>
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
  updateButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'green',
    borderRadius: 5,
    alignItems: 'center',
  },
  updateButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  modalInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 8,
  },
});

export default BookDetailAdmin;
