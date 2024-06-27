import { useContext, useEffect, useRef } from "react";
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import Loader from "../components/Loader";
import { MoveLeft } from "lucide-react";
import { AuthContext } from "../components/AuthContext";
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoidGFoYWhhbWR5MDIiLCJhIjoiY2x3a2RpaWFkMTc5ajJta3gyaW5yd2wwcSJ9.r0bKbuRuQ5DBlG9RaM5Ftg';

export const Location = () => {
  const { userData, loading, token } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const latitude = parseFloat(query.get('latitude'));
  const longitude = parseFloat(query.get('longitude'));
  const mapContainer = useRef(null);
  const map = useRef(null);


  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    if (map.current) return; // Initialize map only once

    const initializeMap = () => {
      if (!mapContainer.current) return;
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [longitude, latitude],
        zoom: 14
      });

      map.current.on('load', () => {
        new mapboxgl.Marker()
          .setLngLat([longitude, latitude])
          .addTo(map.current);
      });
    };

    setTimeout(initializeMap, 100); 
  }, [token, navigate, latitude, longitude]);

  if (loading) return <Loader />;
  if (!userData) return <Navigate to="/" replace />;
  if (userData.role !== 'admin') return <Navigate to="/profile" replace />;

  return (
    <div className="relative w-svw h-svh">
      <div className="absolute top-4 left-4 z-50 p-2 bg-blue-700 rounded-full">
        <MoveLeft onClick={() => navigate(-1)} className="fill-white text-white cursor-pointer" />
      </div>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} className="rounded-2" />
    </div>
  );
};
