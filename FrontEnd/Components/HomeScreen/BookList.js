import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../../axiosConfig'; // Cấu hình axios
import { useNavigation } from "@react-navigation/native";
const BookList = () => {
    const navigation = useNavigation();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
   
        const response = await axios.get('api/books', {
            headers: { Authorization: `Bearer ${token}` },
        }); 
        const allBooks = response.data;
// console.log("Fetched books:", response.data[0]);
        // Lọc sách có status là true
        const filteredBooks = allBooks.filter(book => book.status === true);
        console.log("Filtered books:", filteredBooks);
        console.log('status:', filteredBooks[0].status);    
        setBooks(filteredBooks);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book List</Text>
      {books.length === 0 ? (
        <Text>No books found.</Text>
      ) : (
        <FlatList
        data={books}
        keyExtractor={(item) => item._id ? item._id.toString() : Math.random().toString()}
        renderItem={({ item }) => (
          <View style={styles.bookItem}>
            <TouchableOpacity onPress={() => navigation.navigate('BookDetail', { bookId: item._id })}>
              <Text style={styles.bookTitle}>{item.title}</Text>
              <Text>Author: {item.author}</Text>
              <Text>Publisher: {item.publisher}</Text>
              <Text>Price: ${item.price}</Text>
            </TouchableOpacity>
          </View>
        )}
        
      />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookItem: {
    marginBottom: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BookList;
