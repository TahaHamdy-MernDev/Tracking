import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../components/AuthContext";
import Loader from "../components/Loader";
import { Link, Navigate, useParams } from "react-router-dom";
import Api from "../Api";
import moment from "moment";
import "moment/locale/ar";
import { X } from "lucide-react";
export default function MonthlyUserReport() {
  const { month, id } = useParams();
  const [reports, setReports] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [absenceReason, setAbsenceReason] = useState("");
  const { userData, loading, token } = useContext(AuthContext);
  useEffect(() => {
    if (!token) return;

    const fetchMonthlyReport = async () => {
      try {
        const response = await Api.get(
          `user/monthly-user-report/${id}?month=${month}`
        );
        setReports(response.data.data);
      } catch (err) {
        console.error("Failed to fetch monthly report:", err.response);
      }
    };

    fetchMonthlyReport();
  }, [token, month, id]);

  if (loading) return <Loader />;
  if (!userData) return <Navigate to="/" replace />;
  if (userData.role !== "admin") return <Navigate to="/profile" replace />;

  const commonClasses =
    "px-6 py-3 cursor-default text-center max-sm:text-sm text-lg font-medium text-[#333333] uppercase whitespace-nowrap";

  const headers = [
    "التاريخ",
    "الحالة",
    "وقت الاذن",
    "وقت الحضور",
    "الموقع",
    "وقت الانصراف",
    "الموقع",
    "عدد ساعات العمل",
    "تفاصيل الاذن",
  ];
  const getStatusText = (status) => {
    const statusMap = {
      "No Record": { text: "لم يبدأ", bgColor: "#E2E8F0" },
      Pending: { text: "قيد الانتظار", bgColor: "#FB8832" },
      Completed: { text: "مكتمل", bgColor: "#4AAF05" },
      Canceled: { text: "ملغي", bgColor: "#FF5756" },
      "Absent with Reason": { text: "اذن", bgColor: "#FFDD57" },
      workMeeting: { text: "ميتنج", bgColor: "#FFDD57" },
      willBeLate: { text: "اذن تاخير", bgColor: "#FFDD57" },
      "Absent without Reason": { text: "غائب بدون سبب", bgColor: "#FF5756" },
      "Day not completed": { text: "اخذ اذن انصراف", bgColor: "#E2E8F0" },
      Holiday: { text: "اجازه", bgColor: "#E2E8F0" },
    };
    return statusMap[status] || { text: "Unknown", bgColor: "#e2e3e5" };
  };

  const convertMinutesToHoursAndMinutes = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const formatDateToYearMonth = (dateString) => {
    return moment(dateString).format("YYYY-MM-DD dddd");
  };
  const firstReport = reports ? reports[0] : null;
  const {
    uniqueNumber = "",
    username = "",
  } = firstReport || {};
  

  const extractStatusCounts = (data) => {
    const statusCounts = {};

    data?.forEach((entry) => {
      const { status } = entry;
      if (statusCounts[status]) {
        statusCounts[status]++;
      } else {
        statusCounts[status] = 1;
      }
    });

    const statusCountsFormatted = {};
    Object.keys(statusCounts).forEach((status) => {
      const { text } = getStatusText(status);
      statusCountsFormatted[text] = { count: statusCounts[status] };
    });

    return statusCountsFormatted;
  };
  const statusCounts = extractStatusCounts(reports);
  const openModal = (reason) => {
    setAbsenceReason(reason);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setAbsenceReason("");
  };

  return (
    <div className="flex justify-center items-start min-h-screen relative p-2">
      <h1 className="absolute top-0 md:top-10 mx-auto max-w-96 max-h-14 md:max-w-[60] h-12 mb-40 p-2">
        <img src="/logo.png" alt="" />
      </h1>
      <div
        className="min-h-96 flex flex-col mt-40 bg-white max-w-7xl rounded-xl overflow-x-auto overflow-y-hidden"
        dir="ltr"
      >
        <div className="w-full min-h-96">
          <div className="inline-block align-middle">
            <div className="border rounded-lg divide-y divide-gray-200">
              <div className=" p-4 flex flex-col gap-1">
                {/* <p>{uniqueNumber}</p> */}
                <p>الاسم : {username} {uniqueNumber}</p>
                <div className=" flex justify-start gap-4">
   
                    {Object.keys(statusCounts).map((statusText, index) => (
                      <p  key={index + 1}>
                      {statusCounts[statusText].count} : {statusText}
                      </p>
                    ))}
        
                </div>
              </div>
              <div className="flex justify-between">
                <div className="overflow-x-auto overflow-y-hidden">
                  <table className="min-w-fit divide-y divide-gray-200">
                    <thead className="bg-[#e7e2e2]">
                      <tr>
                        {headers.map((title, index) => (
                          <th
                            key={index + 1}
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
                      {reports?.length > 0 ? (
                        reports.map((report, index) => {
                          return (
                            <tr
                              key={index + 1}
                              className="odd:bg-white even:bg-gray-200"
                            >
                              <td className="px-6 py-4 cursor-default whitespace-nowrap text-base font-medium text-gray-800">
                                {formatDateToYearMonth(report.date) || "N/A"}
                              </td>
                        
                              <td className="px-6 py-4 cursor-default text-center whitespace-nowrap text-base text-gray-800">
                                <span
                                  className="flex items-center cursor-default justify-center px-2 py-1 w-28 rounded-full"
                                  style={{
                                    backgroundColor: getStatusText(
                                      report.status
                                    ).bgColor,
                                  }}
                                >
                                  {getStatusText(report.status).text ||
                                    "Unknown"}
                                </span>
                              </td>

                              <td className="px-6 py-4 cursor-default text-center whitespace-nowrap text-base text-gray-800">
                                {report.absentTime
                                  ? moment(report.absentTime).format("hh:mm A")
                                  : "N/A"}
                              </td>
                              <td className="px-6 py-4 cursor-default text-center whitespace-nowrap text-base text-gray-800">
                                {report.checkInTime
                                  ? moment(report.checkInTime).format("hh:mm A")
                                  : "N/A"}
                              </td>
                              <td className="px-6 py-4 text-center whitespace-nowrap text-base text-gray-800">
                                {report.checkInLocation &&
                                report.checkInLocation.latitude &&
                                report.checkInLocation.longitude ? (
                                  <Link
                                    className="underline"
                                    to={`/location?latitude=${report.checkInLocation.latitude}&longitude=${report.checkInLocation.longitude}`}
                                  >
                                    View
                                  </Link>
                                ) : (
                                  "N/A"
                                )}
                              </td>
                              <td className="px-6 py-4 cursor-default text-center whitespace-nowrap text-base text-gray-800">
                                {report.checkOutTime
                                  ? moment(report.checkOutTime).format(
                                      "hh:mm A"
                                    )
                                  : "N/A"}
                              </td>
                              <td className="px-6 py-4 cursor-default text-center whitespace-nowrap text-base text-gray-800">
                                {report.checkOutLocation &&
                                report.checkOutLocation.latitude &&
                                report.checkOutLocation.longitude ? (
                                  <Link
                                    className="underline"
                                    to={`/location?latitude=${report.checkOutLocation.latitude}&longitude=${report.checkOutLocation.longitude}`}
                                  >
                                    View
                                  </Link>
                                ) : (
                                  "N/A"
                                )}
                              </td>
                              <td className="px-6 py-4 cursor-default text-center whitespace-nowrap text-base text-gray-800">
                                {(report.workHours &&
                                  convertMinutesToHoursAndMinutes(
                                    report.workHours
                                  )) ||
                                  "N/A"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                                {report.absentReason ? (
                                  <span
                                    onClick={() =>
                                      openModal(
                                        report.absentReason,
                                        report.absentTime
                                      )
                                    }
                                    className="cursor-pointer text-blue-600 underline"
                                  >
                                    {report.absentReason.length > 10
                                      ? `${report.absentReason.substring(
                                          0,
                                          10
                                        )}...`
                                      : report.absentReason}
                                  </span>
                                ) : (
                                  "N/A"
                                )}
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
                            {reports?.length === 0 && "لا توجد بيانات لعرضها"}
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
      </div>
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
                  >{" "}</h3>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
