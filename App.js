import * as React from "react";
import * as SecureStore from "expo-secure-store";
import { AuthProvider,} from "./Screens/AuthContext";
import AuthNavigation from "./Screens/AuthNavigation";

export default function App() {
  return (
    <AuthProvider>
          <AuthNavigation />
    </AuthProvider>
  );
}

