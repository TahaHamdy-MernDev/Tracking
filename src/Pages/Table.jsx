import { useState, useEffect, useContext } from "react";
import Api from "../Api";
import moment from "moment";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { UserRoundCog, UserRoundX, X } from "lucide-react";
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
  const { userData, loading, token, setToken } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [absenceReason, setAbsenceReason] = useState("");
  const [absenceTime, setAbsenceTime] = useState();

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
        const response = await Api.get("/user/available-dates");
        const fetchedDates = response.data.data.map((date) =>
          moment(date).format("YYYY-MM-DD")
        );
        const today = moment().format("YYYY-MM-DD");
        if (!fetchedDates.includes(today)) {
          fetchedDates.push(today);
        }

        setAvailableDates(fetchedDates);
      } catch (err) {
        console.error("Failed to fetch available dates:", err.response);
      }
    };

    const fetchData = async () => {
      try {
        const today = moment().startOf("day");
        const selected = moment(selectedDate).startOf("day");

        if (selected.isSame(today, "day")) {
          const response = await Api.get("/user/today-live-data");

          setEmployees(response.data.data);
        } else {
          const date = selected.format("YYYY-MM-DD");
          const response = await Api.get(`/user/reports?date=${date}`);
         
          setEmployees(response.data.data.dailyReports[0].reports);
        }
      } catch (err) {
        if (err.response.status===404) {
          setEmployees([])
        }
        console.error("Failed to fetch employees:", err.response);
      }
    };

    fetchAvailableDates();
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
    ?.filter((employee) => {
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
      case "Absent with Reason":
        return { text: "غائب مع سبب", bgColor: "#FFDD57" };
      case "Absent without Reason":
        return { text: "غائب بدون سبب", bgColor: "#FF5756" };
      case "Day not completed":
        return { text: "اخذ اذن انصراف", bgColor: "#E2E8F0" };
      case "Holiday":
        return { text: "اجازه", bgColor: "#E2E8F0" };
      default:
        return { text: "لم يبدأ", bgColor: "#f4f4f4" };
    }
  };

  const addEmployee = () => {
    navigate("/add-employee");
  };

  const openModal = (reason, absentTime) => {
    setAbsenceReason(reason);
    setAbsenceTime(moment(absentTime).format("hh:mm A"));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setAbsenceReason("");
  };

  const commonClasses =
    "px-6 py-3 cursor-default text-center max-sm:text-sm text-lg font-medium text-[#333333] uppercase whitespace-nowrap";

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
  const logout = () => {
    setToken(null);
  };
  const convertMinutesToHoursAndMinutes = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="flex justify-center items-start min-h-screen relative p-2">
      <h1 className="absolute top-0 md:top-10 mx-auto max-w-96 max-h-14 md:max-w-[60] h-12 mb-40 p-2">
        <img src="/logo.png" alt="" />
      </h1>
      <div
        className="min-h-96 flex flex-col mt-40 bg-white max-w-full rounded-xl overflow-x-auto overflow-y-hidden"
        dir="ltr"
      >
        <div className="w-full min-h-96">
          <div className="inline-block align-middle">
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
                      <option value="Absent with Reason"> غائب مع سبب</option>
                      <option value="Absent without Reason">
                        {" "}
                        غائب بدون سبب
                      </option>
                      <option value="Day not completed">اخذ اذن انصراف</option>
                      <option value="Canceled">ملغي</option>
                    </select>
                  </div>
                </div>
                <div className="relative max-w-xs">
                  <label className="sr-only">Select Date</label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    includeDates={availableDates?.map((date) => new Date(date))}
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
                          className="text-gray-700 block px-4 py-2 text-sm cursor-pointer"
                          role="menuitem"
                          tabIndex="-1"
                          id="menu-item-2"
                        >
                          Add Employee
                        </span>

                        <span
                          className="text-gray-700 block w-full text-left px-4 py-2 text-sm cursor-pointer"
                          role="menuitem"
                          tabIndex="-1"
                          id="menu-item-3"
                          onClick={logout}
                        >
                          Sign out
                        </span>
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
                    {filteredAndSortedEmployees?.length > 0 ? (
                      filteredAndSortedEmployees.map((employee, index) => {
                        return (
                          <tr key={index}>
                            <td className="px-6 py-4 cursor-default whitespace-nowrap text-base font-medium text-gray-800">
                              {employee.uniqueNumber || "N/A"}
                            </td>
                            <td className="px-6 py-4 cursor-default whitespace-nowrap text-base font-medium text-gray-800">
                              {employee.username || "N/A"}
                            </td>
                            <td className="px-6 py-4 cursor-default text-center whitespace-nowrap text-base text-gray-800">
                              <span
                                className="flex items-center cursor-default justify-center px-2 py-1 w-28 rounded-full"
                                style={{
                                  backgroundColor: getStatusText(
                                    employee.status
                                  ).bgColor,
                                }}
                              >
                                {getStatusText(employee.status).text ||
                                  "Unknown"}
                              </span>
                            </td>
                            <td className="px-6 py-4 cursor-default text-center whitespace-nowrap text-base text-gray-800">
                              {employee.companyBranch || "N/A"}
                            </td>
                            <td className="px-6 py-4 cursor-default text-center whitespace-nowrap text-base text-gray-800">
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
                            <td className="px-6 py-4 cursor-default text-center whitespace-nowrap text-base text-gray-800">
                              {employee.checkOutTime
                                ? moment(employee.checkOutTime).format(
                                    "hh:mm A"
                                  )
                                : "N/A"}
                            </td>
                            <td className="px-6 py-4 cursor-default text-center whitespace-nowrap text-base text-gray-800">
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
                            <td className="px-6 py-4 cursor-default text-center whitespace-nowrap text-base text-gray-800">
                              {(employee.workHours &&
                                convertMinutesToHoursAndMinutes(
                                  employee.workHours
                                )) ||
                                "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                              {employee.absentReason ? (
                                <span
                                  onClick={() =>
                                    openModal(
                                      employee.absentReason,
                                      employee.absentTime
                                    )
                                  }
                                  className="cursor-pointer text-blue-600 underline"
                                >
                                  {employee.absentReason.length > 10
                                    ? `${employee.absentReason.substring(
                                        0,
                                        10
                                      )}...`
                                    : employee.absentReason}
                                </span>
                              ) : (
                                "N/A"
                              )}
                            </td>
                            <td className="px-6 py-4 text-center whitespace-nowrap text-base text-gray-800">
                              <Link to={`/edit-employee/${employee._id}`}>
                                <UserRoundCog />
                              </Link>
                            
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={headers.length}
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          {employees.length === 0 && "لا توجد بيانات لهذا التاريخ"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
              onClick={closeModal}
            ></div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className=" relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900"
                    id="modal-title"
                  ></h3>
                  <div className="mt-2 p-6 text-start">
                    <p className="text-sm text-gray-500">{absenceReason}</p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 absolute top-0">
                <X
                  className=" transition-all duration-300 hover:text-blue-700 cursor-pointer"
                  onClick={closeModal}
                />
              </div>
              <div className="mb-2 sm:mb-4 absolute bottom-0 left-5 ">
                {absenceTime}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
