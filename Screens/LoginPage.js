import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";

function LoginPage() {
  const navigation = useNavigation();
  const [UserEmail, onChangeUseremail] = React.useState("");
  const [UserPassword, onChangeUserpassword] = React.useState("");

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../img/loginbacground.png")}
        style={{
          flex: 1,
          resizeMode: "cover",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={styles.subContainer}>

          <Image source={require("../img/logo.png")} style={{ width:'30%',height:'30%'}}/>
          <Text
            style={{
              fontSize: 25,
              fontWeight: 700,
              marginBottom: 50,
              color: "#000000",
            }}
          >
            Login
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="Email"
            placeholderTextColor={"#ffffff"}
            onChangeText={onChangeUseremail}
            value={UserEmail}
          />

          <TextInput
            style={styles.textInput}
            secureTextEntry={true}
            placeholder="Password"
            placeholderTextColor={"#ffffff"}
            onChangeText={onChangeUserpassword}
            value={UserPassword}
          />

          <TouchableOpacity
            style={{
              backgroundColor: "#eee600",
              alignItems: "center",
              justifyContent: "center",
              height: 50,
              width: "90%",
              borderRadius: 25,
              marginBottom: 10,
            }}
            onPress={() => navigation.push("HomePage")}
          >
            <Text
              style={{ textAlign: "center", color: "#000000", fontWeight: 600 }}
            >
              Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ width: "90%" }}
            onPress={() => navigation.push("SignIn")}
          >
            <Text style={{ fontSize: 12 ,color:'#7c0a0a'}}>
              Haven't registered yet,
              <Text style={{ fontWeight: 700 }}>Click here</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // bac: '#fff',
    flex: 1,
    flexDirection: "column",
    
  },
  textInput: {
    color: "#ffffff",
    textAlign: "left",
    width: "90%",
    marginBottom: 20,
    borderRadius: 17,
    borderColor: "#ffffff",
    borderWidth: 1,
    padding: 8,
    paddingHorizontal: 25,
  },
  subContainer:{
    backgroundColor:'#ffffff',
    opacity:0.7, 
    width:'90%',
    height:'60%',
    justifyContent: "center",
    alignItems: "center",
    borderRadius:15,
  }
});

export default LoginPage;
