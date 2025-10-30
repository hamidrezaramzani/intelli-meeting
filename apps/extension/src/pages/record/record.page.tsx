import { MainLayout } from "@intelli-meeting/shared-ui";
import { FaCircle } from "react-icons/fa";
import { HiOutlineMicrophone } from "react-icons/hi";
import { useNavigate } from "react-router";

export const RecordPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center items-center w-96 px-4">
      <MainLayout navigate={(path) => navigate(path)}>
        <div className="w-full flex flex-col justify-center items-center">
          <div className="w-2/3 flex justify-center items-center bg-brand-600  rounded-full h-64">
            <button
              className="w-2/3 h-64 flex items-center justify-center "
              type="button"
            >
              <HiOutlineMicrophone className="text-9xl text-neutral-50" />
            </button>
          </div>

          <div className="w-full flex justify-center items-center mt-6">
            <h3 className="text-4xl text-brand-400 font-black">00:00:00</h3>
          </div>

          <div className="w-full flex justify-center items-center">
            <h3 className="text-xl my-3 text-slate-700 font-regular">
              Start recording
            </h3>
          </div>
          <div className="w-2/3 flex gap-3 justify-center">
            <div className="flex justify-center w-32 items-center">
              <button className="cursor-pointer" type="button">
                <FaCircle className="text-6xl text-slate-700" />
              </button>
            </div>
          </div>
        </div>
      </MainLayout>
    </div>
  );
};
