import './index.css'
import { Routes, Route, Navigate } from "react-router-dom";
import Login from './screen/Login';
import Daashboard from './screen/Daashboard';

const AuthGuard = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route 
        path="/Dashboard" 
        element={
          <AuthGuard>
            <Daashboard />
          </AuthGuard>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;