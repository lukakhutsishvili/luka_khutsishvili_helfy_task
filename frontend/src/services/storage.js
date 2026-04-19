import { useEffect, useState } from 'react';

const PREFIX = 'taskmgr:';

function read(key, fallback) {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* ignore quota / disabled storage */
  }
}

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => read(key, initialValue));

  useEffect(() => {
    write(key, value);
  }, [key, value]);

  return [value, setValue];
}

export const storage = { read, write };
