import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { _Playlists_, bibleInterface } from "@/constants/modelTypes";

type temptDataInterface = {
    temptPlaylist: _Playlists_,
    temptBibleVerse: bibleInterface,   
}

const initialState: temptDataInterface = {
    temptPlaylist: {
        title: "",
        // description: undefined,
        // schedule: undefined,
        // lastPlayed: undefined,
        lists: []
    },
    temptBibleVerse: {
        book_name: "",
        book: 0,
        chapter: 0,
        verse: 0,
        text: "",
        // formattedText: undefined
    }
};

const temptDataSlice = createSlice({
    name: "temptData",
    initialState,
    reducers: {
        setTemptPlaylistData: (state, action: PayloadAction<_Playlists_>) => {
            // console.log(action.payload);
            state.temptPlaylist = action.payload;
            return state;
        },
        setTemptBibleVerseData: (state, action: PayloadAction<bibleInterface>) => {
            // console.log(action.payload);
            state.temptBibleVerse = action.payload;
            return state;
        },
        initializeTemptPlaylist: (state, action: PayloadAction<any>) => {
            // console.log(action.payload);
            state.temptPlaylist = initialState.temptPlaylist;
            return state;
        },
        initializeTemptBibleVerse: (state, action: PayloadAction<any>) => {
            // console.log(action.payload);
            state.temptBibleVerse = initialState.temptBibleVerse;
            return state;
        }
    }
});

export const { setTemptPlaylistData, setTemptBibleVerseData, initializeTemptPlaylist, initializeTemptBibleVerse } = temptDataSlice.actions;
export default temptDataSlice.reducer;
