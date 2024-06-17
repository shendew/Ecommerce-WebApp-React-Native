import * as React from "react";
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

