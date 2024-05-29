import React, { createContext, useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';

const ThemeContext=createContext();
const UpdateThemeContext=createContext();

export function useTheme(){
    return useContext(ThemeContext);
}

export function useUpdateTheme(){
    return useContext(UpdateThemeContext);
}

export function ThemeProvider({children}){
    const [isDark,setIsDark]=useState(false);
    function themeHandler(valu){
        setIsDark(valu)
        console.log("Updated_Theme_"+valu);

    }

    return (
        <ThemeContext.Provider value={isDark}>
            <UpdateThemeContext.Provider value={themeHandler}>
            {children}
            </UpdateThemeContext.Provider>
        </ThemeContext.Provider>
    );
}

const styles = StyleSheet.create({})


