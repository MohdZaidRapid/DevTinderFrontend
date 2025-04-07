import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar.jsx";
import Books from "./pages/Books.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-black">
        <Navbar />
        <AppRoutes />
        <Books />
        {/* Footer will go here */}
      </div>
    </BrowserRouter>
  );
}

export default App;
