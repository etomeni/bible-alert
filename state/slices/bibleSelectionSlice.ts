import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { selectedBibleInterface } from "@/constants/modelTypes";

const initialState: selectedBibleInterface = {
  book_name: "Genesis",
  book: 1,
  chapter: 1,
  verse: 1,
};

const selectedBibleBookSlice = createSlice({
  name: "selectedBibleBook",
  initialState,
  reducers: {
    set_SelectedBible: (
      state,
      action: PayloadAction<selectedBibleInterface>
    ) => {
      return action.payload;
    },
    setSelectedBibleBook: (state, action: PayloadAction<any>) => {
      const newState = {
        ...initialState,
        book_name: action.payload.book_name,
        book: action.payload.book_number,
      };
      return newState;
    },
    setSelectedChapter: (state, action: PayloadAction<number>) => {
      // state.chapter = action.payload;

      const newState = {
        ...state,
        chapter: action.payload,
      };

      return newState;
    },
    setSelectedVerse: (state, action: PayloadAction<number>) => {
      // state.verse = action.payload;

      const newState = {
        ...state,
        chapter: action.payload,
      };

      return newState;
      // return state;
    },
  },
});

export const {
  set_SelectedBible,
  setSelectedBibleBook,
  setSelectedChapter,
  setSelectedVerse,
} = selectedBibleBookSlice.actions;
export default selectedBibleBookSlice.reducer;
