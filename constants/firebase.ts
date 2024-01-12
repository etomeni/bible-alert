// import { user, whereCondition } from "../typeModel";
import { whereCondition } from "./modelTypes";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// import {
//   getAuth,
//   EmailAuthProvider,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
//   sendPasswordResetEmail,
//   sendEmailVerification,
//   updatePassword,
//   updateProfile,
//   updateEmail,
//   reauthenticateWithCredential,
//   deleteUser,
// } from "firebase/auth";
import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  startAfter,
  limit,
  orderBy,
  where,
  getCountFromServer,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import {
  getLocalStorage,
  removeLocalStorageItem,
  setLocalStorage,
} from "./resources";

const firebaseConfig = {
  apiKey: "AIzaSyBnIVSEi8s0SroJTgV7S51xyJlkFoFLWDw",
  authDomain: "tesafollowers.firebaseapp.com",
  projectId: "tesafollowers",
  storageBucket: "tesafollowers.appspot.com",
  messagingSenderId: "397379365418",
  appId: "1:397379365418:web:002edb21113cb8a7b27153",
  measurementId: "G-S68KCJ8HJ4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// export const fireAuth = getAuth(app);

// firestore
export function save2FirestoreDB(
  path: string,
  data: any,
  id: string | undefined = undefined
) {
  return new Promise<any>((resolve, reject) => {
    const collectionInstance = collection(db, path);

    if (id) {
      setDoc(doc(collectionInstance, id), data)
        .then((res: any) => {
          // console.log("Data Saved Successfully");
          // console.log(res);
          resolve(res || true);
        })
        .catch((err: any) => {
          console.log(err);
          reject(err || false);
        });
    } else {
      addDoc(collectionInstance, data)
        .then((res: any) => {
          // console.log("Data Saved Successfully");
          updateFirestoreData(path, res.id, { id: res.id });

          // console.log(res);
          resolve(res || true);
        })
        .catch((err: any) => {
          console.log(err);
          reject(err || false);
        });
    }
  });
}

export async function getOrderedServiceData(
  path: string,
  orderBypath: string = "createdAt",
  where_Condition: whereCondition = {
    property: "",
    condition: "==",
    value: "",
  },
  where_Condition2: whereCondition = {
    property: "",
    condition: "==",
    value: "",
  },
  where_Condition3: whereCondition = {
    property: "",
    condition: "==",
    value: "",
  },
  orderByDirection: "asc" | "desc" = "desc"
) {
  let results: any[] = [];

  // Query the first page of docs
  const docRef = collection(db, path);
  let first;
  // const first = query(docRef, orderBy(order_By), limit(limitNum));
  if (where_Condition.property && where_Condition.value) {
    if (where_Condition2.property && where_Condition2.value) {
      if (where_Condition3.property && where_Condition3.value) {
        first = query(
          docRef,
          where(
            where_Condition.property,
            where_Condition.condition,
            where_Condition.value
          ),
          where(
            where_Condition2.property,
            where_Condition2.condition,
            where_Condition2.value
          ),
          where(
            where_Condition3.property,
            where_Condition3.condition,
            where_Condition3.value
          ),
          orderBy(orderBypath, orderByDirection)
        );
      } else {
        first = query(
          docRef,
          where(
            where_Condition.property,
            where_Condition.condition,
            where_Condition.value
          ),
          where(
            where_Condition2.property,
            where_Condition2.condition,
            where_Condition2.value
          ),
          orderBy(orderBypath, orderByDirection)
        );
      }
    } else {
      first = query(
        docRef,
        where(
          where_Condition.property,
          where_Condition.condition,
          where_Condition.value
        ),
        orderBy(orderBypath, orderByDirection)
      );
    }
  } else {
    first = query(docRef, orderBy(orderBypath, orderByDirection));
  }
  const documentSnapshots = await getDocs(first);

  const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];

  documentSnapshots.forEach((doc: any) => {
    // doc.data() is never undefined for query doc snapshots
    // console.log(doc.id, " => ", doc.data());

    let _id = doc.id;
    let res = { ...doc.data(), _id, lastVisible };
    results.push(res);
  });

  return results;
}

