import { settingsInterface } from "@/constants/modelTypes";
import { setLocalStorage } from "@/constants/resources";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EventRegister } from 'react-native-event-listeners'


const initialState: settingsInterface = {
    fontSize: 16,
    colorTheme: 'dark',
    searchResultLimit: 500,
};

const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        setFontSize: (state, action: PayloadAction<number>) => {
            // console.log(action.payload);
            const newState = { ...state, fontSize: action.payload };
            setLocalStorage("settings", newState);
            return newState;
        },
        setColorTheme: (state, action: PayloadAction<"dark" | "light">) => {
            // console.log(action.payload);
            const newState = { ...state, colorTheme: action.payload };
            setLocalStorage("settings", newState);
            EventRegister.emit('colorTheme', action.payload);
            return newState;
        },
        setSearchResultLimit: (state, action: PayloadAction<number>) => {
            // console.log(action.payload);
            const newState =  { ...state, searchResultLimit: action.payload };
            setLocalStorage("settings", newState);
            return newState;
        },
        updateSettings: (state, action: PayloadAction<settingsInterface>) => {
            // console.log(action.payload);
            return action.payload;
        },
        resetSettings: (state, action: PayloadAction<any>) => {
            // console.log(action.payload);
            setLocalStorage("settings", initialState);
            return { ...initialState };
        }
    }
});

export const { setFontSize, setColorTheme, setSearchResultLimit, updateSettings, resetSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
