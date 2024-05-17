import React, { createContext, useState, useEffect } from "react";
import Api from "../Api";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
const navigate = useNavigate()
  const fetchData = async () => {
      if (token) {
        try {
          const response = await Api.post("auth/current-user");
          setUserData(response.data.data);
        } catch (error) {
          localStorage.removeItem("token")
          navigate('/')

          // console.error(
          //   "Failed to fetch user data:",
          //   error?.response?.data || error.message
          // );
        }
      }
      setLoading(false);
    };
  useEffect(() => {
   
    fetchData()
  }, []);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        setError(null);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setPermissionDenied(true)

          setError(
            "You have denied access to your location. Click the button to enable it."
          );
        } else {
          setError("Unable to retrieve your location.");
        }
      }
    );
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        userData,
        setUserData,
        loading,
        permissionDenied,
        getLocation,
        location,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