export function getFirestoreDocumentData(path: string, docId: string) {
  return new Promise<any>(async (resolve, reject) => {
    const docRef = doc(db, path, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let _id = docSnap.id;
      let result = { ...docSnap.data(), _id };

      resolve(result);
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
      reject(false);
    }
  });
}

export async function getLimitedFirestoreDocumentData(
  path: string,
  limitNum: number,
  where_Condition: whereCondition = {
    property: "",
    condition: "==",
    value: "",
  },
  where_Condition2: whereCondition = {
    property: "",
    condition: "==",
    value: "",
  },
  where_Condition3: whereCondition = {
    property: "",
    condition: "==",
    value: "",
  }
) {
  let results: any[] = [];

  // Query the first page of docs
  const docRef = collection(db, path);
  let first;
  // const first = query(docRef, orderBy(order_By), limit(limitNum));
  if (where_Condition.property && where_Condition.value) {
    if (where_Condition2.property && where_Condition2.value) {
      if (where_Condition3.property && where_Condition3.value) {
        first = query(
          docRef,
          where(
            where_Condition.property,
            where_Condition.condition,
            where_Condition.value
          ),
          where(
            where_Condition2.property,
            where_Condition2.condition,
            where_Condition2.value
          ),
          where(
            where_Condition3.property,
            where_Condition3.condition,
            where_Condition3.value
          ),
          limit(limitNum)
        );
      } else {
        first = query(
          docRef,
          where(
            where_Condition.property,
            where_Condition.condition,
            where_Condition.value
          ),
          where(
            where_Condition2.property,
            where_Condition2.condition,
            where_Condition2.value
          ),
          limit(limitNum)
        );
      }
    } else {
      first = query(
        docRef,
        where(
          where_Condition.property,
          where_Condition.condition,
          where_Condition.value
        ),
        limit(limitNum)
      );
    }
  } else {
    first = query(docRef, limit(limitNum));
  }
  const documentSnapshots = await getDocs(first);

  const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];

  documentSnapshots.forEach((doc: any) => {
    // doc.data() is never undefined for query doc snapshots
    // console.log(doc.id, " => ", doc.data());

    let _id = doc.id;
    let res = { ...doc.data(), _id, lastVisible };
    results.push(res);
  });

  return results;
}

export async function getNextLimitedFirestoreDocumentData(
  path: string,
  last_Visible: any,
  limitNum: number,
  where_Condition: whereCondition = {
    property: "",
    condition: "==",
    value: "",
  },
  where_Condition2: whereCondition = {
    property: "",
    condition: "==",
    value: "",
  },
  where_Condition3: whereCondition = {
    property: "",
    condition: "==",
    value: "",
  }
) {
  let results: any[] = [];
  // Construct a new query starting at this document,
  // get the next 25 cities.
  const docRef = collection(db, path);
  let next;
  // next = query(docRef, orderBy(order_By), where(where_Condition.property, where_Condition.condition, where_Condition.value), startAfter(last_Visible), limit(limitNum));
  if (where_Condition.property && where_Condition.value) {
    if (where_Condition2.property && where_Condition2.value) {
      if (where_Condition3.property && where_Condition3.value) {
        next = query(
          docRef,
          where(
            where_Condition.property,
            where_Condition.condition,
            where_Condition.value
          ),
          where(
            where_Condition2.property,
            where_Condition2.condition,
            where_Condition2.value
          ),
          where(
            where_Condition3.property,
            where_Condition3.condition,
            where_Condition3.value
          ),
          startAfter(last_Visible),
          limit(limitNum)
        );
      } else {
        next = query(
          docRef,
          where(
            where_Condition.property,
            where_Condition.condition,
            where_Condition.value
          ),
          where(
            where_Condition2.property,
            where_Condition2.condition,
            where_Condition2.value
          ),
          startAfter(last_Visible),
          limit(limitNum)
        );
      }
    } else {
      next = query(
        docRef,
        where(
          where_Condition.property,
          where_Condition.condition,
          where_Condition.value
        ),
        startAfter(last_Visible),
        limit(limitNum)
      );
    }
  } else {
    next = query(docRef, startAfter(last_Visible), limit(limitNum));
  }
  const documentSnapshots = await getDocs(next);

  // console.log(documentSnapshots);
  const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
  // console.log("last", lastVisible);

  documentSnapshots.forEach((doc: any) => {
    // doc.data() is never undefined for query doc snapshots
    // console.log(doc.id, " => ", doc.data());

    let _id = doc.id;
    let res = { ...doc.data(), _id, lastVisible };
    results.push(res);
  });

  return results;
}

