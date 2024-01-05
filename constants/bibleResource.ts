import { useState, memo } from 'react';
import { Text, Share, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-root-toast';

import all_KJV_Bible from "@/assets/bible/kjv_all";
import KJV_Bible from "@/assets/bible/kjvTS";
import { bibleInterface } from './modelTypes';


export function getBibleBookVerses(bible: bibleInterface[], bookName: string, chapter: number) {
    const _books: bibleInterface[] = bible.filter((book: bibleInterface) => book.book_name === bookName && book.chapter == chapter);
  
    const uniqueBookVerses = _books.reduce((acc: any, book: bibleInterface) => {
        const existingVerses = acc.find((b: any) => b === book.verse);
        if (!existingVerses) {
            acc.push(book.verse);
        }
        return acc;
    }, []);
  
    return({
        bible: _books,
        verses: uniqueBookVerses
    });
}

export async function shareBibleVerse(
    sharedText: string, sharedTitle: string, feedbackMsg = `shared!`, errorMsg = 'Request failed to share.!'
) {
    const modifiedText = sharedText.replace(/\u2039|\u203a/g, '');

    try {
        const shareResult = await Share.share({
            title: sharedTitle,
            message: modifiedText
        });

        if (shareResult.action === Share.sharedAction) {
            // if (shareResult.activityType) {
            //     console.log("shared with activity type of: ", shareResult.activityType);
            // } else {
            //     console.log("shared");
            // }

            // const msg = `shared!`;
            let toast = Toast.show(feedbackMsg, {
                duration: Toast.durations.LONG,
                position: Toast.positions.BOTTOM,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
            });

            // dismiss();
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);

        // const msg = `Request failed to share.!`;
        let toast = Toast.show(errorMsg, {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
        });
        return false;
    }
}

export async function copyBibleVerseToClipboard(copiedText: string, feedbackMsg = "copied to clipboard!") {
    const modifiedText = copiedText.replace(/\u2039|\u203a/g, '');
    await Clipboard.setStringAsync(modifiedText);

    // const msg = `copied to clipboard!`;
    let toast = Toast.show(feedbackMsg, {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
    });

    // dismiss();
    return true;
};

export function bibleVerseToRead(bibleVerse: bibleInterface) {
    let thingToSayStarting = '';
    const thingToSayEnding = `${bibleVerse.chapter + " vs" + bibleVerse.verse + " - " + bibleVerse.text}`;
    if (bibleVerse.book_name[0] == '1') {
        thingToSayStarting = "1st " + bibleVerse.book_name.slice(1);
    } else if(bibleVerse.book_name[0] == '2') {
        thingToSayStarting = "2nd " + bibleVerse.book_name.slice(1);
    } else {
        thingToSayStarting = bibleVerse.book_name;
    }

    // const thingToSay = `${thingToSayStarting + " " + thingToSayEnding}`;
    const thingToSay = `${thingToSayStarting + " " + thingToSayEnding}`.replace(/\u2039|\u203a/g, '');

    return thingToSay;
};


export function getBibleBooks(bible: bibleInterface[]) {
    const uniqueBooks = bible.reduce((acc: any[], book) => {
        const existingBook = acc.find((b) => b.book_name === book.book_name);
        if (!existingBook) {
            acc.push({
                book_name: book.book_name,
                book_number: book.book,
            });
        }
        return acc;
    }, []);
    
    return uniqueBooks;
}


export function getBibleBookChapters(bible: bibleInterface[], bookName: string) {
    const _books = bible.filter((book: any) => book.book_name === bookName);

    const uniqueBookChapters = _books.reduce((acc: any, book: any) => {
        const existingChapters = acc.find((b: any) => b === book.chapter);
        if (!existingChapters) {
            acc.push(book.chapter);
        }
        return acc;
    }, []);

    return uniqueBookChapters;
}
