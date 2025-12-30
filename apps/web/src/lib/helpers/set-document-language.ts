export const setDocumentLanguage = (language: string) => {
  if (typeof document === "undefined") return;

  document.documentElement.lang = language;
  document.documentElement.dir = language === "fa" ? "rtl" : "ltr";
};
