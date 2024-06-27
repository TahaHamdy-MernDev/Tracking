import { useState, useEffect, useContext } from "react";
import Api from "../Api";
import { AuthContext } from "../components/AuthContext";
import Loader from "../components/Loader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { Navigate } from "react-router-dom";
  // tests
const MonthlyReport = () => {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState("");
  const { userData, loading, token } = useContext(AuthContext);

  useEffect(() => {
    if (!token) return;

    const fetchMonthlyReport = async () => {
      try {
        const response = await Api.get(`user/monthly-report?month=${moment(selectedMonth).format("YYYY-MM")}`);
        setReports(response.data.data);
      } catch (err) {
        console.error("Failed to fetch monthly report:", err.response);
      }
    };

    fetchMonthlyReport();
  }, [token, selectedMonth]);

  if (loading) return <Loader />;
  if (!userData) return <Navigate to="/" replace />;
  if (userData.role !== "admin") return <Navigate to="/profile" replace />;

  const handleMonthChange = (date) => {
    setSelectedMonth(date);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const filteredAndSortedEmployees = reports
    ?.filter((report) => {
      const matchesSearchTerm =
        report.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.uniqueNumber.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearchTerm;
    })
    .sort((a, b) => {
      const countsA = [
        a.totalCheckInCount,
        a.totalCanceledCount,
        a.totalNotCompletedCount,
        a.totalAbsenceWithReasonCount,
        a.totalAbsenceWithoutReasonCount,
      ];
      const countsB = [
        b.totalCheckInCount,
        b.totalCanceledCount,
        b.totalNotCompletedCount,
        b.totalAbsenceWithReasonCount,
        b.totalAbsenceWithoutReasonCount,
      ];

      for (let i = 0; i < countsA.length; i++) {
        if (countsB[i] !== countsA[i]) {
          return countsB[i] - countsA[i];
        }
      }
      return 0;
    });

    const minutesToHoursAndMinutes = (minutes) => {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}:${remainingMinutes.toString().padStart(2, '0')}`;
    };
    
  return (
    <div className="flex justify-center items-start min-h-screen relative p-2">
      <h1 className="absolute top-0 md:top-10 mx-auto max-w-96 max-h-14 md:max-w-[60] h-12 mb-40 p-2">
        <img src="/logo.png" alt="" />
      </h1>
      <div className="min-h-96 flex flex-col mt-40 bg-white max-w-full rounded-xl overflow-x-auto overflow-y-hidden" dir="ltr">
        <div className="min-h-96 w-full">
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
                </div>
                <div className="relative max-w-xs">
                  <label className="sr-only">Select Month</label>
                  <DatePicker
                    selected={selectedMonth}
                    onChange={handleMonthChange}
                    dateFormat="yyyy-MM"
                    showMonthYearPicker
                    className="py-2 px-3 block w-full bg-[#E2E8F0] border-gray-200 shadow-sm rounded-lg text-sm focus:outline-none disabled:opacity-50 disabled:pointer-events-none"
                  />
                </div>
                
              </div>
              <div className="overflow-x-auto overflow-y-hidden">
                <table className="min-w-fit divide-y divide-gray-200">
                  <thead className="bg-[#e7e2e2]">
                    <tr>
                      <th className="px-6 py-3 text-center text-lg font-medium text-[#333333] uppercase whitespace-nowrap">#</th>
                      <th className="px-6 py-3 text-center text-lg font-medium text-[#333333] uppercase whitespace-nowrap">اسم الموظف</th>
                      <th className="px-6 py-3 text-center text-lg font-medium text-[#333333] uppercase whitespace-nowrap">الفرع</th>
                      <th className="px-6 py-3 text-center text-lg font-medium text-[#333333] uppercase whitespace-nowrap">الحضور</th>
                      <th className="px-6 py-3 text-center text-lg font-medium text-[#333333] uppercase whitespace-nowrap">عدد ساعات العمل</th>
                      <th className="px-6 py-3 text-center text-lg font-medium text-[#333333] uppercase whitespace-nowrap">الغياب بعذر</th>
                      <th className="px-6 py-3 text-center text-lg font-medium text-[#333333] uppercase whitespace-nowrap">الغياب بدون عذر</th>
                      <th className="px-6 py-3 text-center text-lg font-medium text-[#333333] uppercase whitespace-nowrap">اذن انصراف</th>
                      <th className="px-6 py-3 text-center text-lg font-medium text-[#333333] uppercase whitespace-nowrap">تم الالغاء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 ">
                    {filteredAndSortedEmployees?.map((report, index) => (
                      <tr key={index+1} className="odd:bg-white even:bg-gray-200">
                        <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-800">{report.uniqueNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-800">{report.username || "N/A"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-center font-medium text-gray-800">{report.companyBranch || "N/A"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-center font-medium text-gray-800">{report.totalCheckInCount || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-center font-medium text-gray-800">{minutesToHoursAndMinutes(report.totalWorkHours) || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-center font-medium text-gray-800">{report.totalAbsenceWithReasonCount || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-center font-medium text-gray-800">{report.totalAbsenceWithoutReasonCount || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-center font-medium text-gray-800">{report.totalNotCompletedCount || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-center font-medium text-gray-800">{report.totalCanceledCount || 0}</td>
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

export default MonthlyReport;
