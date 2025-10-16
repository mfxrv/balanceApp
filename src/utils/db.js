import { openDB } from 'idb';

const DB_NAME = 'balance-db';
const DB_VERSION = 1;
const STORE_EXPENSES = 'expenses';

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_EXPENSES)) {
      db.createObjectStore(STORE_EXPENSES, { keyPath: 'id', autoIncrement: true });
    }
  },
});

export async function addExpense(expense) {
  const db = await dbPromise;
  const tx = db.transaction(STORE_EXPENSES, 'readwrite');
  const id = await tx.store.add(expense);
  await tx.done;
  return id;
}

export async function listExpenses() {
  const db = await dbPromise;
  return db.getAll(STORE_EXPENSES);
}

export async function clearExpenses() {
  const db = await dbPromise;
  const tx = db.transaction(STORE_EXPENSES, 'readwrite');
  await tx.store.clear();
  await tx.done;
}