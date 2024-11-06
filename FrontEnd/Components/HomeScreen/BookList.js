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
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const BookList = () => {
  const navigation = useNavigation();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // New refreshing state
  const [error, setError] = useState(null);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");

      const response = await axios.get("api/books", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allBooks = response.data;
      const filteredBooks = allBooks.filter((books) => books.status === true);
      setBooks(filteredBooks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false); // Stop the refreshing indicator
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchBooks();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true); // Start refreshing indicator
    fetchBooks(); // Call fetchBooks to reload data
  };

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
          quantity: 1,
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
      item.imageurls?.find((img) => img.defaultImg)?.imageUrl ||
      item.imageurls?.[0]?.imageUrl ||
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
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.bookTitle}
            >
              {item.title}
            </Text>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.hideText}>
              Author: {item.author}
            </Text>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.hideText}>
              Publisher: {item.publisher}
            </Text>
            <Text>Price: ${item.price}</Text>
            <View style={styles.layoutBtn}>
              <Button
                onPress={(e) => {
                  e.preventDefault();
                  addToCart(item);
                }}
                title={item.quantity === 0 ? "Out of stock" : "Add to cart"}
                disabled={item.quantity === 0}
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
          refreshing={refreshing} // Pull-to-refresh state
          onRefresh={onRefresh} // Pull-to-refresh action
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa", // Màu nền sáng cho app
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  bookItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Hiệu ứng nổi lên cho iOS
  },
  bookImage: {
    width: 90,
    height: 120,
    resizeMode: "cover",
    borderRadius: 5,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  hideText: {
    fontSize: 14,
    color: "#555",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007bff",
    marginTop: 5,
  },
  layoutBook: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  layoutBtn: {
    marginTop: 10,
    alignSelf: "flex-start",
  },
  button: {
    backgroundColor: "#28a745",
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});


export default BookList;
