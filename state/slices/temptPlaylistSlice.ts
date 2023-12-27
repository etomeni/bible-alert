import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { playlistInterface } from "@/constants/modelTypes";

const initialState: playlistInterface = {
    book_name: "",
    book: 0,
    chapter: 0,
    verse: 0,
    text: "",
    title: '',
    note: '',
}

const temptPlaylistSlice = createSlice({
    name: "temptPlaylist",
    initialState,
    reducers: {
        setTemptPlaylistData: (state, action: PayloadAction<playlistInterface>) => {
            // console.log(action.payload);
            return action.payload;
        },
        initializeTemptPlaylist: (state, action: PayloadAction<string>) => {
            // console.log(action.payload);
            
            return { ...initialState, action: action.payload };
        },
        setTemptPlaylistAction: (state, action: PayloadAction<string>) => {
            // console.log(action.payload);
            
            return { ...state, action: action.payload };
        }
    }
});

export const { setTemptPlaylistData, initializeTemptPlaylist, setTemptPlaylistAction } = temptPlaylistSlice.actions;
export default temptPlaylistSlice.reducer;
