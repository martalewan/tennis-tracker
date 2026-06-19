import {
  useCallback,
  useSyncExternalStore,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  initialMatchSession,
  MATCH_SESSION_STORAGE_KEY,
  parseMatchSession,
  serializeMatchSession,
  type MatchSession,
} from "@/lib/matchStorage";
import type { MatchScore, PointRecord } from "@/lib/scoring";

type MatchSessionListener = () => void;

const listeners = new Set<MatchSessionListener>();

let cachedStoredValue: string | null | undefined;
let cachedSession = initialMatchSession;

function emitMatchSessionChange() {
  listeners.forEach((listener) => listener());
}

function readStoredMatchSession() {
  if (typeof window === "undefined") {
    return initialMatchSession;
  }

  const storedValue = window.localStorage.getItem(MATCH_SESSION_STORAGE_KEY);

  if (storedValue === cachedStoredValue) {
    return cachedSession;
  }

  cachedStoredValue = storedValue;
  cachedSession = parseMatchSession(storedValue);

  return cachedSession;
}

function saveMatchSession(session: MatchSession) {
  const nextStoredValue = serializeMatchSession(session);

  cachedStoredValue = nextStoredValue;
  cachedSession = session;
  window.localStorage.setItem(MATCH_SESSION_STORAGE_KEY, nextStoredValue);
  emitMatchSessionChange();
}

function subscribeToMatchSession(listener: MatchSessionListener) {
  listeners.add(listener);

  function handleStorageChange(event: StorageEvent) {
    if (event.key === MATCH_SESSION_STORAGE_KEY) {
      cachedStoredValue = undefined;
      listener();
    }
  }

  window.addEventListener("storage", handleStorageChange);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorageChange);
  };
}

function resolveNextValue<Value>(
  currentValue: Value,
  nextValue: SetStateAction<Value>,
) {
  if (typeof nextValue === "function") {
    return (nextValue as (value: Value) => Value)(currentValue);
  }

  return nextValue;
}

export default function useStoredMatchSession() {
  const session = useSyncExternalStore(
    subscribeToMatchSession,
    readStoredMatchSession,
    () => initialMatchSession,
  );

  const setMatchScore = useCallback<Dispatch<SetStateAction<MatchScore>>>(
    (nextMatchScore) => {
      const currentSession = readStoredMatchSession();

      saveMatchSession({
        ...currentSession,
        matchScore: resolveNextValue(
          currentSession.matchScore,
          nextMatchScore,
        ),
      });
    },
    [],
  );

  const setHistory = useCallback<Dispatch<SetStateAction<PointRecord[]>>>(
    (nextHistory) => {
      const currentSession = readStoredMatchSession();

      saveMatchSession({
        ...currentSession,
        history: resolveNextValue(currentSession.history, nextHistory),
      });
    },
    [],
  );

  const resetSession = useCallback(() => {
    cachedStoredValue = null;
    cachedSession = initialMatchSession;
    window.localStorage.removeItem(MATCH_SESSION_STORAGE_KEY);
    emitMatchSessionChange();
  }, []);

  return {
    history: session.history,
    matchScore: session.matchScore,
    resetSession,
    setHistory,
    setMatchScore,
  };
}
