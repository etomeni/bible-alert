import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { bibleInterface } from "@/constants/modelTypes";
// import bibleKJV from "@/assets/bible/kjvTS";


const initialState: bibleInterface[] = [];

const selectedBibleSlice = createSlice({
    name: "biblVerse",
    initialState,
    reducers: {
        bibleVerseDetails: (state, action: PayloadAction<bibleInterface[]>) => {
            return action.payload;
        },
    }
});

export const { bibleVerseDetails } = selectedBibleSlice.actions;
export default selectedBibleSlice.reducer;
