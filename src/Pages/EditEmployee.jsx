import {
  Eye,
  EyeOff,
  Lock,
  MapPin,
  Phone,
  UserRound,
  Image,
} from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import Api from "../Api";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { AuthContext } from "../components/AuthContext";
import Load from "../components/Load";

const EditEmployee = () => {
  const { id: employeeId } = useParams();
  const [employeeData, setEmployeeData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false); 
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const { userData, loading, token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    const fetchEmployeeData = async () => {
      try {
        const response = await Api.get(`user/get-user/${employeeId}`);
        setEmployeeData(response?.data?.data);
        setValue("username", response?.data?.data.username);
        setValue("phoneNumber", response?.data?.data.phoneNumber);
      } catch (error) {
        // console.error("Failed to fetch employee data:", error);
      }
    };

    fetchEmployeeData();
  }, [employeeId, setValue]);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

 
  if (loading) return <Loader />;
  if (!userData) return <Navigate to="/" replace />;
  if (userData.role !== 'admin') return <Navigate to="/profile" replace />;
  const onSubmit = async (data) => {
    try {
      setButtonLoading(true); 
      if (data.password === "") {
        delete data.password;
      }
      await Api.put(`user/update/${employeeId}`, data);
      setSuccessMessage("تم تحديث بيانات الموظف بنجاح.");
    } catch (err) {
      setErrorMessage(err.response.data.message);
    } finally {
      setButtonLoading(false); 
    }
  };

  const companyBranches = [
    { id: 1, name: "زايد" },
    { id: 2, name: "الاسكندرية" },
    { id: 3, name: "التجمع" },
    { id: 4, name: "الساحل" },
  ];

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
  // console.log();
  let branch= employeeData?.companyBranch
  return (
    <div className="w-screen h-screen relative overflow-hidden p-2 flex justify-center items-center">
       <div className="absolute top-16 left-4 z-50 p-2 bg-blue-700 rounded-full " ><MoveLeft onClick={() => navigate(-1)} className="fill-white text-white cursor-pointer" /></div>
      <h1 className="absolute top-0 md:top-10 mx-auto max-w-96 max-h-14 md:max-w-[60] h-12 mb-40 p-2">
        <img src="/logo.png" alt="" />
      </h1>
      <div>
        <p className="p-text underline underline-offset-[8px] text-center mb-3">
          تعديل موظف
        </p>
        {/* <div className=" mt-4 flex justify-center items-center">
          {imagePreviewUrl ? (
            <img
              src={imagePreviewUrl}
              alt="Image preview"
              className="size-24  object-cover rounded-full"
            />
          ) : (
            <img
              className=" size-24 object-cover"
              src="/public/profile.png"
              alt="profile-image"
            />
          )}
        </div> */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-md mx-auto mt-10  space-y-4"
        >
          <div dir="ltr" className="h-auto transition-all duration-300 text-center mb-2 text-white opacity-70">
            <p>{errorMessage ||successMessage}</p>
          </div>
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
              {...register("password")}
              placeholder="كلمة السر (اتركها فارغة إذا لم ترغب في التغيير)"
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
          <div className="mt-6 flex justify-between items-center gap-2">
            <div className="input-wrapper w-1/2">
              <MapPin className="icon" />
              <select
                {...register("companyBranch", { required: true })}
                placeholder="الفرع"
                className="p-0 m-0 bg-transparent h-[1.7rem] focus:outline-none"
                defaultValue={branch}
              >
                <option value="" disabled>
                  الفرع
                </option>
                {companyBranches.map((branch) => (
                  <option key={branch.id} value={branch.name}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-wrapper w-1/2">
              <Phone className="icon rotate-[260deg]" />
              <input
                placeholder="رقم الهاتف"
                {...register("phoneNumber", { required: true })}
                className="input-field"
              />
            </div>
          </div>

          <button type="submit" className="form-btn" disabled={buttonLoading}>
            {buttonLoading ? <Load/> : "تحديث البيانات"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
