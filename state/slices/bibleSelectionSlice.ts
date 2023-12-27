import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { selectedBibleInterface } from "@/constants/modelTypes";

const initialState: selectedBibleInterface = {
    book_name: "Genesis",
    book: 1,
    chapter: 1,
    verse: 1,
}

const selectedBibleBookSlice = createSlice({
    name: "selectedBibleBook",
    initialState,
    reducers: {
        selectedBibleBook: (state, action: PayloadAction<any>) => {
            const newState = { 
                ...initialState, 
                book_name: action.payload.book_name, 
                book: action.payload.book_number 
            }
            return newState;
        },
        selectedChapter: (state, action: PayloadAction<number>) => {
            state.chapter = action.payload;
            return state;
        },
        selectedVerse: (state, action: PayloadAction<number>) => {
            state.verse = action.payload;
            return state;
        }
    }
});

export const { selectedBibleBook, selectedChapter, selectedVerse } = selectedBibleBookSlice.actions;
export default selectedBibleBookSlice.reducer;
