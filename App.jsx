
import React from 'react';
import { AuthProvider } from './src/Context/AuthContext';
import AuthNavigation from './src/Context/AuthNavigation';
import './gesture-handler.native';

function App() {
  return(
   <AuthProvider>
    <AuthNavigation/>
   </AuthProvider>
  )
}

export default App;
