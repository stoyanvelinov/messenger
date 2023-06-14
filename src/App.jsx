import { useState, useEffect } from 'react';
import Router from './components/routes/Router';
import { auth } from './config/firebase.config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getUserData, updateUserStatus } from './services/users.service';
import { AuthContext } from './context/authContext';
// import { STATUS } from './common/status.js';
import { STATUS } from './common/status.js';


function App() {
  const [user] = useAuthState(auth);
  const [appState, setAppState] = useState({
    user,
    userData: null,
    currentChatRoomId: null
  });

  // if (appState.user !== user) {
  //   setAppState({ user });
  // }


  useEffect(() => {
    if (user === null) return;

    getUserData(user.uid)
      .then(snapshot => {
        
        if (!snapshot.exists()) {
          throw new Error('Something went wrong!');
        }
        updateUserStatus(user.uid, STATUS.ONLINE);

        setAppState({
          ...appState,
          user,
          userData: { ...snapshot.val()[Object.keys(snapshot.val())[0]], status: STATUS.ONLINE },
        });
      })
      .catch(e => alert(e.message));

  }, [user]);

  return (
    <>
      <AuthContext.Provider value={{ ...appState, setUser: setAppState }}>
        <Router />
      </AuthContext.Provider>
    </>
  );
}

export default App;
