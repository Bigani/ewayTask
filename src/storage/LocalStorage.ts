import { useState, useEffect, useCallback } from "react";
import { TContact } from "../eWayAPI/ContactsResponse";

const STORAGE_KEY = "contactsHistoryV1";

export function loadHistory(): TContact[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TContact[]) : [];
  } catch {
    return [];
  }
}

export function saveHistory(list: TContact[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function usePersistentHistory() {
  const [contactHistory, setHistory] = useState<TContact[]>(() =>
    loadHistory()
  );

  useEffect(() => {
    saveHistory(contactHistory);
  }, [contactHistory]);

  // updates on guid -> email may change
  const upsert = useCallback((contact: TContact) => {
    setHistory((prev) => {
      const key =
        contact.ItemGUID ?? contact.Email1Address?.toLowerCase() ?? "";
      const idx = prev.findIndex(
        (p) => (p.ItemGUID ?? p.Email1Address?.toLowerCase() ?? "") === key
      );
      const item = {
        ...prev[idx],
        ...contact,
        LastFetchedAt: new Date().toISOString(),
      };
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = item;
        return copy;
      }
      return [item, ...prev];
    });
  }, []);

  return { contactHistory, upsert };
}
