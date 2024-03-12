import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get, set, remove } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDzubS1mCLP9w44zpT4ZdQ8NEyaMp2oYw8",
  authDomain: "utak-io-project.firebaseapp.com",
  databaseURL:
    "https://utak-io-project-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "utak-io-project",
  storageBucket: "utak-io-project.appspot.com",
  messagingSenderId: "612195111458",
  appId: "1:612195111458:web:089086efbba95e0e55707b",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

async function writeItemData(
  itemId: number,
  itemName: string,
  itemCategory: string,
  itemPrice: number,
  itemCost: number,
  itemStock: number,
  itemAddOns: string,
  itemAddOnsSize: string
) {
  try {
    await set(ref(database, "items/" + itemId), {
      itemId,
      itemName,
      itemCategory,
      itemPrice,
      itemCost,
      itemStock,
      itemAddOns,
      itemAddOnsSize,
    });

    await set(ref(database, "itemId/"), itemId);

    return true;
  } catch (e) {
    return false;
  }
}

async function deleteItemData(itemId: number) {
  try {
    await remove(ref(database, `items/${itemId}`));
    // await set(ref(database, "itemId/"), Number(itemId) - 1);
    return true;
  } catch (e) {
    return false;
  }
}

interface itemListInterface {
  itemId: number;
  itemName: string;
  itemCategory: string;
  itemPrice: number;
  itemCost: number;
  itemStock: number;
  itemAddOns: string;
  itemAddOnsSize: string;
}

async function getItemId() {
  return new Promise<number | null>((resolve, reject) => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, "itemId"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          resolve(snapshot.val());
        } else {
          console.log("No data available");
          resolve(null);
        }
      })
      .catch((error) => {
        console.error(error);
        resolve(null);
      });
  });
}

async function getItemData() {
  // return new Promise<Array<itemListInterface> | null>((resolve, reject) => {
  return new Promise<Array<any> | null>((resolve, reject) => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, "items"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          resolve(snapshot.val());
        } else {
          console.log("No data available");
          resolve(null);
        }
      })
      .catch((error) => {
        console.error(error);
        resolve(null);
      });
  });
}

export { writeItemData, deleteItemData, getItemData, getItemId };
