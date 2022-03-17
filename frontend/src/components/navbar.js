import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSeedling } from '@fortawesome/free-solid-svg-icons'
import { styled, useTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Link from '@mui/material/Link';
import { colorTheme } from '../ThemeContext';
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import { apiConfig } from '../Constants'

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

export default function Navbar() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [userInfo, setUserInfo] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(true)

  let url = apiConfig.url.API_URL

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUserInfo(foundUser);
    }else{
      setIsLoggedIn(false)
    }
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    axios({
      method: "GET",
      withCredentials: true,
      url: `${url}/logout`,
    }).then((res) => {
      localStorage.clear()
      sessionStorage.clear()
      setIsLoggedIn(false)
    })
  };
    

  if(!isLoggedIn){
    return <Navigate replace to="/" />
}


  return (
    <ThemeProvider theme={colorTheme}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar position="fixed" open={open} color='white'>
            <Toolbar>
              <Typography variant="h6" noWrap sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row', justifyContent: 'start'}} component="div">
                <FontAwesomeIcon icon={faSeedling} size="3x" inverse />
                <div className="text">
                  <h3 className="navbar-title">Little Legumes </h3>
                  <p>Hello {userInfo.firstName}</p>
                </div>
              </Typography>
              <IconButton
                color="brownish"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerOpen}
                sx={{ ...(open && { display: 'none' }) }}
              >
                <MenuIcon/>
              </IconButton>
            </Toolbar>
          </AppBar>
          <Main open={open}>
            <DrawerHeader />
          </Main>
          <Drawer
            sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
                width: drawerWidth,
            },
            backgroundColor: 'rgb(253,247,236)'
            }}
            variant="persistent"
            anchor="right"
            open={open}
            
          >
            <DrawerHeader>
              <IconButton onClick={handleDrawerClose}>
                <ChevronRightIcon color="brownish" />
              </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
              <Link href="/dashboard">
                <ListItem button>
                  <ListItemText primary="My Calendar" sx={{color: "rgb(52,33,3", textDecoration: "none"}} />
                </ListItem>
              </Link>
              <Link href="/family">
                <ListItem button>
                  <ListItemText primary="View Family Members" />
                </ListItem>
              </Link>
              <ListItem button onClick={handleLogout}>
                <ListItemText primary="Logout" />
              </ListItem>
            </List>
          </Drawer>
        </Box>
    </ThemeProvider>
  );
}