import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { bibleInterface } from "@/constants/modelTypes";
import bibleKJV from "@/assets/bible/kjvTS";

const _bible = bibleKJV.old.filter((book: bibleInterface) => book.book_name === "Genesis" && book.chapter == 1);

// const initialState: bibleInterface[] = _bible.length ? _bible : [];
const initialState: bibleInterface[] = _bible;

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
