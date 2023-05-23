import { Box } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import Router from './components/routes/Router';
import { auth } from './config/firebase.config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getUserData } from './services/users.service';
import { AuthContext } from './context/authContext';

function App() {
  const [user] = useAuthState(auth);
  const [appState, setAppState] = useState({
    user,
    userData: null,
  });

  if (appState.user !== user) {
    setAppState({ user });
  }

  useEffect(() => {
    if (user === null) return;

    getUserData(user.uid)
      .then(snapshot => {
        if (!snapshot.exists()) {
          throw new Error('Something went wrong!');
        }
        setAppState({
          ...appState,
          userData: snapshot.val()[Object.keys(snapshot.val())[0]],
        });
      })
      .catch(e => alert(e.message));
  }, [user]);

  return (
    <>
      <AuthContext.Provider value={{ ...appState, setUser: setAppState }}>
        <Box className='app' h='100vh'>
          <Router />
        </Box>
      </AuthContext.Provider>
    </>
  );
}

export default App;
