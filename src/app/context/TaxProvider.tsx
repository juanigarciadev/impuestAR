"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { DEFAULT_TAX_SETTINGS, PROVINCES, TaxSettings } from "@/lib/taxes";

type TaxContextType = {
  settings: TaxSettings;
  update: (partial: Partial<TaxSettings>) => void;
};

// v2: cambiaron los valores por defecto (percepción incluida), se descartan las preferencias anteriores
const STORAGE_KEY = "tax-settings-v2";
const TaxContext = createContext<TaxContextType | undefined>(undefined);

export const TaxProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<TaxSettings>(DEFAULT_TAX_SETTINGS);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
      if (saved && typeof saved === "object") {
        setSettings({
          iva: typeof saved.iva === "boolean" ? saved.iva : DEFAULT_TAX_SETTINGS.iva,
          iibb: typeof saved.iibb === "boolean" ? saved.iibb : DEFAULT_TAX_SETTINGS.iibb,
          percepcion: typeof saved.percepcion === "boolean" ? saved.percepcion : DEFAULT_TAX_SETTINGS.percepcion,
          province: PROVINCES.some(p => p.id === saved.province) ? saved.province : "",
        });
      }
    } catch {
      // localStorage no disponible o JSON inválido: se usan los valores por defecto
    }
  }, []);

  const update = useCallback((partial: Partial<TaxSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...partial };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // sin persistencia
      }
      return next;
    });
  }, []);

  return (
    <TaxContext.Provider value={{ settings, update }}>
      {children}
    </TaxContext.Provider>
  );
};

export const useTaxSettings = () => {
  const context = useContext(TaxContext);
  if (!context) {
    throw new Error("useTaxSettings debe usarse dentro de un TaxProvider");
  }
  return context;
};
