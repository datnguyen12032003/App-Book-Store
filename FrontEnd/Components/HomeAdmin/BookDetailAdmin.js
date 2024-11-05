import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import axios from "../../axiosConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImageUploader from "./ImageUploader";

function BookDetailAdmin({ route, navigation }) {
  const { bookId } = route.params;

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
        setUpdatedBook(response.data); // Prefill form with fetched data
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
      setBook(response.data); // Update book data
      setModalVisible(false); // Close modal
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  const setDefaultImage = async (imgId) => {
    const token = await AsyncStorage.getItem("userToken");
    try {
      const response = await axios.get(
        `api/upload/${bookId}/setDefault/${imgId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBook((prevBook) => ({
        ...prevBook,
        imageurls: response.data, // Update images with new default
      }));
      Alert.alert("Success", "Default image updated successfully");
    } catch (error) {
      console.error("Error setting default image:", error);
    }
  };
  //set true false
  const toggleBookStatus = async () => {
    const token = await AsyncStorage.getItem("userToken");
    const newStatus = !book.status; // Đảo ngược trạng thái hiện tại
    try {
      const response = await axios.get(
        `api/books/${bookId}/set?query=${newStatus}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBook((prevBook) => ({ ...prevBook, status: response.data.status })); // Cập nhật trạng thái mới
      Alert.alert("Success", `Book status set to ${newStatus ? "true" : "false"}`);
    } catch (error) {
      console.error("Error setting book status:", error);
    }
  };
  

  const deleteImage = async (imgId) => {
    const token = await AsyncStorage.getItem("userToken");
    try {
      const response = await axios.delete(`api/upload/${bookId}/${imgId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBook((prevBook) => ({
        ...prevBook,
        imageurls: response.data, // Update images after deletion
      }));
      Alert.alert("Success", "Image deleted successfully");
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const confirmFunction = (imgId) => {
    Alert.alert("Choose Action", "Set as Default or Delete Image?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () => deleteImage(imgId),
        style: "destructive",
      },
      { text: "Set as Default", onPress: () => setDefaultImage(imgId) },
    ]);
  };

  const handleUploadComplete = (updatedImages) => {
    setBook((prevBook) => ({
      ...prevBook,
      imageurls: updatedImages,
    }));
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
        <Text>Book not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.detailText}>Author: {book.author}</Text>
      <Text style={styles.detailText}>Publisher: {book.publisher}</Text>
      <Text style={styles.detailText}>Price: ${book.price}</Text>
      <Text style={styles.detailText}>Description: {book.description}</Text>

      {/* Display Images */}
      {book.imageurls && book.imageurls.length > 0 && (
        <View style={styles.imageContainer} key={book._id}>
          {book.imageurls.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => confirmFunction(image._id)}
            >
              <Image
                source={{ uri: image.imageUrl }}
                style={[
                  styles.bookImage,
                  image.defaultImg && styles.defaultImageBorder,
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {book.imageurls.length < 4 ? (
        <ImageUploader
          bookId={bookId}
          onUploadComplete={handleUploadComplete}
        />
      ) : (
        <Text>
          Maximum 4 images. Please delete an image to upload a new one!
        </Text>
      )}

      

      <TouchableOpacity
        style={styles.updateButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.updateButtonText}>Update</Text>
      </TouchableOpacity>

      {/* set true false */}
      <TouchableOpacity style={styles.statusButton} onPress={toggleBookStatus}>
  <Text style={styles.statusButtonText}>
    {book.status ? "Set to Unavailable" : "Set to Available"}
  </Text>
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
            <Text style={styles.modalTitle}>Update book information</Text>
            <Text style={styles.modalLabel}>Title:</Text>
            <TextInput
              style={styles.modalInput}
              value={updatedBook.title}
              onChangeText={(text) =>
                setUpdatedBook({ ...updatedBook, title: text })
              }
            />

            <Text style={styles.modalLabel}>Author:</Text>
            <TextInput
              style={styles.modalInput}
              value={updatedBook.author}
              onChangeText={(text) =>
                setUpdatedBook({ ...updatedBook, author: text })
              }
            />

            <Text style={styles.modalLabel}>Publisher:</Text>
            <TextInput
              style={styles.modalInput}
              value={updatedBook.publisher}
              onChangeText={(text) =>
                setUpdatedBook({ ...updatedBook, publisher: text })
              }
            />
            <Text style={styles.modalLabel}>Price:</Text>
            <TextInput
              style={styles.modalInput}
              value={updatedBook.price.toString()}
              keyboardType="numeric"
              onChangeText={(text) => {
                const priceValue = text.trim(); // loại bỏ khoảng trắng
                setUpdatedBook({
                  ...updatedBook,
                  price: priceValue ? parseFloat(priceValue) : 0,
                }); // Nếu trường rỗng, gán giá trị bằng 0
              }}
            />

            <Button title="Update" onPress={updateBook} />
            <Button
              title="Cancel"
              onPress={() => setModalVisible(false)}
              color="red"
            />
          </View>
        </View>
      </Modal>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F5F5F5",
    flex: 1,
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
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
  },
  bookImage: {
    width: 100,
    height: 100,
  },
  defaultImageBorder: {
    borderColor: "blue",
    borderWidth: 2,
  },
  updateButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "green",
    borderRadius: 5,
    alignItems: "center",
  },
  updateButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  modalInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 8,
  },
  statusButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "orange",
    borderRadius: 5,
    alignItems: "center",
  },
  statusButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  
});

export default BookDetailAdmin;
