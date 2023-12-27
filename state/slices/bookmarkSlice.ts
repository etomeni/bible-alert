import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { bibleInterface } from "@/constants/modelTypes";
// import bibleKJV from "@/assets/bible/kjvTS";
import { setLocalStorage } from "@/constants/resources";


const initialState: bibleInterface[] = [];

const bookmarkSlice = createSlice({
    name: "bookmark",
    initialState,
    reducers: {
        saveBookmark: (state, action: PayloadAction<bibleInterface>) => {
            const isUnique = state.every(item => item.book !== action.payload.book || item.chapter !== action.payload.chapter || item.verse !== action.payload.verse);
            if (isUnique) {
                state.unshift(action.payload);
                setLocalStorage("bookmark", state);
                return state;
            }
            // state.push(action.payload);
            // setLocalStorage("bookmark", state);
            // return state;
        },
        restoreBookmark: (state, action: PayloadAction<bibleInterface[]>) => {
            return action.payload;
        },
        initializeBookmark: (state, action: PayloadAction<any>) => {
            setLocalStorage("bookmark", initialState);
            return initialState;
        },
        deleteBookmark: (state, action: PayloadAction<bibleInterface>) => {
            const isUnique = state.filter(item => item.book !== action.payload.book || item.chapter !== action.payload.chapter || item.verse !== action.payload.verse);
            setLocalStorage("bookmark", isUnique);
            return isUnique;
        }
    }
});

export const { saveBookmark, deleteBookmark, initializeBookmark, restoreBookmark } = bookmarkSlice.actions;
export default bookmarkSlice.reducer;
