import { configureStore } from '@reduxjs/toolkit';
import bibleVerseSlice from './slices/bibleVerseSlice';
import bibleSelectionSlice from './slices/bibleSelectionSlice';
import selectedBibleSlice from './slices/selectedBibleVerseModalSlice';
import bookmarkSlice from './slices/bookmarkSlice';
import temptPlaylistSlice from './slices/temptPlaylistSlice';
import settingsSlice from './slices/settingsSlice';
import playlistSlice from './slices/playlistSlice';


export const store = configureStore({
    reducer: {
        bible: bibleVerseSlice,
        selectedBibleBook: bibleSelectionSlice,
        biblVerse: selectedBibleSlice,
        bookmark: bookmarkSlice,
        temptPlaylist: temptPlaylistSlice,
        settings: settingsSlice,
        playlists: playlistSlice
    }
})
  

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
