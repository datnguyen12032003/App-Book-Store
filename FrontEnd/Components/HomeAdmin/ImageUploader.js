import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  Image,
  Alert,
  ActivityIndicator,
  Text,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "../../axiosConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ImageUploader = ({ bookId, onUploadComplete }) => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Photo library access is needed to select images."
        );
      }
    };
    requestPermissions();
  }, []);

  const selectImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        base64: false,
      });
      if (!result.canceled && result.assets) {
        setImages(result.assets);
      }
    } catch (err) {
      console.error("Error picking images: ", err);
    }
  };

  const handleUpload = async () => {
    if (images.length === 0) {
      Alert.alert("No Images Selected", "Please select at least one image.");
      return;
    }
  
    const token = await AsyncStorage.getItem("userToken");
    const formData = new FormData();
    
    images.forEach((image, index) => {
      console.log(`Appending image ${index}:`, image); // Debugging
      formData.append("image", {
        uri: image.uri,
        name: image.fileName || `image_${index}.jpg`,
        type: "image/png" || "image/jpeg", // Ensure you use the correct mime type
      });
    });
  
    console.log("FormData before upload:", formData); // Debugging
    setUploading(true);
  
    try {
      const response = await axios.post(`api/upload/many/${bookId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      
      setUploading(false);
      setImages([]);
      Alert.alert("Success", "Images uploaded successfully!");
      if (onUploadComplete) {
        onUploadComplete(response.data);
      }
    } catch (error) {
      setUploading(false);
      const errorMsg = error.response ? error.response.data : error.message;
      Alert.alert("Upload Failed", `Failed to upload images. Error: ${errorMsg}`);
      console.error("Upload error:", errorMsg);
    }
  };
  

  return (
    <View style={{ padding: 20 }}>
      <Button title="Select Images" onPress={selectImages} />
      <View
        style={{ marginVertical: 20, display: "flex", flexDirection: "row", flexWrap: "wrap" }}
      >
        {images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image.uri }}
            style={{ width: 100, height: 100, marginVertical: 5 }}
          />
        ))}
      </View>
      {uploading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Upload Images" onPress={handleUpload} />
      )}
    </View>
  );
};

export default ImageUploader;
