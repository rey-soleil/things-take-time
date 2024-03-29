"use client"

import { BarChart } from '@mui/icons-material';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { BottomNavigation, BottomNavigationAction } from "@mui/material";

export default function NavBar() {
    if (typeof window === 'undefined') return <></>

    const path = window.location.pathname;

    return (
        <BottomNavigation
            showLabels
            className="fixed bottom-0 w-full flex !justify-evenly z-10"
            value={path}
        >
            <BottomNavigationAction className='' icon={<ScheduleIcon />} label="Timer" href='/' value="/" />
            <BottomNavigationAction className='' icon={<BarChart />} label="Insights" href='/insights' value="/insights" />
        </BottomNavigation>
    )
}