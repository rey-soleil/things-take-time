"use client"

import { BarChart } from '@mui/icons-material';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { useState } from 'react';

export default function NavBar() {
    const [value, setValue] = useState(0);

    return (
        <BottomNavigation showLabels className="fixed bottom-0 w-full flex justify-evenly" value={value}
            onChange={(event, newValue) => {
                setValue(newValue);
            }}>
            <BottomNavigationAction className='' icon={<ScheduleIcon />} label="Timer" href='/' />
            <BottomNavigationAction className='' icon={<BarChart />} label="Insights" href='/insights' />
        </BottomNavigation>
    )
}