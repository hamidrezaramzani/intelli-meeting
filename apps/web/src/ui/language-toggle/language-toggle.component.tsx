"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { LANGUAGE_STORAGE_KEY } from "@/lib/constants";
import { setDocumentLanguage } from "@/lib/helpers";

export const LanguageToggle = () => {
  const { i18n, t } = useTranslation();
  const activeLanguage = i18n.language?.split("-")[0] ?? "en";
  const languages = [
    { code: "fa", label: t("common:language.faShort") },
    { code: "en", label: t("common:language.enShort") },
  ];

  useEffect(() => {
    setDocumentLanguage(activeLanguage);
  }, [activeLanguage]);

  const handleChangeLanguage = async (language: string) => {
    if (language === activeLanguage) return;

    await i18n.changeLanguage(language);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
    setDocumentLanguage(language);
  };

  return (
    <div className="flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 p-1">
      {languages.map((language) => {
        const isActive = activeLanguage === language.code;
        return (
          <button
            aria-pressed={isActive}
            disabled={isActive}
            key={language.code}
            type="button"
            onClick={() => handleChangeLanguage(language.code)}
            className={`px-2 py-1 text-xs font-roboto  rounded-md border transition-colors ${
              isActive
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
            }`}
          >
            {language.label}
          </button>
        );
      })}
    </div>
  );
};
