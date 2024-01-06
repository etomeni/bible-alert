import { Voice } from "expo-speech";

export type bibleInterface = {
    book_name: string,
    book: number,
    chapter: number,
    verse: number,
    text: string,
    formattedText?: any,
}

export type selectedBibleInterface = {
    book_name: string,
    book: number,
    chapter: number,
    verse: number,
}


// export type playlistInterface = {
//     book_name: string,
//     book: number,
//     chapter: number,
//     verse: number,
//     text: string,
//     title?: string,
//     note?: string,
//     action?: string
// }

export type settingsInterface = {
    fontSize: number,
    colorTheme: "dark" | "light",
    searchResultLimit: number,
    notificationToken: string,
    voice: Voice,
    // voiceName: string,
    // voice: {
    //     identifier: string,
    //     name: string,
    //     quality: any,
    //     language: string
    // }
};

export type _schedule_ = {
    status: boolean,
    hourIntervals: string,
    minutesIntervals: string,
}

export type _Playlists_ = {
    title: string,
    description?: string,
    schedule?: _schedule_,
    lastPlayed?: bibleInterface,
    lists: bibleInterface[],
};


export type scheduleInterface = {
    // status: boolean,
    repeats: boolean,
    hour: number,
    minute: number
}

export type notificationData = {
    title: string, 
    msg: string, 
    schedule: scheduleInterface, 
    playlistData: _Playlists_,
    extraData?: string,
    bibleVerse: bibleInterface
}