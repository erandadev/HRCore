import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Search, Download } from "lucide-react";

import api from "../utils/api";

//Payroll View
const PaySlip = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [month, setMonth] = useState("");
  const [year, setYear] = useState("2026");

  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [downloadLink, setDownloadLink] = useState("");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const years = ["2025", "2026"];

  const handleDownloadButton = () => {
    // Create a temporary link and click it
    const link = document.createElement("a");
    link.href = downloadLink;
    link.setAttribute(
      "download",
      `${user.username?.toUpperCase()} ${months[month - 1]} ${year} - Payslip.pdf`,
    );
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadLink);
  };

  const handleClick = async () => {
    if (month === "" || year === "") {
      setError("Please select month and year");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setDownloadLink("");
      setShowResults(false);

      const response = await api.post(
        "/api/payslip",
        {
          month: parseInt(month),
          year: parseInt(year),
        },
        { responseType: "blob" },
      );

      // Create a local URL for the binary data
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setIsLoading(false);
      setDownloadLink(url);
      setShowResults(true);
    } catch (err) {
      setDownloadLink("");
      setIsLoading(false);
      setShowResults(false);
      setError("Not Found");

      if (err.response.status === 401) {
        const logoutStatus = await api.get("/api/auth/logout");

        if (logoutStatus.data.status === "SUCCESS") {
          localStorage.clear();
          navigate("/");
        }
      }
    }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto" style={{ marginTop: "25px" }}>
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Generate Payslip</h2>
        <p className="text-gray-500">
          Select a period to retrieve your payment records.
        </p>
      </header>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Year
            </label>
            <select
              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={year}
              onChange={(e) => {
                setYear(e.target.value);
                setIsLoading(false);
                setError("");
                setDownloadLink("");
                setShowResults(false);
              }}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Month
            </label>
            <select
              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={month}
              onChange={(e) => {
                setMonth(e.target.value);

                setIsLoading(false);
                setError("");
                setDownloadLink("");
                setShowResults(false);
              }}
            >
              <option value="">Choose a month...</option>
              {months.map((m, i) => (
                <option key={m} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleClick}
            className="bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2"
          >
            <Search size={18} /> <span>Search Payslips</span>
          </button>
        </div>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">{error}</strong>

          <span className="absolute top-0 bottom- right-0 px-4 py-3"></span>
        </div>
      )}

      {isLoading && (
        <div class="border border-gray-300 shadow rounded-md p-4 w-full mx-auto">
          <div class="animate-pulse flex space-x-4">
            <div class="flex-1 space-y-4 py-1">
              <div class="h-4 bg-gray-400 rounded w-3/4"></div>
              <div class="space-y-2">
                <div class="h-4 bg-gray-400 rounded"></div>
                <div class="h-4 bg-gray-400 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Table */}
      {showResults && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">
              Results for {months[month - 1]} {year}
            </h3>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 text-xs uppercase tracking-wider border-b bg-gray-50/50">
                <th className="px-6 py-4">Employee</th>

                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50 transition">
                <td
                  className="px-6 py-4 font-medium text-gray-800"
                  style={{ textTransform: "capitalize" }}
                >
                  {`${user.username} - ${months[month - 1]} ${year}`}
                </td>

                <td className="px-6 py-4 text-right">
                  <button
                    onClick={handleDownloadButton}
                    className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-full inline-flex items-center"
                  >
                    <Download size={18} />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaySlip;
