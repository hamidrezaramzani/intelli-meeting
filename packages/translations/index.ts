import enCommon from "./locales/en/common.json";
import enHome from "./locales/en/home.json";
import enDashboard from "./locales/en/dashboard.json";
import enSetting from "./locales/en/setting.json";
import enEmployee from "./locales/en/employee.json";
import enMeeting from "./locales/en/meeting.json";
import enAudio from "./locales/en/audio.json";

import faCommon from "./locales/fa/common.json";
import faHome from "./locales/fa/home.json";
import faDashboard from "./locales/fa/dashboard.json";
import faSetting from "./locales/fa/setting.json";
import faEmployee from "./locales/fa/employee.json";
import faMeeting from "./locales/fa/meeting.json";
import faAudio from "./locales/fa/audio.json";

export const resources = {
  en: {
    common: enCommon,
    home: enHome,
    dashboard: enDashboard,
    setting: enSetting,
    employee: enEmployee,
    meeting: enMeeting,
    audio: enAudio,
  },
  fa: {
    common: faCommon,
    home: faHome,
    dashboard: faDashboard,
    setting: faSetting,
    employee: faEmployee,
    meeting: faMeeting,
    audio: faAudio,
  },
} as const;

export const namespaces = [
  "common",
  "home",
  "dashboard",
  "setting",
  "employee",
  "meeting",
] as const;
export type Namespace = (typeof namespaces)[number];
export type Locale = keyof typeof resources;
