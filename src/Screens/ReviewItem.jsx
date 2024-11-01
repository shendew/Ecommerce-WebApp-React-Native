import { StyleSheet, Text, View } from "react-native";
import React from "react";
// import { Rating } from "react-native-elements";
import { Rating } from "react-native-ratings";
import { Image, Alert, TouchableOpacity } from "react-native";
import { Modal } from "react-native";
import { BlurView } from "@react-native-community/blur";
import Icon from "react-native-vector-icons/FontAwesome";
import { useState } from "react";

export default function ReviewItem({ review }) {
  const [isImageView, setIsImageView] = useState(false);
  return (
    <View
      style={{
        marginBottom: 20,
        borderTopColor: "grey",
        borderTopWidth: 1,
        paddingTop: 10,
      }}
    >
      <View style={{ flex: 1, flexDirection: "row", alignItems:'stretch' }}>
        <Rating
          readonly
          
          ratingCount={5}
          imageSize={10}
          fractions={1}
          startingValue={review.Rating}
        />

        <Text style={{ fontSize: 8, marginBottom: 5 ,marginLeft:5}}>{review.UserEmail}</Text>
      </View>
      <Text style={{ marginBottom: 5, fontWeight: 600 }}>{review.Title}</Text>
      <Text style={{ marginBottom: 10, color: "grey", marginLeft: 5 }}>
        {review.Body}
      </Text>
      {review.Image == "no-img" ? (
        <></>
      ) : (
        <TouchableOpacity
          onPress={() => {
            setIsImageView(true);
          }}
        >
          <Image
            source={{ uri: review.Image }}
            style={{ aspectRatio: 1, width: "25%" }}
          />
        </TouchableOpacity>
      )}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isImageView}
        onRequestClose={() => setIsImageView}
      >
        <BlurView
          intensity={100}
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: "95%",
              borderRadius: 10,
              padding: 10,
              paddingVertical: 20,
              flexDirection: "column",
              
            }}
          >
            <View
              style={{
                flexDirection: 'column',
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Icon
                name="close"
                size={20}
                color="black"
                style={{alignSelf:'flex-end',margin: 5}}
                onPress={() => {
                  setIsImageView(false);
                }}
              />
              <Image
                source={{ uri: review.Image }}
                style={{ aspectRatio: 1, width: '90%' }}
              />
            </View>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({});
