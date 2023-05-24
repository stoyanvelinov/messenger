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

const SearchUsers = ()=> {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const getUsers = async () => {
        const allUsers = await getAllUsers();
    setUsers(allUsers);
    };

    getUsers();
  }, []);
    
  const handleClick = (e) => {
    console.log('user', e.item.value);
  };

  return (
    <Flex pt="1rem" justify="center" align="top" w="full">
      <FormControl w="60" align='center'>
        <FormLabel>Start a chat</FormLabel>
        <AutoComplete openOnFocus
        onSelectOption={e=>handleClick(e)}
        >
          <AutoCompleteInput  variant="filled" placeholder="Search..." bg='#12213c' padding='5px'/>
          <AutoCompleteList className='autoCompleteList' bg='#12213c' padding='0' margin='8px' width='14rem'>
            {users.map((user, cid) => (
              <AutoCompleteItem
                key={`option-${cid}`}
                value={user.firstName}
                textTransform="capitalize"
                color='white'
                bg='#12213c'
                padding='4px 8px'
                margin='0'
              >
                {user.firstName}
              </AutoCompleteItem>
            ))}
          </AutoCompleteList>
        </AutoComplete>
      </FormControl>
    </Flex>
  );
}

export default SearchUsers;