export async function getWhereOrderedLimitedData(
  path: string,
  limitNum: number,
  orderBypath: string = "createdAt",
  where_Condition: whereCondition = {
    property: "",
    condition: "==",
    value: "",
  },
  where_Condition2: whereCondition = {
    property: "",
    condition: "==",
    value: "",
  },
  where_Condition3: whereCondition = {
    property: "",
    condition: "==",
    value: "",
  },
  orderByDirection: "asc" | "desc" = "desc"
) {
  let results: any[] = [];

  // Query the first page of docs
  const docRef = collection(db, path);
  let first;
  // const first = query(docRef, orderBy(order_By), limit(limitNum));
  if (where_Condition.property && where_Condition.value) {
    if (where_Condition2.property && where_Condition2.value) {
      if (where_Condition3.property && where_Condition3.value) {
        first = query(
          docRef,
          where(
            where_Condition.property,
            where_Condition.condition,
            where_Condition.value
          ),
          where(
            where_Condition2.property,
            where_Condition2.condition,
            where_Condition2.value
          ),
          where(
            where_Condition3.property,
            where_Condition3.condition,
            where_Condition3.value
          ),
          orderBy(orderBypath, orderByDirection),
          limit(limitNum)
        );
      } else {
        first = query(
          docRef,
          where(
            where_Condition.property,
            where_Condition.condition,
            where_Condition.value
          ),
          where(
            where_Condition2.property,
            where_Condition2.condition,
            where_Condition2.value
          ),
          orderBy(orderBypath, orderByDirection),
          limit(limitNum)
        );
      }
    } else {
      first = query(
        docRef,
        where(
          where_Condition.property,
          where_Condition.condition,
          where_Condition.value
        ),
        orderBy(orderBypath, orderByDirection),
        limit(limitNum)
      );
    }
  } else {
    first = query(
      docRef,
      orderBy(orderBypath, orderByDirection),
      limit(limitNum)
    );
  }
  const documentSnapshots = await getDocs(first);

  const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];

  documentSnapshots.forEach((doc: any) => {
    // doc.data() is never undefined for query doc snapshots
    // console.log(doc.id, " => ", doc.data());

    let _id = doc.id;
    let res = { ...doc.data(), _id, lastVisible };
    results.push(res);
  });

  return results;
}

