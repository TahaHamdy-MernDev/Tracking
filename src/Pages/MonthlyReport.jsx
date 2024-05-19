import React, { useState, useEffect, useContext } from "react";
import Api from "../Api";
import { AuthContext } from "../components/AuthContext";
import Loader from "../components/Loader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

const MonthlyReport = () => {
  const [reports, setReports] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const { userData, loading, token } = useContext(AuthContext);

  useEffect(() => {
    if (!token) return;

    const fetchMonthlyReport = async () => {
      try {
        const response = await Api.get(`user/monthly-report?month=${moment(selectedMonth).format("YYYY-MM")}`);
        console.log(response.data.data);
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

  return (
    <div className="flex justify-center items-start  min-h-screen relative p-2">
      <h1 className="absolute top-0 md:top-10 mx-auto max-w-96 max-h-14 md:max-w-[60] h-12 mb-40 p-2">
        <img src="/logo.png" alt="" />
      </h1>
      <div
        className="min-h-96 flex flex-col mt-40 bg-white max-w-full rounded-xl overflow-x-auto overflow-y-hidden"
        dir="ltr"
      >
        <div className="min-h-96 w-full">
          <div className=" inline-block align-middle">
            <div className="border rounded-lg divide-y divide-gray-200">
              <div className="py-3 px-4 flex justify-between">
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
                      {/* <th className="px-6 py-3 text-center text-lg font-medium text-[#333333] uppercase whitespace-nowrap">عدد ساعات العمل</th> */}
                      <th className="px-6 py-3 text-center text-lg font-medium text-[#333333] uppercase whitespace-nowrap">عدد مرات الحضور</th>
                      <th className="px-6 py-3 text-center text-lg font-medium text-[#333333] uppercase whitespace-nowrap">عدد مرات الغياب</th>
                      <th className="px-6 py-3 text-center text-lg font-medium text-[#333333] uppercase whitespace-nowrap">عدد مرات الغياب بعذر</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reports?.map((report, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-800">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-800">{report.username || "N/A"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-center font-medium text-gray-800">{report.companyBranch || "N/A"}</td>
                        {/* <td className="px-6 py-4 whitespace-nowrap text-base text-center font-medium text-gray-800">{report.totalWorkHours || "N/A"}</td> */}
                        <td className="px-6 py-4 whitespace-nowrap text-base text-center font-medium text-gray-800">{report.totalCheckInCount || "N/A"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-center font-medium text-gray-800">{report.totalAbsenceCount || "N/A"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-center font-medium text-gray-800">{report.totalAbsenceWithReasonCount || "N/A"}</td>
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