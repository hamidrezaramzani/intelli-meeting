import enCommon from "./locales/en/common.json";
import enHome from "./locales/en/home.json";
import enDashboard from "./locales/en/dashboard.json";
import enSetting from "./locales/en/setting.json";
import enEmployee from "./locales/en/employee.json";
import enMeeting from "./locales/en/meeting.json";

import faCommon from "./locales/fa/common.json";
import faHome from "./locales/fa/home.json";
import faDashboard from "./locales/fa/dashboard.json";
import faSetting from "./locales/fa/setting.json";
import faEmployee from "./locales/fa/employee.json";
import faMeeting from "./locales/fa/meeting.json";

export const resources = {
  en: {
    common: enCommon,
    home: enHome,
    dashboard: enDashboard,
    setting: enSetting,
    employee: enEmployee,
    meeting: enMeeting,
  },
  fa: {
    common: faCommon,
    home: faHome,
    dashboard: faDashboard,
    setting: faSetting,
    employee: faEmployee,
    meeting: faMeeting,
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
