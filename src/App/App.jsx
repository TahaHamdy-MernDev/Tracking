import { HashRouter } from "react-router-dom";
import ProjectRoutes from "./Routes";
import { AuthProvider } from "../components/AuthContext";
import { CookiesProvider } from 'react-cookie';
export default function App() {
  return (
    <div className="box-border p-0 m-0 bg-gradient-to-b from-[#020B27] to-blue-500">
      {/* <HashRouter basename="/Attendance-Tracking-Client" > */}
      <HashRouter>
      <CookiesProvider defaultSetOptions={{ path: 'Attendance-Tracking-Client/' }}>
      <AuthProvider>
        <ProjectRoutes />
      </AuthProvider>
    </CookiesProvider>
      </HashRouter>
    </div>
  );
}
