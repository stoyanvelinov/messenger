import { createContext } from 'react';

export const AuthContext = createContext({
  user: null,
  userData: null,
  currentChatRoomId: null,
  currentTeamId: null,
  currentChannelId: null,
  setUser: () => {}
});