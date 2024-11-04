import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../../axiosConfig";
import { useNavigation } from "@react-navigation/native";

const BookList = () => {
  const navigation = useNavigation();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");

        const response = await axios.get("api/books", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const allBooks = response.data;
        const filteredBooks = allBooks.filter(
          (books) => books.status === false
        );
        setBooks(filteredBooks);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const addToCart = async (books) => {
    if (books.quantity === 0) {
      alert("Out of stock");
      return;
    }
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await axios.post(
        "api/cart",
        {
          book: books._id,
          price: books.price,
          quantity: 1, // or any desired initial quantity
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Added to cart:", response.data);
      alert("Add to cart successfully!");
    } catch (err) {
      console.error("Error adding to cart:", err.message);
    }
  };

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

  const renderBookItem = ({ item }) => {
    const imageUrl =
      item.imageurls?.find((img) => img.defaultImg)?.imageUrl || // Use default image if available
      item.imageurls?.[0]?.imageUrl || // Fallback to the first image if no default is set
      null;

    return (
      <View style={styles.bookItem}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("BookDetail", { bookId: item._id })
          }
          style={styles.layoutBook}
        >
          <View>
            {imageUrl && (
              <Image source={{ uri: imageUrl }} style={styles.bookImage} />
            )}
          </View>
          <View style={styles.textContainer}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.bookTitle}>{item.title}</Text>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.hideText}>Author: {item.author}</Text>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.hideText}>Publisher: {item.publisher}</Text>
            <Text>Price: ${item.price}</Text>
            <View style={styles.layoutBtn}>
              <Button
                onPress={(e) => {
                  e.preventDefault();
                  addToCart(item); // Chuyển từ 'books' thành 'item'
                }}
                title="Add to cart"
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {books.length === 0 ? (
        <Text>No books found.</Text>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderBookItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bookItem: {
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  bookImage: {
    width: 150,
    height: 150,
    resizeMode: "cover",
    marginRight: 10,
    borderRadius: 5,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    maxWidth: 110,
  },
  textContainer: {
    gap: 5,
  },
  layoutBook: {
    padding: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
  },
  layoutBtn: {
    width: 105
  },
  hideText: {
    width: 120
  }
});

export default BookList;
