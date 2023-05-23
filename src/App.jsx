import { Route, Routes } from 'react-router-dom';
import RootLayout from './routes/RootLayout/RootLayout';
import MainContent from './components/MainContent/MainContent';
import { Box } from '@chakra-ui/react';


function App() {
  return (
    <Box className='app' h='100vh'>
      <Routes>
        <Route path="/" element={<RootLayout />} >
          <Route index element={<MainContent />} />
        </Route>
      </Routes>
    </Box>
  );
}

export default App;