export async function getNextWhereOrderedLimitedData(
  path: string,
  last_Visible: any,
  limitNum: number,
  orderBypath: string = "createdAt",
  where_Condition: whereCondition = {
    property: "",
    condition: "==",
    value: "",
  },
  where_Condition2: whereCondition = {
    property: "",
    condition: "==",
    value: "",
  },
  where_Condition3: whereCondition = {
    property: "",
    condition: "==",
    value: "",
  },
  orderByDirection: "asc" | "desc" = "desc"
) {
  let results: any[] = [];

  // Construct a new query starting at this document,
  // get the next 25 cities.
  const docRef = collection(db, path);
  let next;
  // next = query(docRef, orderBy(order_By), where(where_Condition.property, where_Condition.condition, where_Condition.value), startAfter(last_Visible), limit(limitNum));
  if (where_Condition.property && where_Condition.value) {
    if (where_Condition2.property && where_Condition2.value) {
      if (where_Condition3.property && where_Condition3.value) {
        next = query(
          docRef,
          where(
            where_Condition.property,
            where_Condition.condition,
            where_Condition.value
          ),
          where(
            where_Condition2.property,
            where_Condition2.condition,
            where_Condition2.value
          ),
          where(
            where_Condition3.property,
            where_Condition3.condition,
            where_Condition3.value
          ),
          orderBy(orderBypath, orderByDirection),
          startAfter(last_Visible),
          limit(limitNum)
        );
      } else {
        next = query(
          docRef,
          where(
            where_Condition.property,
            where_Condition.condition,
            where_Condition.value
          ),
          where(
            where_Condition2.property,
            where_Condition2.condition,
            where_Condition2.value
          ),
          orderBy(orderBypath, orderByDirection),
          startAfter(last_Visible),
          limit(limitNum)
        );
      }
    } else {
      next = query(
        docRef,
        where(
          where_Condition.property,
          where_Condition.condition,
          where_Condition.value
        ),
        orderBy(orderBypath, orderByDirection),
        startAfter(last_Visible),
        limit(limitNum)
      );
    }
  } else {
    next = query(
      docRef,
      orderBy(orderBypath, orderByDirection),
      startAfter(last_Visible),
      limit(limitNum)
    );
  }
  const documentSnapshots = await getDocs(next);

  // console.log(documentSnapshots);
  const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
  // console.log("last", lastVisible);

  documentSnapshots.forEach((doc: any) => {
    // doc.data() is never undefined for query doc snapshots
    // console.log(doc.id, " => ", doc.data());

    let _id = doc.id;
    let res = { ...doc.data(), _id, lastVisible };
    results.push(res);
  });

  return results;
}

export async function countFirestoreDocs(
  path: string,
  where_Condition: whereCondition = {
    property: "",
    condition: "==",
    value: "",
  },
  where_Condition2: whereCondition = {
    property: "",
    condition: "==",
    value: "",
  }
) {
  const coll = collection(db, path);

  if (where_Condition.property) {
    if (where_Condition2.property) {
      const q = query(
        coll,
        where(
          where_Condition.property,
          where_Condition.condition,
          where_Condition.value
        ),
        where(
          where_Condition2.property,
          where_Condition2.condition,
          where_Condition2.value
        )
      );
      const snapshot = await getCountFromServer(q);
      return snapshot.data().count;
    } else {
      const q = query(
        coll,
        where(
          where_Condition.property,
          where_Condition.condition,
          where_Condition.value
        )
      );
      const snapshot = await getCountFromServer(q);
      return snapshot.data().count;
    }
  } else {
    const snapshot = await getCountFromServer(coll);
    return snapshot.data().count;
  }
}

export function updateFirestoreData(path: any, id: string, updateData: any) {
  return new Promise<any>((resolve, reject) => {
    const docInstance = doc(db, path, id);
    updateDoc(docInstance, updateData)
      .then((res: any) => {
        // console.log("Data updated" + res);
        resolve(res || true);
      })
      .catch((err: any) => {
        console.log(err);
        reject(err || false);
      });
  });
}

export function deleteFirestoreData(path: any, id: string) {
  return new Promise<any>((resolve, reject) => {
    const docInstance = doc(db, path, id);
    deleteDoc(docInstance)
      .then((res: any) => {
        // console.log("Data deleted" + res);
        resolve(res || true);
      })
      .catch((err: any) => {
        console.log(err);
        reject(err || false);
      });
  });
}

// auth
// export function signupFireAuth(value: any) {
//   return new Promise<any>((resolve, reject) => {
//     createUserWithEmailAndPassword(fireAuth, value.email, value.password).then(
//       (res: any) => resolve(res),
//       (err: any) => reject(err)
//     );
//   });
// }

