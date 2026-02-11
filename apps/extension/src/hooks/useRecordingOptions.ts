import { useEffect, useState } from "react";

interface RecordingOptions {
  includeTabAudio: boolean;
  includeMicrophone: boolean;
  monitorTabAudio: boolean;
}

const DEFAULT_OPTIONS: RecordingOptions = {
  includeTabAudio: true,
  includeMicrophone: false,
  monitorTabAudio: true,
};

const STORAGE_KEY = "recordingOptions";

export const useRecordingOptions = () => {
  const [options, setOptions] = useState<RecordingOptions>(DEFAULT_OPTIONS);
  const [isLoading, setIsLoading] = useState(true);

  // Load options from Chrome storage on mount
  useEffect(() => {
    const loadOptions = async () => {
      try {
        if (typeof chrome !== "undefined" && chrome.storage) {
          const result = await chrome.storage.sync.get(STORAGE_KEY);
          if (result[STORAGE_KEY]) {
            setOptions(result[STORAGE_KEY]);
          }
        }
      } catch (error) {
        console.warn("Failed to load recording options from storage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOptions();
  }, []);

  // Save options to Chrome storage whenever they change
  const updateOptions = async (newOptions: Partial<RecordingOptions>) => {
    const updatedOptions = { ...options, ...newOptions };
    setOptions(updatedOptions);

    try {
      if (typeof chrome !== "undefined" && chrome.storage) {
        await chrome.storage.sync.set({
          [STORAGE_KEY]: updatedOptions,
        });
      }
    } catch (error) {
      console.warn("Failed to save recording options to storage:", error);
    }
  };

  const resetOptions = async () => {
    setOptions(DEFAULT_OPTIONS);
    
    try {
      if (typeof chrome !== "undefined" && chrome.storage) {
        await chrome.storage.sync.set({
          [STORAGE_KEY]: DEFAULT_OPTIONS,
        });
      }
    } catch (error) {
      console.warn("Failed to reset recording options in storage:", error);
    }
  };

  return {
    options,
    updateOptions,
    resetOptions,
    isLoading,
  };
};
