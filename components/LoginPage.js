import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet,View, Text, SafeAreaView, TextInput, TouchableOpacity } from "react-native";

function LoginPage() {
  const navigation = useNavigation();
  const [UserEmail, onChangeUseremail] = React.useState("");
  const [UserPassword, onChangeUserpassword] = React.useState("");

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{fontSize:25, fontWeight:700 , marginBottom:50}}>LoginPage</Text>
      <TextInput style={{backgroundColor:'gray',textAlign:'left', width:"90%", marginBottom:20, borderRadius:17, padding:8}} placeholder="Email" onChangeText={onChangeUseremail} value={UserEmail} />

      <TextInput style={{textAlign:'left', width:"90%", marginBottom:50, borderRadius:17, padding:8 }} secureTextEntry={true} placeholder="Password" onChangeText={onChangeUserpassword} value={UserPassword} />

      <TouchableOpacity style={{backgroundColor:'maroon',alignItems:'center',justifyContent:'center', height:40, width:200, borderRadius:20, marginBottom:10}} onPress={()=>navigation.push("HomePage")}>
        <Text style={{textAlign:'center',color:'white', fontWeight:600}}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{width:'90%'}} onPress={()=>navigation.push("SignIn")}>
        <Text style={{fontSize:12}}>Haven't registered yet,<Text style={{color:'red'}}>Click here</Text></Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#fd44'
  },
});

export default LoginPage;