// export function loginFireAuth(value: any) {
//   return new Promise<any>((resolve, reject) => {
//     signInWithEmailAndPassword(fireAuth, value.email, value.password).then(
//       (res) => resolve(res),
//       (error) => reject(error)
//     );
//   });
// }

// export function sendEmailVerificationFireAuth() {
//   return new Promise<any>((resolve, reject) => {
//     const currentUser: any = fireAuth.currentUser;
//     sendEmailVerification(currentUser).then(
//       (res: any) => resolve(res),
//       (err: any) => reject(err)
//     );
//   });
// }

// export function updateUserProfileFireAuth(
//   displayName: string,
//   photoURL: string = ""
// ) {
//   return new Promise<any>((resolve, reject) => {
//     const currentUser: any = fireAuth.currentUser;
//     let updateData: any;
//     if (photoURL) {
//       updateData = {
//         displayName,
//         photoURL,
//       };
//     } else {
//       updateData = {
//         displayName,
//       };
//     }

//     updateProfile(currentUser, updateData).then(
//       (res: any) => resolve(res),
//       (err: any) => reject(err)
//     );
//   });
// }

// export function updateEmailAddressFireAuth(
//   newEmail: string,
//   currentUserEmail: string,
//   currentUserPassword: string
// ) {
//   const currentUser: any = fireAuth.currentUser;
//   const credential = EmailAuthProvider.credential(
//     currentUserEmail,
//     currentUserPassword
//   );

//   return new Promise<any>((resolve, reject) => {
//     reauthenticateWithCredential(currentUser, credential)
//       .then(() => {
//         // User re-authenticated.
//         updateEmail(currentUser, newEmail).then(
//           (res: any) => resolve(res),
//           (err: any) => reject(err)
//         );
//       })
//       .catch((error) => {
//         console.log(error);
//         reject(error);
//         // An error ocurred
//         // ...
//       });
//   });
// }

// export function deleteFireAuthAcct(
//   currentUserEmail: string,
//   currentUserPassword: string
// ) {
//   const credential = EmailAuthProvider.credential(
//     currentUserEmail,
//     currentUserPassword
//   );
//   const currentUser: any = fireAuth.currentUser;

//   return new Promise<any>((resolve, reject) => {
//     reauthenticateWithCredential(currentUser, credential)
//       .then(() => {
//         // User re-authenticated.
//         deleteUser(currentUser).then(
//           // User deleted.
//           (res: any) => resolve(res),
//           (err: any) => reject(err)
//         );
//       })
//       .catch((error) => {
//         console.log(error);
//         reject(error);
//         // An error ocurred
//         // ...
//       });
//   });
// }

// export function updatePasswordFireAuth(
//   newPassword: string,
//   currentUserEmail: string,
//   currentUserPassword: string
// ) {
//   const credential = EmailAuthProvider.credential(
//     currentUserEmail,
//     currentUserPassword
//   );
//   const currentUser: any = fireAuth.currentUser;

//   return new Promise<any>((resolve, reject) => {
//     reauthenticateWithCredential(currentUser, credential)
//       .then(() => {
//         // User re-authenticated.
//         updatePassword(currentUser, newPassword).then(
//           (res: any) => resolve(res),
//           (err: any) => reject(err)
//         );
//       })
//       .catch((error) => {
//         console.log(error);
//         reject(error);
//         // An error ocurred
//         // ...
//       });
//   });
// }

// export function sendPasswordResetEmailFireAuth(email: any) {
//   return new Promise<any>((resolve, reject) => {
//     sendPasswordResetEmail(fireAuth, email)
//       .then((res: any) => {
//         resolve(res || true);
//       })
//       .catch((error: any) => {
//         // console.log(error);
//         reject(error || false);
//       });
//   });
// }

// export async function IsLoggedIn(): Promise<boolean | any> {
//     const responseData: any = {
//         state: true || false,
//         message: "",
//     };

