import { Eye, EyeOff, Lock, MapPin, MoveLeft, Phone, UserRound } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Api from "../Api";
import { useNavigate } from "react-router-dom";
import Load from "../components/Load";

const AddEmployee = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  const onSubmit = async (data) => {
    setLoading(true); 
    try {
      await Api.post("auth/register", data)
        .then((res) => {
          setSuccessMessage(res.data.message);
          reset();
        })
        .catch((err) => {
          setErrorMessage(err.response.data.message);
        });
    } catch (error) {
      setErrorMessage("An error occurred while submitting the form.");
    } finally {
      setLoading(false); 
    }
  };
  const companyBranches = [
    {
      id: 1,
      name: "زايد",
    },
    {
      id: 2,
      name: "الاسكندرية",
    },
    {
      id: 3,
      name: "التجمع",
    },
    {
      id: 4,
      name: "الساحل",
    },
  ];
  const validatePassword = (value) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(value);
  };
  if (errorMessage) {
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  }
  if (successMessage) {
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  }
  const navigate = useNavigate()
  return (
    <div className=" w-screen h-screen  relative overflow-hidden p-2 flex justify-center items-center">
       <div className="absolute top-16 left-4 z-50 p-2 bg-blue-700 rounded-full " ><MoveLeft onClick={() => navigate(-1)} className="fill-white text-white cursor-pointer" /></div>
      <h1 className="absolute top-0 md:top-10 mx-auto max-w-96 max-h-14 md:max-w-[60] h-12 mb-40 p-2">
        <img src="/logo.png" alt="" />
      </h1>
      <div>
        <p className="p-text underline underline-offset-[8px] text-center">
          اضافة موظف{" "}
        </p>
  <div dir="ltr" className="h-6 text-center mb-2 text-white opacity-70">
            <p>{errorMessage} </p>
            <p>{successMessage} </p>
            {errors.password && (
              <span>{errors.password.message}</span>
            )}
          </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-md mx-auto mt-10 space-y-4"
        >
        
          <div className="input-wrapper">
            <UserRound className="icon" />
            <input
              {...register("username", { required: true })}
              placeholder="اسم المستخدم"
              className="input-field"
            />
          </div>
          <div className="input-wrapper">
            <Lock className="icon" />
            <input
              type={showPassword ? "text" : "password"}
              required
              min="8"
              max="32"
              {...register("password", {
                required: "Password is required",
                validate: (value) =>
                  validatePassword(value) || "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character",
              })}
              placeholder="كلمة السر"
              className="input-field"
            />
            <span className="cursor-pointer" onClick={togglePassword}>
              {showPassword ? (
                <Eye className="icon" />
              ) : (
                <EyeOff className="icon" />
              )}
            </span>
           
            </div>
          <div className=" mt-6 flex justify-between items-center gap-2">
            <div className="input-wrapper w-1/2">
              <MapPin className="icon" />
              <select
                {...register("companyBranch", { required: true })}
                placeholder="الفرع"
                className="p-0 m-0 bg-transparent h-[1.7rem] focus:outline-none"
                defaultValue=""
              >
                <option value="" disabled>
                  الفرع
                </option>
                {companyBranches.map((branch) => (
                  <option className="p-2" key={branch.id} value={branch.name}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-wrapper w-1/2">
              <Phone className="icon rotate-[260deg] " />
              <input
                placeholder="رقم الهاتف"
                {...register("phoneNumber", { required: true })}
                className="input-field"
              />
            </div>
          </div>

          <button type="submit" className="form-btn" disabled={loading}>
            {loading ? <Load/> : "انشاء حساب"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default AddEmployee;
