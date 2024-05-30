import { createRoot } from 'react-dom/client'
import App from './App/App';
import 'mapbox-gl/dist/mapbox-gl.css';
import './styles/fonts.css'
import './styles/index.css'
const container = document.getElementById("root")
if (!container) throw new Error("container not found");
const root = createRoot(container); root.render(<App />);
