import { Stack } from '@chakra-ui/react';
import Header from '../../components/Header/Header';
import { Outlet } from 'react-router-dom';
import SideBar from '../../components/SideBar/SideBar';

const RootLayout = () => {


    return (
        <>
            <SideBar />
            <Stack h='100%' ml={{ base: 0, md: 20 }}>
                <Header />
                <Outlet />
            </Stack>
        </>

    );
};

export default RootLayout;