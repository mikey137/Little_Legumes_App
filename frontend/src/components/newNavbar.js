import React, { useState, Fragment } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSeedling, faBars, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import { apiConfig } from '../Constants'


export default function NewNavbar({isLoggedIn, setIsLoggedIn}){
    const [isNavMenuOpen, setIsNavMenuOpen] = useState(false)

    let url = apiConfig.url.API_URL

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

    return(
        <Fragment>
            <div className="navbar-header">
                <div className="logo-wrapper">
                    <FontAwesomeIcon className = "logo" icon={faSeedling} size="3x"/>
                    <h3>Little Legumes</h3>
                </div>
                <FontAwesomeIcon 
                    className = "bars" 
                    icon={faBars} 
                    size="2x"
                    onClick={() => setIsNavMenuOpen(true)}
                />
            </div>
            <ul className = { isNavMenuOpen ? "navbar-menu active" : 'navbar-menu' }>
                <FontAwesomeIcon 
                    className = "chevron-right" 
                    icon={faChevronRight} 
                    onClick={() => setIsNavMenuOpen(false)}
                />
                {isLoggedIn ? 
                    <Fragment>
                        <li className="navbar-menu-item">   
                            <a href="/viewfamily">View Family</a>
                        </li>
                        <li className="navbar-menu-item">   
                            <a href="/calendar">My Calendar</a>
                        </li>
                        <li className="navbar-menu-item" onClick={handleLogout}>   
                            Logout
                        </li>
                    </Fragment>
                    :
                    <Fragment>
                        <li className="navbar-menu-item">   
                            <a href="/login">Login</a>
                        </li>
                        <li className="navbar-menu-item">
                            <a href="/register">Register</a>
                        </li>
                        <li className="navbar-menu-item">
                            <a href="/demo">View Demo</a>
                        </li>
                    </Fragment>
                }
            </ul>
        </Fragment>
    )
}