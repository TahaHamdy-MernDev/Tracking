import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../components/AuthContext";
import Loader from "../components/Loader";
import Api from "../Api";
import { MapPinOff } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import Load from "../components/Load";
import { toast } from "react-toastify";
import { getLocation } from "current-location-geo";
export default function Profile() {
  const [actionErrors, setActionErrors] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [loadingCheckIn, setLoadingCheckIn] = useState(false);
  const [loadingCheckOut, setLoadingCheckOut] = useState(false);
  const [location, setLocation] = useState(null);
  const {
    userData,
    loading,
    setUserData,
    // getLocation,
    // location,
    permissionDenied,
    // error,
    token,
  } = useContext(AuthContext);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!location) {
  //     getLocation();
  //   }
  // }, [location, getLocation]);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
  }, [token, navigate]);
  useEffect(() => {
    getLocation(function (err, position) {
      if (err) {
        console.error("Error:", err);
      } else {
        setLocation({
          latitude: position.latitude,
          longitude: position.longitude,
        });
      }
    });
  }, []);
  const checkIn = async () => {
    if (!location) {
      return toast.error("please open your location....!");
    }
    setLoadingCheckIn(true);
    await Api.post("user/check-in", { location })
      .then(({ data }) => {
        setUserData(data.data);
        toast.success("تم تسجيل الحضور بنجاح.");
      })
      .catch((error) => {
        if ((error.response.data.status = 400)) {
          toast.info(error.response.data.message);
        } else {
          toast.error("حدث خطأ أثناء تسجيل الحضور.");
        }
      })
      .finally(() => {
        setLoadingCheckIn(false);
      });
  };
  if (loading) return <Loader />;
  if (!userData) return <Navigate to="/" replace />;
  const checkOut = async () => {
    if (!location) {
      return toast.error("please open your location....!");
    }
    setLoadingCheckOut(true);
    await Api.post("user/check-out", { location })
      .then(({ data }) => {
        setUserData(data.data);
        toast.success("تم تسجيل الانصراف بنجاح.");
      })
      .catch((error) => {
        if ((error.response.data.status = 400)) {
          toast.info(error.response.data.message);
        } else {
          toast.error("حدث خطأ أثناء تسجيل الانصراف.");
        }
      })
      .finally(() => {
        setLoadingCheckOut(false);
      });
  };

  if (actionErrors !== null) {
    setTimeout(() => {
      setActionErrors(null);
    }, 5000);
  }

  if (actionSuccess !== null) {
    setTimeout(() => {
      setActionSuccess(null);
    }, 5000);
  }

  const navigateToAddAbsentReason = () => {
    navigate("/absent-reason");
  };

  const { username: userName, attendance } = userData;
  const absenceCount = attendance.filter((entry) => entry.isAbsent).length;
  const permissionCount = attendance.filter(
    (entry) => entry.absentReason
  ).length;
  const attendanceCount = attendance.filter(
    (entry) => !entry.isAbsent && entry.checkIn
  ).length;
  return (
    <div className="w-screen h-screen relative overflow-hidden p-2 flex justify-center items-center">
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
          <button className="py-1 px-4 font-cairo text-xl text-white rounded-xl  bg-blue-600">
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
        <div className="min-w-80  flex justify-end items-center">
          <div className="w-full flex justify-center items-center flex-col gap-16">
            <div className="flex gap-2 flex-row items-center justify-center">
              <p className="text-white font-cairo text-2xl font-normal">
                {userName}
              </p>
              <img className="size-12" src="/profile.png" alt="profile" />
            </div>

            <div className="flex justify-between items-center w-full">
              <span className="flex flex-col justify-center items-center gap-2">
                <p className="font-cairo cu text-white text-3xl font-normal">
                  حضور
                </p>
                <p className="font-cairo cu text-white text-3xl font-normal">
                  {attendanceCount}
                </p>
              </span>
              <span className="flex flex-col justify-center items-center gap-2">
                <p className="font-cairo cu text-white text-3xl font-normal">
                  إذن
                </p>
                <p className="font-cairo cu text-white text-3xl font-normal">
                  {permissionCount}
                </p>
              </span>
              <span className="flex flex-col justify-center items-center gap-2">
                <p className="font-cairo cu text-white text-3xl font-normal">
                  غياب
                </p>
                <p className="font-cairo cu text-white text-3xl font-normal">
                  {absenceCount}
                </p>
              </span>
            </div>
            <div className="flex justify-between flex-col items-center gap-4">
              <button
                disabled={loadingCheckIn || loadingCheckOut}
                className={`rounded-lg font-cairo text-white h-12 w-40 bg-[#4AAF05] bg-opacity-[70%] inset-shadow text-2xl ${
                  loadingCheckIn ? "cursor-not-allowed" : ""
                }`}
                onClick={checkIn}
              >
                {loadingCheckIn ? <Load /> : "CHECK-IN"}
              </button>
              <button
                disabled={loadingCheckIn || loadingCheckOut}
                onClick={checkOut}
                className={`rounded-lg font-cairo text-white h-12 w-40 bg-[#D20000] bg-opacity-70 inset-shadow text-2xl ${
                  loadingCheckOut ? "cursor-not-allowed" : ""
                }`}
              >
                {loadingCheckOut ? <Load /> : "CHECK-OUT"}
              </button>
              <button
                onClick={navigateToAddAbsentReason}
                className="rounded-lg font-cairo text-white h-12 w-40 bg-[#FB8832] bg-opacity-70 inset-shadow text-2xl"
              >
                إذن عمل
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
