import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Icon2 from "react-native-vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import { AirbnbRating, Rating } from "react-native-ratings";
// import * as ImagePicker from "react-native-image-picker";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';



import { BaseUrl, Main } from "../Utils/Constrains";
import { emptyValidator } from "../Validators/emptyValidator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Loading from "../Utils/Loading";
import Swal from "sweetalert2";

const OrderReview = ({ route }) => {
  const navigation = useNavigation();
  const { order, product } = route.params;
  const [pickedImage, setPickedImage] = useState();
  const [pickedRawImage, setPickedRawImage] = useState();
  const [reviewBody, setReviewBody] = useState();
  const [ratingCount, setRatingCount] = useState(5);
  const [reviewTitle, setReviewTitle] = useState();
  const [titleErr, settitleErr] = useState(false);
  const [bodyErr, setbodyErr] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const test = () => {
    settitleErr(emptyValidator(reviewTitle));
    setbodyErr(emptyValidator(reviewBody));

    if (reviewTitle && reviewBody) {
      const formData = new FormData();
      formData.append("UserEmail", "e");
      formData.append("authKey", "a");
      formData.append("productID", order.productID);
      formData.append("orderID", order.orderID);
      formData.append("Body", reviewBody);
      formData.append("Rating", ratingCount);
      formData.append("Title", reviewTitle);
      if (pickedImage) {
        formData.append("Image", pickedImage);
        formData.append("ImageStatus", true);
      } else {
        formData.append("ImageStatus", false);
      }
      console.log(formData);
    }
  };

  const getAuthToken = async () => {
    await AsyncStorage.getItem("AUTH_TOKEN").then(async (a) => {
      await AsyncStorage.getItem("USER_EMAIL").then(async (e) => {
        addReview(e, a);
      });
    });
  };

  const addReview = (e, a) => {
    settitleErr(emptyValidator(reviewTitle));
    setbodyErr(emptyValidator(reviewBody));

    if (reviewTitle && reviewBody) {
      const formData = new FormData();
      formData.append("UserEmail", e);
      formData.append("authKey", a);
      formData.append("productID", order.productID);
      formData.append("orderID", order.orderID);
      formData.append("Body", reviewBody);
      formData.append("Rating", ratingCount);
      formData.append("Title", reviewTitle);
      // formData.append("reviewImage", pickedImage);

      if (pickedImage) {
        formData.append("reviewImage", {
            uri:pickedRawImage.uri,
            name:pickedRawImage.fileName,
            type:'multipart/form-data'
        });
        formData.append("ImageStatus", true);
      } else {
        formData.append("ImageStatus", false);
      }
      axios
        .post(
          BaseUrl + "/orders/review",
          formData,
          {
            headers: {
              // "Content-Type": "application/json; charset=UTF-8",
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data',
            },
          }
        )
        .then(function (response) {
          const da = response.data;
          if (da.status == 103) {
            setIsLoading(false);

            Swal.fire({
              title: 'Success',
              text: 'Rewviewed successfully',
              icon: 'success',
              confirmButtonText: 'Okay'
            })

            navigation.navigate("UserProfileScreen");

          } else {
            console.log("Failed to add review" + da.msg);
          }
        })
        .catch( (error) =>{
          console.log(error);
        });
    }
  };

  const pickImge = async () => {
    let result = {};
    try {

      const result=await launchImageLibrary()
      if (!result.canceled) {
        setPickedRawImage(result.assets[0]);
        await saveImage(result.assets[0].uri);
      } else {
        console.log("errpr");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveImage = async (image) => {
    try {
      console.log(image.toString());
      setPickedImage(image);
      //   handleChange("productImage", image);
    } catch (error) {}
  };

  return (
    isLoading?<Loading/>:
    <View>
      <View
        style={{
          width: "100%",
          height: 60,
          backgroundColor: "white",
          flexDirection: "row",
          paddingHorizontal: 15,
          paddingBottom: 7,
          elevation: 1,
          alignItems: "flex-end",
        }}
      >
        <Icon
          style={{}}
          name="angle-left"
          size={30}
          color="black"
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Text
          style={{
            fontSize: 19,
            textAlign: "center",
            fontWeight: 600,
            flex: 1,
          }}
        >
          Write Review
        </Text>
      </View>

      <View style={{ backgroundColor: "white" }}>
        <View
          style={{
            flexDirection: "row",
            marginVertical: 5,
            backgroundColor: "#EFEFEF",
            borderRadius: 10,
          }}
        >
          <Image
            source={{ uri: product.thumbnail }}
            style={{ height: 75, aspectRatio: 1, marginRight: 5 }}
          />
          <Text>{product.productTitle}</Text>
        </View>
      </View>
      <View style={{ padding: 10, backgroundColor: "white" }}>
        <Text style={{ fontSize: 17, fontWeight: 600 }}>Ratings</Text>

        <AirbnbRating
          count={5}
          reviews={["Terrible", "Bad", "OK", "Good", "Very Good"]}
          defaultRating={5}
          size={20}
          onFinishRating={(rt) => setRatingCount(rt)}
        />

        <TextInput
          style={{
            borderColor: titleErr ? "red" : "black",
            borderWidth: 1,
            borderRadius: 10,
            padding: 10,
            marginBottom: 15,
            marginTop: 15,
          }}
          placeholder="Title"
          value={reviewTitle}
          onChangeText={(txt) => setReviewTitle(txt)}
        />

        <TextInput
          multiline={true}
          style={{
            borderColor: bodyErr ? "red" : "black",
            borderWidth: 1,
            borderRadius: 10,
            minHeight: "30%",
            textAlign: "left",
            textAlignVertical: "top",
            padding: 10,
          }}
          placeholder="What do you think about the product and our service?"
          value={reviewBody}
          onChangeText={(txt) => setReviewBody(txt)}
        />

        {pickedImage ? (
          <TouchableOpacity
            style={{ borderRadius: 10, width: 100, marginTop: 10 }}
            onPress={() => {
              setPickedImage();
            }}
          >
            <Icon
              name="close"
              color={"white"}
              size={20}
              style={{ position: "absolute", right: 0, top: 0, margin: 5 }}
            />
            <Image
              source={{ uri: pickedImage }}
              style={{ height: 100, aspectRatio: 1, borderRadius: 10 }}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "flex-start",
              backgroundColor: "#EFEFEF",
              borderRadius: 10,
              padding: 10,
              marginTop: 10,
            }}
            onPress={() => pickImge()}
          >
            <Icon name="camera" size={25} />
            <Text>Upload Photo</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: "#7c0a0a",
          padding: 10,
          borderRadius: 10,
          margin: 10,
          alignItems: "center",
        }}
        onPress={() => {
          // getAuthToken()
          // setIsLoading(true)
          Swal.fire({
            title: 'Success',
            text: 'Rewviewed successfully',
            icon: 'success',
            confirmButtonText: 'Okay'
          })
        }}
      >
        <Text style={{ color: "white" }}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({});

export default OrderReview;
