import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import axios from '../../axiosConfig'; // Cấu hình axios
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";

function BookListAdmin() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchBooks = async () => {
      const token = await AsyncStorage.getItem("userToken");
      try {
        const response = await axios.get('api/books', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched books:", response.data[0]);

        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Hàm xác nhận xóa sách
  const confirmDelete = (bookId) => {
    Alert.alert(
      "Xác Nhận Xóa",
      "Bạn có chắc chắn muốn xóa sách này không?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          onPress: () => deleteBook(bookId),
          style: "destructive",
        },
      ]
    );
  };

  // Hàm xóa sách
  const deleteBook = async (bookId) => {
    console.log("Deleting book with ID:", bookId);
    if (!bookId) {
      console.error("No book ID provided"); // Log nếu không có bookId
      return;
    }
    
    const token = await AsyncStorage.getItem("userToken");
    console.log("Deleting book with ID:", bookId); // Log bookId
  
    try {
      const response = await axios.delete(`api/books/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Delete response:", response.data); // Log response
  
      // Cập nhật lại danh sách sách sau khi xóa
      setBooks(books.filter(book => book._id !== bookId));
    } catch (error) {
      console.error("Error deleting book:", error.response ? error.response.data : error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book List</Text>
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('CreateBookScreen')}>
        <Text style={styles.cardText}>Create book</Text>
      </TouchableOpacity>
      <FlatList
        data={books}
        keyExtractor={(item) => item._id ? item._id.toString() : Math.random().toString()}
        renderItem={({ item }) => (
          <View style={styles.bookItem}>
            <TouchableOpacity onPress={() => navigation.navigate('BookDetailAdmin', { bookId: item._id })}>
              <Text style={styles.bookTitle}>{item.title}</Text>
              <Text>Author: {item.author}</Text>
              <Text>Publisher: {item.publisher}</Text>
              <Text>Price: ${item.price}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item._id)}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        
      />
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
    marginBottom: 20,
  },
  bookItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    marginBottom: 10,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#f8f8f8',
    padding: 8,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: 100,
    backgroundColor: 'green',
  },
  cardText: {
    color: 'white',
    alignSelf: 'center',
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default BookListAdmin;
