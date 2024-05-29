import AsyncStorage from "@react-native-async-storage/async-storage";
import React,{createContext, useContext,useEffect,useState} from "react";
import { Text } from "react-native";

 const AuthContext=createContext();
 const UpdateAuthContect=createContext();

 

export function useAuth(){
    return useContext(AuthContext);
}
export function useUpdateAuth(){
    return useContext(UpdateAuthContect);
} 

export function AuthProvider({children}){
    const [isLogedin,setIsLogedin] =useState(false);
    
    function authHandler(valu){
        setIsLogedin(valu)
        console.log("Updated_"+valu);
    }

    return(
      
      <AuthContext.Provider value={isLogedin}>
            <UpdateAuthContect.Provider value={authHandler}>
            {children}
            </UpdateAuthContect.Provider>
        </AuthContext.Provider>
      
    )
}