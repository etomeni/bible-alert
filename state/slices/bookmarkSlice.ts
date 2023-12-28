import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { bibleInterface } from "@/constants/modelTypes";
import { setLocalStorage } from "@/constants/resources";


const initialState: bibleInterface[] = [];

const bookmarkSlice = createSlice({
    name: "bookmark",
    initialState,
    reducers: {
        saveBookmark: (state, action: PayloadAction<bibleInterface>) => {
            // const isUnique = state.every(item => item.book !== action.payload.book || item.chapter !== action.payload.chapter || item.verse !== action.payload.verse);
            // if (isUnique) {
            //     state.unshift(action.payload);
            //     setLocalStorage("bookmark", state);
            //     return state;
            // }

            const newState = state.filter(item => item.book !== action.payload.book || item.chapter !== action.payload.chapter || item.verse !== action.payload.verse);
            newState.unshift(action.payload);
            setLocalStorage("bookmark", newState);
            return newState;
        },
        restoreBookmark: (state, action: PayloadAction<bibleInterface[]>) => {
            return action.payload;
        },
        initializeBookmark: (state, action: PayloadAction<any>) => {
            setLocalStorage("bookmark", initialState);
            return initialState;
        },
        deleteBookmark: (state, action: PayloadAction<bibleInterface>) => {
            const newBookmark = state.filter(item => item.book !== action.payload.book || item.chapter !== action.payload.chapter || item.verse !== action.payload.verse);
            setLocalStorage("bookmark", newBookmark);
            return newBookmark;
        }
    }
});

export const { saveBookmark, deleteBookmark, initializeBookmark, restoreBookmark } = bookmarkSlice.actions;
export default bookmarkSlice.reducer;
