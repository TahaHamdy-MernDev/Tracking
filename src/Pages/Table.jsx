import React, { useState, useEffect, useContext } from "react";
   import Api from "../Api";
   import moment from "moment";
   import { Link, Navigate, useNavigate } from "react-router-dom";
   import { UserRoundCog } from "lucide-react";
   import { AuthContext } from "../components/AuthContext";
   import Loader from "../components/Loader";
   import DatePicker from "react-datepicker";
   import "react-datepicker/dist/react-datepicker.css";

   export const Table = () => {
     const [employees, setEmployees] = useState([]);
     const [searchTerm, setSearchTerm] = useState("");
     const [statusFilter, setStatusFilter] = useState("");
     const [selectedDate, setSelectedDate] = useState(new Date());
     const [availableDates, setAvailableDates] = useState([]);
     const { userData, loading, token } = useContext(AuthContext);
     const [isOpen, setIsOpen] = useState(false);

     const toggleDropdown = () => {
       setIsOpen(!isOpen);
     };
     const navigate = useNavigate();

     useEffect(() => {
       if (!token) {
         navigate("/");
         return;
       }
       const fetchAvailableDates = async () => {
        try {
          const response = await Api.get(`user/available-dates`);
          console.log(response.data.data);
          setAvailableDates(response.data.data.map(date => moment(date).format("YYYY-MM-DD")));
        } catch (err) {
          console.error("Failed to fetch available dates:", err.response);
        }
      };
       const fetchData = async () => {
         try {
          const date = moment(selectedDate).format("YYYY-MM-DD")
           const response = await Api.get(`user/reports?date=${date}`);
           console.log(response.data.data);
           setEmployees(response.data.data.dailyReports[0].reports);
         
         } catch (err) {
           console.error("Failed to fetch employees:", err.response);
         }
       };
       fetchAvailableDates()
       fetchData();
     }, [token, navigate, selectedDate]);

     if (loading) return <Loader />;
     if (!userData) return <Navigate to="/" replace />;
     if (userData.role !== "admin") return <Navigate to="/profile" replace />;

     const handleSearchChange = (event) => {
       setSearchTerm(event.target.value);
     };

     const handleStatusFilterChange = (event) => {
       setStatusFilter(event.target.value);
       setSearchTerm("");
     };

     const handleDateChange = (date) => {
       setSelectedDate(date);
     };

     const filteredAndSortedEmployees = employees
       .filter((employee) => {
         const matchesSearchTerm =
           employee.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
           employee.uniqueNumber.toLowerCase().includes(searchTerm.toLowerCase());
         const matchesStatus = statusFilter
           ? employee.status.toLowerCase() === statusFilter.toLowerCase()
           : true;
         return matchesSearchTerm && matchesStatus;
       })
       .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

     const getStatusText = (status) => {
       switch (status) {
         case "No Record":
           return { text: "لم يبدأ", bgColor: "#E2E8F0" };
         case "Pending":
           return { text: "قيد الانتظار", bgColor: "#FB8832" };
         case "Completed":
           return { text: "مكتمل", bgColor: "#4AAF05" };
         case "Canceled":
           return { text: "ملغي", bgColor: "#FF5756" };
         default:
           return { text: "لم يبدأ", bgColor: "#E2E8F0" };
       }
     };

     const addEmployee = () => {
       navigate("/add-employee");
     };

     const commonClasses =
       "px-6 py-3 text-center max-sm:text-sm text-lg font-medium text-[#333333] uppercase whitespace-nowrap";

     const headers = [
       "#",
       "اسم الموظف",
       "الحالة",
       "الفرع",
       "وقت الحضور",
       "الموقع",
       "وقت الانصراف",
       "الموقع",
       "عدد ساعات العمل",
       "تفاصيل الاذن",
       "",
     ];
    // 
     return (
       <div className="flex justify-center items-start w-screen min-h-screen relative p-2">
         <h1 className="absolute top-0 md:top-10 mx-auto max-w-96 max-h-14 md:max-w-[60] h-12 mb-40 p-2">
           <img src="/logo.png" alt="" />
         </h1>
         <div
           className="flex flex-col mt-40 bg-white max-w-full rounded-xl  max-md:overflow-x-auto max-md:overflow-y-hidden"
           dir="ltr"
         >
           <div className="-m-1.5 w-full">
             <div className="p-1.5 inline-block align-middle">
               <div className="border rounded-lg divide-y divide-gray-200">
                 <div className="py-3 px-4 flex justify-between">
                   <div className="relative max-w-xs">
                     <label className="sr-only">بحث</label>
                     <input
                       dir="rtl"
                       type="text"
                       name="hs-table-with-pagination-search"
                       id="hs-table-with-pagination-search"
                       className="py-2 px-3 ps-9 block w-full bg-[#E2E8F0] border-gray-200 shadow-sm rounded-lg text-sm focus:outline-none disabled:opacity-50 disabled:pointer-events-none"
                       placeholder="ابحث عن موظف"
                       value={searchTerm}
                       onChange={handleSearchChange}
                     />
                     <div className="absolute inset-y-1/2 start-0 flex items-center pointer-events-none ps-3">
                       <svg
                         dir="ltr"
                         className="size-4 text-gray-400"
                         xmlns="http://www.w3.org/2000/svg"
                         width="24"
                         height="24"
                         viewBox="0 0 24 24"
                         fill="none"
                         stroke="currentColor"
                         strokeWidth="2"
                         strokeLinecap="round"
                         strokeLinejoin="round"
                       >
                         <circle cx="11" cy="11" r="8"></circle>
                         <path d="m21 21-4.3-4.3"></path>
                       </svg>
                     </div>
                     <div className="absolute top-0 left-60">
                       <select
                         value={statusFilter}
                         onChange={handleStatusFilterChange}
                         className="border-gray-300 border rounded-lg py-1 px-2 text-center block"
                       >
                         <option value="">All Statuses</option>
                         <option value="No Record">لم يبدأ</option>
                         <option value="Pending">قيد الانتظار</option>
                         <option value="Completed">مكتمل</option>
                         <option value="Canceled">ملغي</option>
                       </select>
                     </div>
                   </div>
                   <div className="relative max-w-xs">
                     <label className="sr-only">Select Date</label>
                     <DatePicker
                       selected={selectedDate}
                       onChange={handleDateChange}
                       includeDates={availableDates}
                       dateFormat="yyyy-MM-dd"
                       className="py-2 px-3 block w-full bg-[#E2E8F0] border-gray-200 shadow-sm rounded-lg text-sm focus:outline-none disabled:opacity-50 disabled:pointer-events-none"
                     />
                   </div>
                   <div className="relative inline-block text-left">
                     <div>
                       <button
                         type="button"
                         className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:ring-indigo-500"
                         id="menu-button"
                         aria-expanded="true"
                         aria-haspopup="true"
                         onClick={toggleDropdown}
                       >
                         Options
                         <svg
                           className="-mr-1 ml-2 h-5 w-5"
                           xmlns="http://www.w3.org/2000/svg"
                           viewBox="0 0 20 20"
                           fill="currentColor"
                           aria-hidden="true"
                         >
                           <path
                             fillRule="evenodd"
                             d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                             clipRule="evenodd"
                           />
                         </svg>
                       </button>
                     </div>
                     {isOpen && (
                       <div
                         className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                         role="menu"
                         aria-orientation="vertical"
                         aria-labelledby="menu-button"
                         tabIndex="-1"
                       >
                         <div className="py-1" role="none">
                           <Link
                             to="/monthly-report"
                             className="text-gray-700 block px-4 py-2 text-sm"
                             role="menuitem"
                             tabIndex="-1"
                             id="menu-item-0"
                           >
                               Monthly Report
                           </Link>
                    
                           <span
                             onClick={addEmployee}
                             className="text-gray-700 block px-4 py-2 text-sm"
                             role="menuitem"
                             tabIndex="-1"
                             id="menu-item-2"
                           >
                             Add Employee
                           </span>
                           <form method="POST" action="#" role="none">
                             <button
                               type="submit"
                               className="text-gray-700 block w-full text-left px-4 py-2 text-sm"
                               role="menuitem"
                               tabIndex="-1"
                               id="menu-item-3"
                             >
                               Sign out
                             </button>
                           </form>
                         </div>
                       </div>
                     )}
                   </div>
                 </div>
                 <div className="overflow-x-auto overflow-y-hidden">
                   <table className="min-w-fit divide-y divide-gray-200">
                     <thead className="bg-[#e7e2e2]">
                       <tr>
                         {headers.map((title, index) => (
                           <th
                             key={index}
                             scope="col"
                             className={`${commonClasses} ${
                               index === 4 ||
                               index === 6 ||
                               index === 8 ||
                               index === 9
                                 ? "text-start"
                                 : ""
                             }`}
                           >
                             {title}
                           </th>
                         ))}
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-200">
                       {filteredAndSortedEmployees.map((employee, index) => (
                         <tr key={index}>
                           <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-800">
                             {employee.uniqueNumber || "N/A"}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-800">
                             {employee.username || "N/A"}
                           </td>
                           <td className="px-6 py-4 text-center whitespace-nowrap text-base text-gray-800">
                             <span
                               className="flex items-center justify-center px-2 py-1 w-24 rounded-full"
                               style={{
                                 backgroundColor: getStatusText(employee.status)
                                   .bgColor,
                               }}
                             >
                               {getStatusText(employee.status).text || "Unknown"}
                             </span>
                           </td>
                           <td className="px-6 py-4 text-center whitespace-nowrap text-base text-gray-800">
                             {employee.companyBranch || "N/A"}
                           </td>
                           <td className="px-6 py-4 text-center whitespace-nowrap text-base text-gray-800">
                             {employee.checkInTime
                               ? moment(employee.checkInTime).format("hh:mm A")
                               : "N/A"}
                           </td>
                           <td className="px-6 py-4 text-center whitespace-nowrap text-base text-gray-800">
                             {employee.checkInLocation &&
                             employee.checkInLocation.latitude &&
                             employee.checkInLocation.longitude ? (
                               <Link
                                 className="underline"
                                 to={`/location?latitude=${employee.checkInLocation.latitude}&longitude=${employee.checkInLocation.longitude}`}
                               >
                                 View
                               </Link>
                             ) : (
                               "N/A"
                             )}
                           </td>
                           <td className="px-6 py-4 text-center whitespace-nowrap text-base text-gray-800">
                             {employee.checkOutTime
                               ? moment(employee.checkOutTime).format("hh:mm A")
                               : "N/A"}
                           </td>
                           <td className="px-6 py-4 text-center whitespace-nowrap text-base text-gray-800">
                             {employee.checkOutLocation &&
                             employee.checkOutLocation.latitude &&
                             employee.checkOutLocation.longitude ? (
                               <Link
                                 className="underline"
                                 to={`/location?latitude=${employee.checkOutLocation.latitude}&longitude=${employee.checkOutLocation.longitude}`}
                               >
                                 View
                               </Link>
                             ) : (
                               "N/A"
                             )}
                           </td>
                           <td className="px-6 py-4 text-center whitespace-nowrap text-base text-gray-800">
                             {employee.workHours || "N/A"}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                             {employee.absentReason
                               ? employee.absentReason.length > 20
                                 ? `${employee.absentReason.substring(0, 10)}...`
                                 : employee.absentReason
                               : "N/A"}
                           </td>
                           <td className="px-6 py-4 text-center whitespace-nowrap text-base text-gray-800">
                             <Link to={`/edit-employee/${employee._id}`}>
                               <UserRoundCog />
                             </Link>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </div>
     );
   };