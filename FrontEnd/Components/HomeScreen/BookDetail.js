import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Button,
} from "react-native";
import axios from "../../axiosConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

function BookDetail({ route, navigation }) {
  const { bookId } = route.params;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookDetail = async () => {
      const token = await AsyncStorage.getItem("userToken");
      try {
        const response = await axios.get(`api/books/${bookId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBook(response.data);
      } catch (error) {
        console.error("Error fetching book details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetail();
  }, [bookId]);

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
      alert("Add to cart successfully");
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

  if (!book) {
    return (
      <View style={styles.container}>
        <Text>Không tìm thấy sách.</Text>
      </View>
    );
  }

  // Select default image URL or fallback to first image
  const imageUrl =
    book.imageurls?.find((img) => img.defaultImg)?.imageUrl ||
    book.imageurls?.[0]?.imageUrl ||
    null;

  return (
    <View style={styles.container}>
      <View style={styles.layoutImage}>
        {imageUrl && (
          <Image source={{ uri: imageUrl }} style={styles.bookImage} />
        )}
      </View>
      <View>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.detailText}>Author: {book.author}</Text>
        <Text style={styles.detailText}>Publisher: {book.publisher}</Text>
        <Text style={styles.detailText}>Genre: {book.genre}</Text>
        <Text style={styles.detailText}>Quanitty: {book.quantity}</Text>
        <Text style={styles.detailText}>Price: ${book.price}</Text>
        <Text style={styles.detailText}>Description: {book.description}</Text>
      </View>
      {/* <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Quay lại</Text>
      </TouchableOpacity> */}
      <View style={styles.layoutBtn}>
        <Button
          onPress={(e) => {
            e.preventDefault();
            addToCart(book); // Chuyển từ 'books' thành 'item'
          }}
          title={book.quantity === 0 ? "Out of stock" : "Add to cart"}
          disabled={book.quantity === 0}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F5F5F5",
    flex: 1,
  },
  bookImage: {
    width: 200,
    height: 200,
    resizeMode: "cover",
    marginBottom: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 5,
    alignItems: "center",
  },
  backButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  layoutImage: {
    alignItems: "center",
  },
  layoutBtn: {
    paddingTop: 10,
  },
});

export default BookDetail;
