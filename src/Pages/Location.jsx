import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useContext, useEffect, useMemo } from "react";
import Loader from "../components/Loader";
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { MoveLeft } from "lucide-react";
import { AuthContext } from "../components/AuthContext";
export const Location = () => {
  const {
    userData,
    loading,
    token,
  } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search);
    const latitude = parseFloat(query.get('latitude'));
  const longitude = parseFloat(query.get('longitude'));

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_API_KEY,
  });
  let employeeLocation= { lat: latitude, lng: longitude }

  const center = useMemo(() => (employeeLocation), []);
  useEffect(() => {
    if (!token) {
      navigate("/");
      return
    }
  }, [token, navigate]);
  if (loading) return <Loader />;
  if (!userData) return <Navigate to="/" replace />;
  if (userData.role !== 'admin') return <Navigate to="/profile" replace />;
  return (
    <div className=" relative w-svw h-svh">
      <div className="absolute top-4 left-4 z-50 p-2 bg-blue-700 rounded-full " ><MoveLeft onClick={() => navigate(-1)} className="fill-white text-white cursor-pointer" /></div>
      {!isLoaded ? (
       <Loader/>
      ) : (
        <GoogleMap
          mapContainerClassName="w-full h-full"
          center={center}
          zoom={20}
          
        >
            <Marker position={employeeLocation} />
        </GoogleMap>
      )}
    </div>
  );
};
