import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  _bibleBookSelection_,
  _bibleVerseSelection_,
  _Playlists_,
  bibleInterface,
} from "@/constants/modelTypes";

type temptDataInterface = {
  temptPlaylist: _Playlists_;
  temptBibleVerse: bibleInterface;
  temptBibleBookSelection: _bibleBookSelection_;
  temptBibleVerseSelection: _bibleVerseSelection_;
};

const initialState: temptDataInterface = {
  temptPlaylist: {
    title: "",
    // description: undefined,
    // schedule: undefined,
    // lastPlayed: undefined,
    lists: [],
  },
  temptBibleVerse: {
    book_name: "",
    book: 0,
    chapter: 0,
    verse: 0,
    text: "",
    // formattedText: undefined
  },
  temptBibleBookSelection: {
    book_name: "",
    book_number: 0,
    total_chapters: 0,
    chapters: [],
  },
  temptBibleVerseSelection: {
    chapter_number: 0,
    total_verses: 0,
  },
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

    setTemptBibleBookSelectionData: (
      state,
      action: PayloadAction<_bibleBookSelection_>
    ) => {
      // console.log(action.payload);
      state.temptBibleBookSelection = action.payload;
      return state;
    },
    setTemptBibleVerseSelectionData: (
      state,
      action: PayloadAction<_bibleVerseSelection_>
    ) => {
      // console.log(action.payload);
      state.temptBibleVerseSelection = action.payload;
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
    },
  },
});

export const {
  setTemptPlaylistData,
  setTemptBibleVerseData,
  setTemptBibleBookSelectionData,
  setTemptBibleVerseSelectionData,
  initializeTemptPlaylist,
  initializeTemptBibleVerse,
} = temptDataSlice.actions;
export default temptDataSlice.reducer;
