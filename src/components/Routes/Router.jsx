import { Routes, Route } from 'react-router-dom';
import Login from '../../routes/Login/Login';
import Register from '../../routes/Register/Register';
import MainContent from '../MainContent/MainContent';
import RootLayout from '../../routes/RootLayout/RootLayout';


function Router() {
  return (
    <Routes>
      <Route index element={<MainContent />} />
      <Route path="/" element={<RootLayout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
export default Router;