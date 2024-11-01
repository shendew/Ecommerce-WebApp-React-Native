import React, {createContext, useContext, useState} from 'react';

const AuthContext = createContext();
const UpdateAuthContect = createContext();

export function useAuth() {
  return useContext(AuthContext);
}
export function useUpdateAuth() {
  return useContext(UpdateAuthContect);
}

export function AuthProvider({children}) {
  const [isLogedin, setIsLogedin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  function authHandler(valu, type) {
    setIsAdmin(type);
    setIsLogedin(valu);
    console.log('Updated_' + valu + type);
  }

  return (
    <AuthContext.Provider value={{isLogedin, isAdmin}}>
      <UpdateAuthContect.Provider value={authHandler}>
        {children}
      </UpdateAuthContect.Provider>
    </AuthContext.Provider>
  );
}
