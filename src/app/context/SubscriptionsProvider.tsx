"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type SavedSubscription = { service: string; plan: string };

type SubscriptionsContextType = {
  items: SavedSubscription[];
  /** Cantidad de personas entre las que se divide el total. */
  people: number;
  /** Se completa recién en el cliente: antes de eso la lista puede estar vacía aunque haya datos guardados. */
  ready: boolean;
  has: (service: string, plan: string) => boolean;
  /** Guarda el plan del servicio (uno por servicio); si ya estaba guardado, lo quita. */
  toggle: (service: string, plan: string) => void;
  remove: (service: string) => void;
  setPeople: (people: number) => void;
  /** Mezcla lo importado con la lista actual: un servicio importado reemplaza al que ya estaba. */
  importData: (data: { items: SavedSubscription[]; people: number }) => void;
};

const STORAGE_KEY = "my-subscriptions-v1";
const MAX_ITEMS = 60;
const MAX_PEOPLE = 20;

const SubscriptionsContext = createContext<SubscriptionsContextType | undefined>(undefined);

type Stored = { items: SavedSubscription[]; people: number };

function read(): Stored {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    const items = Array.isArray(saved?.items)
      ? saved.items
          .filter((i: unknown): i is SavedSubscription =>
            typeof (i as SavedSubscription)?.service === "string" && typeof (i as SavedSubscription)?.plan === "string")
          .slice(0, MAX_ITEMS)
      : [];
    const people = Number.isInteger(saved?.people) ? Math.min(Math.max(saved.people, 1), MAX_PEOPLE) : 1;
    return { items, people };
  } catch {
    // localStorage no disponible o JSON inválido
    return { items: [], people: 1 };
  }
}

export const SubscriptionsProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<Stored>({ items: [], people: 1 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(read());
    setReady(true);
    // Mantiene sincronizadas las pestañas abiertas
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) setState(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const commit = useCallback((update: (prev: Stored) => Stored) => {
    setState(prev => {
      const next = update(prev);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // sin persistencia
      }
      return next;
    });
  }, []);

  const has = useCallback(
    (service: string, plan: string) => state.items.some(i => i.service === service && i.plan === plan),
    [state.items],
  );

  const toggle = useCallback(
    (service: string, plan: string) =>
      commit(prev => {
        const same = prev.items.some(i => i.service === service && i.plan === plan);
        const rest = prev.items.filter(i => i.service !== service);
        return { ...prev, items: same ? rest : [...rest, { service, plan }].slice(0, MAX_ITEMS) };
      }),
    [commit],
  );

  const remove = useCallback(
    (service: string) => commit(prev => ({ ...prev, items: prev.items.filter(i => i.service !== service) })),
    [commit],
  );

  const setPeople = useCallback(
    (people: number) => commit(prev => ({ ...prev, people: Math.min(Math.max(Math.round(people) || 1, 1), MAX_PEOPLE) })),
    [commit],
  );

  const importData = useCallback(
    (data: { items: SavedSubscription[]; people: number }) =>
      commit(prev => {
        const imported = new Set(data.items.map(i => i.service));
        const kept = prev.items.filter(i => !imported.has(i.service));
        return { items: [...kept, ...data.items].slice(0, MAX_ITEMS), people: Math.min(Math.max(data.people, 1), MAX_PEOPLE) };
      }),
    [commit],
  );

  return (
    <SubscriptionsContext.Provider value={{ items: state.items, people: state.people, ready, has, toggle, remove, setPeople, importData }}>
      {children}
    </SubscriptionsContext.Provider>
  );
};

export const useSubscriptions = () => {
  const context = useContext(SubscriptionsContext);
  if (!context) {
    throw new Error("useSubscriptions debe usarse dentro de un SubscriptionsProvider");
  }
  return context;
};
