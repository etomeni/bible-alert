import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { playlistInterface } from "@/constants/modelTypes";
import { setLocalStorage } from "@/constants/resources";

const initialState: playlistInterface[] = [];

const playlistSlice = createSlice({
    name: "playlists",
    initialState,
    reducers: {
        addToPlaylists: (state, action: PayloadAction<playlistInterface>) => {
            // console.log(action.payload);
            const newState = state.filter(item => item.book !== action.payload.book || item.chapter !== action.payload.chapter || item.verse !== action.payload.verse);
            newState.unshift(action.payload);
            setLocalStorage("playlists", newState);
            return newState;
        },
        restorePlaylists: (state, action: PayloadAction<playlistInterface[]>) => {
            // console.log(action.payload);
            return action.payload;
        },
        initializePlaylists: (state, action: PayloadAction<any>) => {
            // console.log(action.payload);
            setLocalStorage("playlists", initialState);
            return initialState;
        },
        deletePlaylist: (state, action: PayloadAction<playlistInterface>) => {
            const newPlaylists = state.filter(item => item.book !== action.payload.book || item.chapter !== action.payload.chapter || item.verse !== action.payload.verse);
            setLocalStorage("playlists", newPlaylists);
            return newPlaylists;
        }
    }
});

export const { addToPlaylists, restorePlaylists, initializePlaylists, deletePlaylist } = playlistSlice.actions;
export default playlistSlice.reducer;
