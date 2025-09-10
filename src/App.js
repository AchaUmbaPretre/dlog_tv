import { useSelector } from 'react-redux';
import './App.css';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Login from './pages/login/Login';
import Home from './pages/home/Home';


function App() {
  const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);

  const SecureRoute = ({ children }) => {
    if (!userId) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  const router = createBrowserRouter([
    { path: '/', element: <SecureRoute><Home /></SecureRoute>},
    { path: '/login', element: <Login /> }
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