//     const getLocalUser = () => {
//         getLocalStorage("user").then(
//             (res: any) => {
//                 if (res) {
//                     currentUser = res;
//                     isCurrentUserLoggedIn = true;
//                     setLocalStorage("isCurrentUserLoggedIn", true);
//                 } else {
//                     isCurrentUserLoggedIn = false;
//                     removeLocalStorageItem("isCurrentUserLoggedIn");
//                     removeLocalStorageItem("user");
//                 }
//             },
//             (err: any) => {
//                 isCurrentUserLoggedIn = false;
//                 removeLocalStorageItem("isCurrentUserLoggedIn");
//                 removeLocalStorageItem("user");
//             }
//         );
//     }

//     await new Promise((resolve, reject) =>
//         fireAuth.onAuthStateChanged(
//             (authRes: any) => {
//                 // console.log(authRes);

//                 if (authRes) {
//                     // User is signed in.
//                     getUserData(authRes);
//                     isCurrentUserLoggedIn = true;
//                     responseData.state = true;
//                     responseData.message = "Success, you're logged in.";
//                     responseData.user = authRes;

//                     return resolve(responseData);
//                 } else {
//                     // No user is signed in.
//                     isCurrentUserLoggedIn = false;
//                     responseData.state = false;
//                     responseData.message = "Error, no user logged in.";

//                     return reject(responseData);
//                 }
//             },
//             // Prevent console error
//             (error: any) => {
//                 // console.log(error);
//                 responseData.state = false;
//                 responseData.message = "Error...";
//                 responseData.error = error;

//                 getLocalUser();
//                 return reject(responseData);
//             }
//         )
//     );

//     return responseData;
// }

// export function logoutFirebaseUser() {
//   return new Promise<any>((resolve, reject) => {
//     signOut(fireAuth).then(
//       (res: any) => {
//         logOut();
//         resolve(res || true);
//       },
//       (error: any) => {
//         logOut();
//         reject(error || false);
//       }
//     );

//     const logOut = () => {
//       // isCurrentUserLoggedIn = false;
//       // currentUser = currentUser!;

//       removeLocalStorageItem("isCurrentUserLoggedIn");
//       removeLocalStorageItem("user");
//     };
//   });
// }

export function uploadFile(path: any, file: any) {
  const storage = getStorage(); // Create a child reference
  const storageRef = ref(storage, path); // 'file' comes from the Blob or File API

  return new Promise<any>((resolve, reject) => {
    uploadBytes(storageRef, file).then(
      async (snapshot) => {
        // console.log(snapshot);
        const fullPath = snapshot.ref.fullPath;
        await getDownloadURL(ref(storage, snapshot.ref.fullPath)).then(
          (url) => {
            // this.uploadedFiles.fileSrc = url;
            resolve(url);
          },
          (err: any) => {
            reject(err || false);
          }
        );
      },
      (error: any) => {
        reject(error || false);
      }
    );
  });
}

// export function getUserData(authUserData: any) {
//   getFirestoreDocumentData("users", authUserData.uid).then(
//     (res: any) => {
//       // console.log(res);
//       if (res) {
//         // currentUser = res;
//         setLocalStorage("user", res);
//       }
//     },
//     (err: any) => {
//       console.log(err);
//       getLocalStorage("user").then((res: any) => {
//         if (res) {
//           //   currentUser = res;
//         }
//       });
//     }
//   );
// }

export function evaluatedDate(
  type: "compare" | "display",
  inputDate: any = ""
) {
  const dateObj = inputDate ? new Date(inputDate) : new Date();
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so we add 1
  const day = String(dateObj.getDate()).padStart(2, "0");

  if (type == "display") {
    return `${year}-${month}-${day}`;
  }

  if (type == "compare") {
    return `${year}${month}${day}`;
  }

  return `${year}-${month}-${day}`;
}

export function formatedTime(inputDate: any = "") {
  const now = inputDate ? new Date(inputDate) : new Date();

  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  const formattedTime = `${hours}:${minutes}:${seconds}`;

  return formattedTime;
}
