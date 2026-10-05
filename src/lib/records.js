import { useEffect, useState } from "react";
import { fetchFromAPI } from "../api";

export function useLiveList(endpoint, fallback = []) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let cancelled = false;
    fetchFromAPI(endpoint)
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setRows(data);
      })
      .catch(() => {
        if (!cancelled) setRows(fallback);
      });
    return () => {
      cancelled = true;
    };
  }, [endpoint]);

  return [rows, setRows];
}

export function rowsForAccount(rows, accountId, key) {
  if (!accountId) return rows;
  return rows.filter((row) => Number(row[key]) === Number(accountId));
}

export function currentMonthPrefix(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}
