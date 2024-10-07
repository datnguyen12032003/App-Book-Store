import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, ScrollView, StyleSheet } from 'react-native';
import axios from '../../axiosConfig'; // Cấu hình axios
import AsyncStorage from "@react-native-async-storage/async-storage";

const CreateBookScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [genre, setGenre] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = async () => {
    if (!title || !author || !publisher || !genre || !price || !description || !quantity) {
      Alert.alert("Validation Error", "All fields are required.");
      return;
    }

    const bookData = {
      title,
      author,
      publisher,
      genre,
      price: parseFloat(price),
      description,
      quantity: parseInt(quantity, 10)
    };

    if (isNaN(bookData.price) || isNaN(bookData.quantity)) {
      Alert.alert("Validation Error", "Price and quantity must be valid numbers.");
      return;
    }

    const token = await AsyncStorage.getItem("userToken");
    try {
      const response = await axios.post('api/books', bookData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 200) {
        Alert.alert('Success', 'Book created successfully');
        navigation.navigate('BookListAdmin'); // Cập nhật navigation đến BookListAdmin
      }
      
    } catch (error) {
      console.error("Error creating book:", error);
      Alert.alert('Error', 'An error occurred while creating the book');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Enter book title"
        style={styles.input}
      />

      <Text style={styles.label}>Author</Text>
      <TextInput
        value={author}
        onChangeText={setAuthor}
        placeholder="Enter author name"
        style={styles.input}
      />

      <Text style={styles.label}>Publisher</Text>
      <TextInput
        value={publisher}
        onChangeText={setPublisher}
        placeholder="Enter publisher"
        style={styles.input}
      />

      <Text style={styles.label}>Genre</Text>
      <TextInput
        value={genre}
        onChangeText={setGenre}
        placeholder="Enter genre"
        style={styles.input}
      />

      <Text style={styles.label}>Price</Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        placeholder="Enter price"
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Enter description"
        style={styles.input}
      />

      <Text style={styles.label}>Quantity</Text>
      <TextInput
        value={quantity}
        onChangeText={setQuantity}
        placeholder="Enter quantity"
        keyboardType="numeric"
        style={styles.input}
      />

      <Button title="Create Book" onPress={handleSubmit} color="#007BFF" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    padding: 20,
    flexGrow: 1, // Đảm bảo nội dung có thể cuộn
    justifyContent: 'flex-start', // Bắt đầu từ đầu
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
});

export default CreateBookScreen;
