import { BrowserRouter, HashRouter } from "react-router-dom";
import ProjectRoutes from "./Routes";
import { AuthProvider } from "../components/AuthContext";
import { CookiesProvider } from 'react-cookie';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <div className="box-border p-0 m-0 bg-gradient-to-b from-[#020B27] to-blue-500">
      {/* <HashRouter basename="/Attendance-Tracking-Client" > */}
      <BrowserRouter basename="/">
      <CookiesProvider defaultSetOptions={{ path: '/' }}>
      <AuthProvider>
      <ToastContainer
       style={{
        width: "90%",
        maxWidth: "400px",
        marginTop:"2rem",
      }}
      />
        <ProjectRoutes />
      </AuthProvider>
    </CookiesProvider>
      </BrowserRouter>
    </div>
  );
}
