import { Header } from "@intelli-meeting/shared-ui";
import { CiHeadphones } from "react-icons/ci";
import { FaPlay } from "react-icons/fa";
import { IoStopOutline } from "react-icons/io5";
import { MdSaveAlt } from "react-icons/md";

export const RecordPage = () => (
  <div className="w-96">
    <Header />
    <div
      className="flex flex-col justify-center items-center"
      style={{ height: "500px" }}
    >
      <div className="w-2/3 flex justify-center items-center border-black rounded-full h-64 border">
        <button className="w-2/3 h-64 flex items-center justify-center cursor-pointer">
          <CiHeadphones className="text-9xl text-gray-800" />
        </button>
      </div>

      <div className="w-full flex justify-center items-center mt-6">
        <h3 className="text-4xl font-black">00:00:00</h3>
      </div>

      <div className="my-12 w-2/3 flex gap-3 justify-center">
        <div className="flex justify-center w-24 items-center">
          <button>
            <IoStopOutline className="text-4xl color-primary-500" />
          </button>
        </div>
        <div className="flex justify-center w-32 items-center">
          <button>
            <FaPlay className="text-6xl color-primary-500" />
          </button>
        </div>
        <div className="flex justify-center w-24 items-center">
          <button>
            <MdSaveAlt className="text-4xl" />
          </button>
        </div>
      </div>
    </div>
  </div>
);
