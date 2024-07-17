import { useForm } from "react-hook-form";
import Api from "../Api";
import { useContext, useEffect, useState } from "react";
import { MapPinOff, MoveLeft } from "lucide-react";
import { AuthContext } from "../components/AuthContext";
import Loader from "../components/Loader";
import Load from "../components/Load";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AbsentReason() {
  const [actionErrors, setActionErrors] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState("");
  const navigate = useNavigate();
  const {
    userData,
    loading,
    token,
    getLocation,
    permissionDenied,
    location,
  } = useContext(AuthContext);

  const { register, handleSubmit } = useForm();

  useEffect(() => {
    getLocation();
  }, [getLocation]);

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
    if(!location){
      return toast.error("please open your location....!")
     }
    setButtonLoading(true);
    if(data.permissionType=="meeting"){
      data.permissionType="meeting"
      data.workMeeting=true
    }else if(data.permissionType=="willBeLate"){
      data.permissionType="willBeLate"
      data.willBeLate=true
    }
    else if(data.permissionType=="notCompleteDay"){
      data.permissionType="notCompleteDay"
      data.notCompleteDay=true
    }
    data = { ...data, location };
    await Api.post("user/markAbsence", data)
      .then(() => {
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

  const handleSelectChange = (event) => {
    setSelectedPermission(event.target.value);
  };

  return (
    <div className="w-screen h-screen relative overflow-hidden p-2 flex justify-center items-center">
      <div className="absolute top-16 left-4 z-50 p-2 bg-blue-700 rounded-full">
        <MoveLeft onClick={() => navigate(-1)} className="fill-white text-white cursor-pointer" />
      </div>
      <h1 className="absolute top-0 md:top-10 mx-auto max-w-96 max-h-14 md:max-w-[60] h-12 mb-40 p-2">
        <img src="/logo.png" alt="" />
      </h1>
      {permissionDenied ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <MapPinOff color="black" className="icon size-20" />
          <p dir="ltr" className="p-text opacity-70 text-xl text-center">
            You have denied access to your location. Show how you can enable it manually ...
          </p>
          <button className="py-1 px-4 font-cairo text-xl text-white rounded-xl bg-blue-600">
            <a
              href="https://support.google.com/chrome/answer/142065?hl=en"
              className="font-cairo text-xl"
              target="_blank"
              rel="noopener noreferrer"
            >
              See How
            </a>
          </button>
        </div>
      ) : (
        <div>
          <p className="p-text underline underline-offset-[8px] text-center">تفاصيل الاذن</p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <div className="h-6 text-center mt-10">
              <p className="max-w-96 font-cairo text-white opacity-70 text-sm font-normal">
                {actionErrors || actionSuccess}
              </p>
            </div>

            <select
              {...register("permissionType", { required: true })}
              value={selectedPermission}
              onChange={handleSelectChange}
              className="bg-[#D9D9D9] p-2 w-80 max-w-md mx-auto rounded-xl"
            >
              <option value="" disabled>اختر نوع الاذن</option>
              <option value="notCompleteDay"> انصراف</option>
              <option value="willBeLate">تأخير </option>
              <option value="meeting"> ميتنج عمل</option>
            </select>

            <textarea
              {...register("absentReason", { required: true })}
              required
              disabled={!selectedPermission}
              className="bg-[#D9D9D9] p-2 opacity-70 w-80 min-h-60 max-w-md mx-auto mt-4 rounded-xl resize-none"
            ></textarea>

            <div className="flex justify-end mt-4">
              <button
                disabled={buttonLoading}
                type="submit"
                className="cursor-pointer bg-[#D9D9D9] bg-opacity-70 rounded-lg w-20 font-cairo font-semibold focus-visible:outline-none focus:outline-none text-[#010C2A] text-2xl mt-2"
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
