import { FormControl, useOutsideClick } from '@chakra-ui/react';
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from '@choc-ui/chakra-autocomplete';
import { useState, useEffect, useRef } from 'react';
import { getAllUsers } from '../../services/users.service';
import './SearchUsers.css';
import { FiLoader } from 'react-icons/fi';
import PropTypes from 'prop-types';

const SearchUsers = ({ addMember, width }) => {
  const [users, setUsers] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const searchInput = useRef();

  useEffect(() => {
    const getUsers = async () => {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    };
    getUsers();
  }, []);

  useOutsideClick({
    ref: searchInput,
    handler: () => setInputValue(''),
  });

  const handleClick = (e) => {
    setInputValue(e.item.value);
    addMember(e.item.value);
    setInputValue('');
  };

  if (!users) {
    return <FiLoader />;
  }
  return (
    <FormControl w={width} flexGrow="1" >
      <AutoComplete onSelectOption={e => handleClick(e)}>
        <AutoCompleteInput
          variant="filled"
          w={width}
          placeholder="Search for users..."
          bg='#12213c'
          padding='5px'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <AutoCompleteList p={0} m={0} w={width} className='autoCompleteList' zIndex="2" bg='#12213c'  >
          {(users.length !== 0) && users.map((user, cid) => (
            <AutoCompleteItem
              key={`option-${cid}`}
              value={user.username}
              textTransform="capitalize"
              color='white'
              bg='#12213c'
              // padding='4px 8px'
              margin='0'
            >
              {user.username}
            </AutoCompleteItem>
          ))}
        </AutoCompleteList>
      </AutoComplete>
    </FormControl>
  );
};

SearchUsers.propTypes = {
  addMember: PropTypes.func.isRequired,
  // width: PropTypes.string.isRequired,
};

export default SearchUsers;
