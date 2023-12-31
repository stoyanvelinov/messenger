import { Routes, Route } from 'react-router-dom';
import Login from '../../routes/Login/Login';
import Register from '../../routes/Register/Register';
import MainContent from '../MainContent/MainContent';
import RootLayout from '../../routes/RootLayout/RootLayout';
import AuthenticatedRoute from '../../hoc/AuthenticatedRoute/AuthenticatedRoute';
import TeamUpdate from '../TeamUpdate/TeamUpdate';


function Router() {

  return (
    <Routes>
      <Route path="/" element={<AuthenticatedRoute><RootLayout /></AuthenticatedRoute>} >
        <Route index element={<MainContent />} />
        <Route path="teams/:teamId" element={<MainContent />} />
        <Route path="teams/:teamId/:channelId/:chatRoomId" element={<MainContent />} />
        <Route path="messages/" element={<MainContent />} />
        <Route path="messages/:chatRoomId" element={<MainContent />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<AuthenticatedRoute><RootLayout /></AuthenticatedRoute>} />
    </Routes >
  );
}
export default Router;
