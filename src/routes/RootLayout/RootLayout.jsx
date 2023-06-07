import { Grid, GridItem } from '@chakra-ui/react';
import Header from '../../components/Header/Header';
import { Outlet } from 'react-router-dom';
import SideBar from '../../components/SideBar/SideBar';

const RootLayout = () => {

    return (
        <Grid h="100vh" templateRows="5rem auto" templateColumns={{ base: '1fr', md: '7rem auto' }} >
            <GridItem h="100vh" rowStart="1" rowSpan="2" id="first-grid-item">
                <SideBar />
            </GridItem>
            <GridItem colStart={{ base: '1', md: '2' }} colSpan={{ base: '2', md: '1' }} rowStart="1">
                <Header />
            </GridItem>
            <GridItem overflow="hidden" colStart={{ base: '1', md: '2' }} colSpan={{ base: '2', md: '1' }} rowStart="2">
                <Outlet />
            </GridItem>
        </Grid >
    );
};

export default RootLayout;