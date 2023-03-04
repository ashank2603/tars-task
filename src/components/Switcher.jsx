import { Switch } from "antd";
import { useState } from "react";
import useDarkSide from "../hooks/useDarkSide";


export const Switcher = () => {
    const [colorTheme, setTheme] = useDarkSide();
    const [darkSide, setDarkSide] = useState(
        colorTheme === "light" ? true : false
    );
    
    const toggleDarkMode = (checked) => {
        setTheme(colorTheme);
        setDarkSide(checked);
    };

    return (
        <>
            <Switch 
                checked={darkSide}
                onChange={toggleDarkMode}
                size={30}
            />
        </>
    )
}