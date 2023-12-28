import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { _Playlists_, bibleInterface } from "@/constants/modelTypes";
import { setLocalStorage } from "@/constants/resources";

const initialState: _Playlists_[] = [];

type _playlistInterface_ = {
    title: string,
    bibleVerse: bibleInterface
}
type _editPlaylistInterface_ = {
    oldTitle: string,
    newTitle: string,
    description: string,
}

const playlistSlice = createSlice({
    name: "playlists",
    initialState,
    reducers: {
        createNewPlaylist: (state, action: PayloadAction<_playlistInterface_>) => {
            // console.log(action.payload);
            const newPlaylist: _Playlists_ = {
                title: action.payload.title,
                lists: [action.payload.bibleVerse]
            };
            state.unshift(newPlaylist);

            setLocalStorage("playlists", state);
            return state;
        },
        editPlaylist: (state, action: PayloadAction<_editPlaylistInterface_>) => {
            // console.log(action.payload);
            const indexOfObject = state.findIndex(obj => obj.title == action.payload.oldTitle);
            if (indexOfObject !== -1) {
                state[indexOfObject].title = action.payload.newTitle;
                state[indexOfObject].description = action.payload.description;

                setLocalStorage("playlists", state);
                return state;
            }

            return state;
        },
        addToPlaylist: (state, action: PayloadAction<_playlistInterface_>) => {
            // console.log(action.payload);
            const indexOfObject = state.findIndex(obj => obj.title == action.payload.title);
            if (indexOfObject !== -1) {
                const updatedArray = [...state];

                const updatedInnerArray = updatedArray[indexOfObject].lists.filter(
                    item => item.book !== action.payload.bibleVerse.book || item.chapter !== action.payload.bibleVerse.chapter || item.verse !== action.payload.bibleVerse.verse
                );
                updatedInnerArray.unshift(action.payload.bibleVerse);
                updatedArray[indexOfObject] = {
                    ...updatedArray[indexOfObject],
                    lists: updatedInnerArray,
                };

                // updatedArray[indexOfObject].lists.unshift(action.payload.bibleVerse);

                setLocalStorage("playlists", updatedArray);
                return updatedArray;
            }
            
            setLocalStorage("playlists", state);
            return state;
        },
        removeFromPlaylist: (state, action: PayloadAction<_playlistInterface_>) => {
            // console.log(action.payload);
            const indexOfObject = state.findIndex(obj => obj.title === action.payload.title);

            if (indexOfObject !== -1) {
                // If the object with the specified id is found
                const updatedArray = [...state];
                const updatedInnerArray = updatedArray[indexOfObject].lists.filter(
                    item => item.book !== action.payload.bibleVerse.book || item.chapter !== action.payload.bibleVerse.chapter || item.verse !== action.payload.bibleVerse.verse
                );

                updatedArray[indexOfObject] = {
                    ...updatedArray[indexOfObject],
                    lists: updatedInnerArray,
                };

                setLocalStorage("playlists", updatedArray);
                return updatedArray;
            }

            setLocalStorage("playlists", state);
            return state ;
        },
        restorePlaylists: (state, action: PayloadAction<_Playlists_[]>) => {
            // console.log(action.payload);
            return action.payload;
        },
        initializePlaylists: (state, action: PayloadAction<any>) => {
            // console.log(action.payload);
            setLocalStorage("playlists", initialState);
            return initialState;
        },
        deletePlaylist: (state, action: PayloadAction<_Playlists_>) => {
            const newPlaylists = state.filter(item => item.title !== action.payload.title);
            setLocalStorage("playlists", newPlaylists);
            return newPlaylists;
        }
    }
});

export const { createNewPlaylist, editPlaylist, addToPlaylist, removeFromPlaylist, restorePlaylists, initializePlaylists, deletePlaylist } = playlistSlice.actions;
export default playlistSlice.reducer;
