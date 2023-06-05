//searchUsers.jsx
import { useContext } from 'react';
import { Flex, FormControl, FormHelperText, FormLabel } from '@chakra-ui/react';
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from '@choc-ui/chakra-autocomplete';
import { useState, useEffect } from 'react';
import { getAllUsers } from '../../services/users.service';
import './SearchUsers.css';
import { FiLoader } from 'react-icons/fi';
import { createChatRoom, addChatMember } from '../../services/chat.service';
import { AuthContext } from '../../context/authContext';
import { getUserByUsername } from '../../services/users.service';

const SearchUsers = ({ addChatRoom }) => {
  const [users, setUsers] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [searchResult, setSearchResult] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const getUsers = async () => {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    };

    getUsers();
  }, []);

  // const handleSelectOption = (e) => {
  //   console.log('user', e.item.value);
  //   getUserByUsername(e.item.value).then((friendUid)=>{
  //     console.log('friend',friendUid);
  //     return createChatRoom(user.uid)
  //     .then((chatRoomId)=>{
  //       return addChatMember( friendUid, chatRoomId);
  //     });
  //   });
    
  //   setInputValue(''); // Clear the input value after clicking on an element
  // };

  // useEffect(()=>{
  //   console.log('useeff',searchResult);
  //   onFoundUser(searchResult);
  // },[searchResult]);

  const handleSelectOption = (e) => {
     addChatRoom(e.item.value);
    //  setSearchResult(e.item.value);
    // console.log('first',e?.target?.value);
    // if(e && e.target && e.target.value){
    //   onFoundUser(e.target.value);
    // }
    setInputValue('');
  };

  // console.log(users);
  if (!users) {
    return <FiLoader />;
  }
  return (
    <Flex pt="1rem" justify="center" align="top" w="full">
      <FormControl w="60" align='center'>
        <FormLabel>Start a chat</FormLabel>
        <AutoComplete openOnFocus onSelectOption={e => handleSelectOption(e)}>
          <AutoCompleteInput
            
            variant="filled"
            placeholder="Search..."
            bg='#12213c'
            padding='5px'
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} 
          />
          <AutoCompleteList className='autoCompleteList' bg='#12213c' padding='0' margin='8px' width='14rem' >
            {(users.length !== 0) && users.map((user, cid) => (
              <AutoCompleteItem
                key={`option-${cid}`}
                value={user.username}
                textTransform="capitalize"
                color='white'
                bg='#12213c'
                padding='4px 8px'
                margin='0'
              >
                {user.username}
              </AutoCompleteItem>
            ))}
          </AutoCompleteList>
        </AutoComplete>
      </FormControl>
    </Flex>
  );
};

export default SearchUsers;
