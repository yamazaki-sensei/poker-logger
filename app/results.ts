import { useGameState, type GameState } from "./game";
import { useTable, type TableState } from "./table";

const dbName = "pokerLogger";
const storeName = "results";
const dbVersion = 1;

type GameResult = Omit<
  GameState,
  | "currentRound"
  | "currentPlayer"
  | "currentBetSizes"
  | "betSize"
  | "activePlayers"
  | "allPlayers"
  | "gameIndex"
>;

export type BoardResult = {
  game: GameState;
  table: TableState;
};

// IndexedDBを開く関数
const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onerror = () => {
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "date" });
      }
    };
  });
};

export const loadResults = async (): Promise<
  { date: Date; payload: BoardResult }[]
> => {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        const results = request.result as {
          date: string;
          payload: BoardResult;
        }[];
        resolve(
          results.map((v) => ({
            date: new Date(v.date),
            payload: v.payload,
          }))
        );
      };

      request.onerror = () => {
        reject(request.error);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error("Error loading results:", error);
    return [];
  }
};

export const useResultsWriter = (): {
  storeCurrentBoard: () => void;
} => {
  const { gameState } = useGameState();
  const { table } = useTable();

  const storeCurrentBoard = async () => {
    try {
      const db = await openDatabase();
      const timestamp = new Date().toISOString();
      const gameResult: GameResult = {
        myPosition: gameState.myPosition,
        actions: gameState.actions,
        communityCards: gameState.communityCards,
        playersState: gameState.playersState,
        memo: gameState.memo,
        potSize: gameState.potSize,
        effectiveStack: gameState.effectiveStack,
      };

      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);

      const newItem = {
        date: timestamp,
        payload: {
          game: gameResult,
          table: table,
        },
      };

      store.add(newItem);

      transaction.oncomplete = () => {
        db.close();
      };

      transaction.onerror = (event) => {
        console.error("Transaction error:", transaction.error);
      };
    } catch (error) {
      console.error("Error storing board:", error);
    }
  };

  return {
    storeCurrentBoard,
  };
};

export const removeBoard = async (index: number) => {
  try {
    const results = await loadResults();
    if (index >= 0 && index < results.length) {
      const dateToRemove = results[index].date.toISOString();

      const db = await openDatabase();
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);

      store.delete(dateToRemove);

      transaction.oncomplete = () => {
        db.close();
      };

      transaction.onerror = () => {
        console.error("Error removing board:", transaction.error);
      };
    }
  } catch (error) {
    console.error("Error removing board:", error);
  }
};
