import React from "react"
import Calendar from "./calendar";
import Navbar from "../navbar";
import { colorTheme } from "../../ThemeContext";
import { ThemeProvider } from "@mui/material";
import BottomNavbar from "./bottomNavigation";


export default function Dashboard(){

    return(
        <ThemeProvider theme={colorTheme}>
            <div className= "dashboard-container">
                <Navbar />
                <Calendar />
                <BottomNavbar />
            </div>
        </ThemeProvider>
    )
}