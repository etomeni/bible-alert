import { useState, memo } from "react";
import { Text, Share, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-root-toast";

import all_KJV_Bible from "@/assets/bible/kjv_all";
import KJV_Bible from "@/assets/bible/kjvTS";
import {
  _bibleBookSelection_,
  _bibleVerseSelection_,
  bibleInterface,
  selectedBibleInterface,
} from "./modelTypes";

export function getBibleBookVerses(
  bible: bibleInterface[],
  bookName: string,
  chapter: number
) {
  const _books: bibleInterface[] = bible.filter(
    (book: bibleInterface) =>
      book.book_name === bookName && book.chapter == chapter
  );

  const uniqueBookVerses = _books.reduce((acc: any, book: bibleInterface) => {
    const existingVerses = acc.find((b: any) => b === book.verse);
    if (!existingVerses) {
      acc.push(book.verse);
    }
    return acc;
  }, []);

  return {
    bible: _books,
    verses: uniqueBookVerses,
  };
}

export async function shareBibleVerse(
  sharedText: string,
  sharedTitle: string,
  feedbackMsg = `shared!`,
  errorMsg = "Request failed to share.!"
) {
  const modifiedText = sharedText.replace(/\u2039|\u203a/g, "");

  try {
    const shareResult = await Share.share({
      title: sharedTitle,
      message: modifiedText,
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

export async function copyBibleVerseToClipboard(
  copiedText: string,
  feedbackMsg = "copied to clipboard!"
) {
  const modifiedText = copiedText.replace(/\u2039|\u203a/g, "");
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
}

export function bibleVerseToRead(bibleVerse: bibleInterface) {
  let thingToSayStarting = "";
  const thingToSayEnding = `${
    bibleVerse.chapter + " vs" + bibleVerse.verse + " - " + bibleVerse.text
  }`;
  if (bibleVerse.book_name[0] == "1") {
    thingToSayStarting = "1st " + bibleVerse.book_name.slice(1);
  } else if (bibleVerse.book_name[0] == "2") {
    thingToSayStarting = "2nd " + bibleVerse.book_name.slice(1);
  } else {
    thingToSayStarting = bibleVerse.book_name;
  }

  // const thingToSay = `${thingToSayStarting + " " + thingToSayEnding}`;
  const thingToSay = `${thingToSayStarting + " " + thingToSayEnding}`.replace(
    /\u2039|\u203a/g,
    ""
  );

  return thingToSay;
}

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

  //   console.log(uniqueBooks);

  return uniqueBooks;
}

export function getBibleBookChapters(
  bible: bibleInterface[],
  bookName: string
) {
  const _books = bible.filter((book: any) => book.book_name === bookName);

  const uniqueBookChapters = _books.reduce((acc: any, book: bibleInterface) => {
    const existingChapters = acc.find((b: any) => b === book.chapter);
    if (!existingChapters) {
      acc.push(book.chapter);
    }
    return acc;
  }, []);

  return uniqueBookChapters;
}

export function restructureBibleDataset(data: any = all_KJV_Bible) {
  const restructuredData: _bibleBookSelection_[] = [];

  // Group verses by book and chapter
  const groupedVerses = data.reduce((acc: any, verse: any) => {
    const bookKey = verse.book_name;
    const chapterKey = verse.chapter;

    acc[bookKey] = acc[bookKey] || {};
    acc[bookKey][chapterKey] = acc[bookKey][chapterKey] || [];
    acc[bookKey][chapterKey].push(verse);

    return acc;
  }, {});

  // Create book objects with the desired structure
  for (const bookName in groupedVerses) {
    const chapters: _bibleVerseSelection_[] = [];

    for (const chapterNumber in groupedVerses[bookName]) {
      const chapterVerses = groupedVerses[bookName][chapterNumber];
      const totalVerses = chapterVerses.length;

      chapters.push({
        chapter_number: Number(chapterNumber),
        total_verses: Number(totalVerses),
      });
    }

    restructuredData.push({
      book_name: bookName,
      book_number: data.find((verse: any) => verse.book_name === bookName).book,
      total_chapters: chapters.length,
      chapters: chapters,
    });
  }

  return restructuredData;
}

export function getBibleEndChapter(selectedBibleBook: selectedBibleInterface) {
  const endChapters: number[] = getBibleBookChapters(
    selectedBibleBook.book > 39 ? KJV_Bible.new : KJV_Bible.old,
    selectedBibleBook.book_name
  );

  return endChapters;
  //   console.log(endChapters);
}
