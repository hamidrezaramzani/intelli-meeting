"use client";

import type { Locale, Namespace } from "@intelli-meeting/translations";
import type { i18n as I18nInstance, KeyPrefix } from "i18next";
import type { UseTranslationOptions } from "react-i18next";

import { namespaces, resources } from "@intelli-meeting/translations";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";

let initialized = false;

export function initI18n(locale: Locale = "en"): I18nInstance {
  if (!initialized) {
    i18n.use(initReactI18next).init({
      resources,
      lng: locale,
      fallbackLng: "en",
      ns: namespaces,
      defaultNS: "common",
      interpolation: {
        escapeValue: false,
      },
    });

    initialized = true;
  }

  return i18n;
}

export const i18next = i18n;
