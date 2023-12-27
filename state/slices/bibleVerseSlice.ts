import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { bibleInterface } from "@/constants/modelTypes";
import bibleKJV from "@/assets/bible/kjvTS";


const initialState: bibleInterface[] = bibleKJV.old.filter((book: bibleInterface) => book.book_name === "Genesis" && book.chapter == 1);

const bibleSlice = createSlice({
    name: "bible",
    initialState,
    reducers: {
        bibleDetails: (state, action: PayloadAction<bibleInterface[]>) => {
            return action.payload;
        },
    }
});

export const { bibleDetails } = bibleSlice.actions;
export default bibleSlice.reducer;
