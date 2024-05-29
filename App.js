import * as React from "react";
import * as SecureStore from "expo-secure-store";
import { AuthProvider } from "./Screens/AuthContext";
import AuthNavigation from "./Screens/AuthNavigation";
import { ThemeProvider } from "./Screens/ThemeContext";

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AuthNavigation />
      </ThemeProvider>
    </AuthProvider>
  );
}
