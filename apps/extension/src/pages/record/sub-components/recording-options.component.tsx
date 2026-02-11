/* eslint-disable max-lines-per-function */
import {
  HiOutlineMicrophone,
  HiOutlineDesktopComputer,
  HiOutlineVolumeUp,
} from "react-icons/hi";
import { useRecordingOptions } from "../../../hooks/useRecordingOptions";

interface RecordingOptionsProps {
  onStartRecording: (options: {
    includeTabAudio: boolean;
    includeMicrophone: boolean;
    monitorTabAudio: boolean;
  }) => void;
  isRecording: boolean;
}

export const RecordingOptions: React.FC<RecordingOptionsProps> = ({
  onStartRecording,
  isRecording,
}) => {
  const { options, updateOptions, isLoading } = useRecordingOptions();

  const handleStart = () => {
    onStartRecording(options);
  };

  const getRecordingMode = () => {
    if (options.includeTabAudio && options.includeMicrophone) return "both";
    if (options.includeTabAudio) return "tab";
    if (options.includeMicrophone) return "microphone";
    return "none";
  };

  const getModeDescription = () => {
    switch (getRecordingMode()) {
      case "both":
        return "Record both tab audio and microphone";
      case "tab":
        return "Record tab audio only";
      case "microphone":
        return "Record microphone only";
      default:
        return "Select audio sources to record";
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Recording Options
        </h2>
        <p className="text-gray-600">{getModeDescription()}</p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Tab Audio Option */}
        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <HiOutlineDesktopComputer className="text-2xl text-blue-600" />
            <div>
              <label className="font-medium text-gray-800">Tab Audio</label>
              <p className="text-sm text-gray-600">
                Record audio from current tab
              </p>
            </div>
          </div>
          <input
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            disabled={isRecording}
            type="checkbox"
            checked={options.includeTabAudio}
            onChange={(e) =>
              updateOptions({ includeTabAudio: e.target.checked })
            }
          />
        </div>

        {/* Microphone Option */}
        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <HiOutlineMicrophone className="text-2xl text-green-600" />
            <div>
              <label className="font-medium text-gray-800">Microphone</label>
              <p className="text-sm text-gray-600">
                Record your microphone input
              </p>
            </div>
          </div>
          <input
            className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
            disabled={isRecording}
            type="checkbox"
            checked={options.includeMicrophone}
            onChange={(e) =>
              updateOptions({ includeMicrophone: e.target.checked })
            }
          />
        </div>

        {/* Monitor Tab Audio Option */}
        {options.includeTabAudio && (
          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <HiOutlineVolumeUp className="text-2xl text-purple-600" />
              <div>
                <label className="font-medium text-gray-800">
                  Monitor Tab Audio
                </label>
                <p className="text-sm text-gray-600">
                  Play tab audio locally while recording
                </p>
              </div>
            </div>
            <input
              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              disabled={isRecording}
              type="checkbox"
              checked={options.monitorTabAudio}
              onChange={(e) =>
                updateOptions({ monitorTabAudio: e.target.checked })
              }
            />
          </div>
        )}
      </div>

      {/* Validation Message */}
      {getRecordingMode() === "none" && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            Please select at least one audio source to start recording.
          </p>
        </div>
      )}

      {/* Start Button */}
      <button
        onClick={handleStart}
        disabled={isRecording || getRecordingMode() === "none"}
        className="w-full py-3 px-6 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
      >
        <HiOutlineMicrophone className="text-xl" />
        {isRecording ? "Recording..." : "Start Recording"}
      </button>

      {/* Recording Mode Indicator */}
      {getRecordingMode() !== "none" && (
        <div className="text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            Mode:{" "}
            {getRecordingMode().charAt(0).toUpperCase() +
              getRecordingMode().slice(1)}
          </span>
        </div>
      )}
    </div>
  );
};
