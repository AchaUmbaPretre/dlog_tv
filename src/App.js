import { useSelector } from "react-redux";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import "./App.css";

function App() {
  const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);

  const SecureRoute = ({ children }) => {
    return userId ? children : <Navigate to="/login" replace />;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <SecureRoute>
          <Home />
        </SecureRoute>
      ),
    },
    { path: "/login", element: <Login /> },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
