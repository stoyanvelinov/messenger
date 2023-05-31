import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Box,
    Text,
} from '@chakra-ui/react';
import axios from 'axios';
import { SPOONACULAR_API_KEY } from '../../components/common/constants';

const TermsModal = ({ isOpen, onClose }) => {
    const [recipes, setRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const contentRef = useRef(null);
    

    // fetch one random recipe
    const fetchRandomRecipe = async () => {
        try {
            const response = await axios.get('https://api.spoonacular.com/recipes/random', {
                params: {
                    apiKey: SPOONACULAR_API_KEY,
                },
            });

            const newRecipe = response.data.recipes[0];
            setRecipes((prevRecipes) => [...prevRecipes, newRecipe]);
            setIsLoading(false);
        } catch (err) {
            setError('Failed to load recipes');
            setIsLoading(false);
            console.log(err);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchRandomRecipe();
        }
    }, [isOpen]);
    
    const handleScroll = () => {
        //     if (isOpen) {
        //     const contentElement = contentRef.current;
        //     if (contentElement) {
        //         const isScrolledToBottom =
        //             contentElement.scrollTop + contentElement.clientHeight === contentElement.scrollHeight;

        //         if (isScrolledToBottom && !isLoading) {
        //             setIsLoading(true);
        //             fetchRandomRecipe();
        //         }
        //     }
        // }
    };



    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent bg="primaryLight">
                    <ModalHeader color="primaryDark">Terms and Conditions</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box
                            h="200px"
                            overflowY="auto"
                            sx={{
                                '&::-webkit-scrollbar': {
                                    width: '0.4em',
                                    background: 'transparent',
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    background: 'transparent',
                                },
                            }}
                            onScroll={handleScroll}
                            ref={contentRef}
                        >
                            <Text color='primaryDark'>
                                Please read these terms and conditions carefully before using our collaboration messenger app. :)
                            </Text>

                            {error ? (
                                <Text mt='2rem' color="red.500">
                                    {error}
                                </Text>
                            ) : (
                                <>
                                    <Text mt='1rem' fontWeight="bold">
                                        Recipes:
                                    </Text>

                                    {/* Display the list of recipes */}
                                    {recipes.map((recipe) => (
                                        <Box key={recipe.id} mt='1rem' p='1rem' bg="primaryDark" borderRadius='0.3rem'>
                                            <Text fontWeight="bold">{recipe.title}</Text>
                                            <Text>{recipe.instructions}</Text>
                                        </Box>
                                    ))}

                                    {isLoading && (
                                        <Text mt='1rem' fontStyle="italic" textAlign="center">
                                            Loading...
                                        </Text>
                                    )}
                                </>
                            )}
                        </Box>
                    </ModalBody>

                    <ModalFooter>
                        <Button bg="primaryLight" color="primaryDark" onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

TermsModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default TermsModal;
