import { Eye, EyeOff, Lock, Phone } from "lucide-react";
import { act, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../components/AuthContext";
import Api from "../Api";
import { Navigate, useNavigate } from "react-router-dom";
import Load from "../components/Load";
export default function Login() {
  const [buttonStatus,setButtonStatus]=useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const { setToken, token, setUserData ,userData} = useContext(AuthContext);

  if (token) {
    const userRole = userData?.role
    if (userRole === "admin") {
      return <Navigate to="/dashboard" replace />;
    } else if (userRole === "employee") {
      return <Navigate to="/profile" replace />;
    }
  }

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (formData) => {
    try {
      setButtonStatus(true)
      const response = await Api.post("/auth/login", formData);
      setButtonStatus(false)
      let { data } = response.data;

      setToken(data.token);
      setUserData(data.user);
      localStorage.setItem("token", data.token);

      const userRole = data.user.role;
      if (userRole === "admin") {
        navigate("/dashboard");
      } else if (userRole === "employee") {
        navigate("/profile");
      }
    } catch (error) {
      setButtonStatus(false)
      setToken(null);
      localStorage.removeItem("token")
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  if (errorMessage !== null) {
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  }

  return (
    <div className="flex justify-center items-center w-screen h-screen ">
      <div className=" flex justify-center items-center flex-col h-[640px] md:w-[800px]">
        <h1 className=" absolute top-0 md:top-10 mx-auto max-w-96 max-h-14 md:max-w-[60] h-12 mb-40 p-2">
          <img src="/logo.png" alt="" />
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="sm:mx-auto sm:w-full sm:max-w-sm  rounded-md max-w-md md:w-lg  h-auto mx-auto mt-10 p-4"
        >
          <div className="flex items-center justify-between gap-2 py-4 px-2 mb-12">
            <span
              className={`p-text underline underline-offset-[8px] cursor-default`}

            >
              تسجيل الدخول موظف
            </span>
            <span
              className={`p-text underline underline-offset-[8px] cursor-default`}
            >
              تسجيل الدخول Admin{" "}
            </span>
          </div>
          {errorMessage && (
            <div dir="ltr" className=" text-center mb-2 text-white opacity-70">
              {errorMessage}
            </div>
          )}
          <div className="relative flex-col">
            <div className="input-wrapper">
              <Phone className="icon rotate-[260deg] " />
            <input
              dir="rtl"
              type="tel"
              {...register("phoneNumber", { required: true })}
              placeholder="رقم الهاتف"
              required
              className="input-field"
            />
            </div>
          </div>
         
          <div className="input-wrapper">
            <Lock className="icon" />
            <input
              type={showPassword ? "text" : "password"}
              required
              min="8"
              {...register("password", { required: true })}
              placeholder="كلمة السر"
              className="input-field"
            />
            {showPassword ? (
              <Eye className="icon" />
            ) : (
              <EyeOff className="icon" />
            )}
          </div>

          <div class="flex items-center gap-2 mb-4">
            <input
              onClick={togglePassword}
              type="checkbox"
              class="h-4 w-4 rounded-sm  text-indigo-600 focus:ring-indigo-500"
            />
            <label
              for="filter-mobile-color-1"
              class="ml-3 min-w-0 flex-1 p-text"
            >
              اظهار كلمة السر
            </label>
          </div>
          <div className=" flex items-center justify-center w-full">
          <button disabled={buttonStatus} type="submit" className="form-btn">
              {buttonStatus ? <Load progressClass="" loadClass=" " /> : "تسجيل الدخول"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
