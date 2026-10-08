import { createContext, useState, useEffect } from "react";

const AuthContext = createContext({});

const readStoredAuth = () => {
  try {
    return JSON.parse(localStorage.getItem("auth")) || {};
  } catch (error) {
    return {};
  }
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(readStoredAuth);

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;