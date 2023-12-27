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


export type playlistInterface = {
    book_name: string,
    book: number,
    chapter: number,
    verse: number,
    text: string,
    title?: string,
    note?: string,
    action?: string
}

export type settingsInterface = {
    fontSize: number,
    colorTheme: "dark" | "light",
    searchResultLimit: number,
};