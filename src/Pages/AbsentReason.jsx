import { useForm } from "react-hook-form";
import Api from "../Api";
import { useContext, useEffect, useState } from "react";
import { MapPinOff, MoveLeft } from "lucide-react";
import { AuthContext } from "../components/AuthContext";
import Loader from "../components/Loader";
import Load from "../components/Load";
import { useNavigate } from "react-router-dom";
export default function AbsentReason() {
  const [actionErrors, setActionErrors] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const navigate=useNavigate()
  const {
    userData,
    loading,
    setUserData,
    token,
    getLocation,
    permissionDenied,
    location,
  } = useContext(AuthContext);

  const { register, handleSubmit } = useForm();
  useEffect(() => {
    getLocation();
  });
  if (loading) {
    return <Loader />;
  }
  if (!token) {
    return <Navigate to="/" replace />;
  }
  if (!userData) {
    return <div>User data not available</div>;
  }
  const onSubmit = async (data) => {
    setButtonLoading(true);
    data = { ...data, location };
    await Api.post("user/markAbsence", data)
      .then(({ data }) => {
        setActionSuccess("successfully");
      })
      .catch((err) => {
        setActionErrors(err.response.data.message);
      });
    setButtonLoading(false);
  };
  if (actionErrors) {
    setTimeout(() => {
      setActionErrors(null);
    }, 5000);
  }
  return (
    <div className=" w-screen h-screen  relative overflow-hidden p-2 flex justify-center items-center">
      <div className="absolute top-16 left-4 z-50 p-2 bg-blue-700 rounded-full " ><MoveLeft onClick={() => navigate(-1)} className="fill-white text-white cursor-pointer" /></div>
      <h1 className="absolute top-0 md:top-10 mx-auto max-w-96 max-h-14 md:max-w-[60] h-12 mb-40 p-2">
        <img src="/logo.png" alt="" />
      </h1>
      {permissionDenied ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <MapPinOff color="black" className="icon  size-20 " />
          <p dir="ltr" className="p-text opacity-70 text-xl text-center">
            You have denied access to your location ,Show How u can enable it
            manually ...
          </p>
          <button
            onClick={handleEnableLocation}
            className="py-1 px-4 font-cairo text-xl text-white rounded-xl  bg-blue-600"
          >
            <a
              href="https://support.google.com/chrome/answer/142065?hl=en"
              className="font-cairo text-xl"
              target="_blank"
            >
              See How
            </a>
          </button>
        </div>
      ) : (
        <div>
          <p className="p-text underline underline-offset-[8px] text-center">
            تفاصيل الاذن
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className=" flex flex-col">
            <div className=" h-6 text-center mt-10">
              <p className=" max-w-96 font-cairo text-white opacity-70 text-sm font-normal">
                {actionErrors || actionSuccess}
              </p>
            </div>
            <textarea
              {...register("absentReason", { required: true })}
              required
              className=" bg-[#D9D9D9] p-2 opacity-70 w-80 !min-h-60 max-w-md mx-auto  space-y-4 rounded-xl resize-none"
            ></textarea>

            <div className="flex justify-end mt-4">
              <button
                disable={buttonLoading}
                type="submit"
                className=" cursor-pointer bg-[#D9D9D9] bg-opacity-70 rounded-lg w-20 font-cairo font-semibold focus-visible:outline-none focus:outline-none  text-[#010C2A] text-2xl mt-2"
              >
                {buttonLoading ? <Load /> : "Send"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
