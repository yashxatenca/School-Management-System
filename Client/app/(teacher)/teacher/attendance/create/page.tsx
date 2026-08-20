"use client";

import { RootState } from "@/app/redux/store";
import { useSelector } from "react-redux";
import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import {
  useTeacherClassAttendance,
  useTeacherMarkAttendance,
  useTeacherDeleteAttendance,
} from "../_components/useAttendance";
import { useGetStudent } from "@/hooks/Teacher/useTeacherStudent";
import { AttendanceStatus } from "../_components/attendance.types";
import {
  Check,
  X,
  Clock,
  Trash2,
  Save,
  Loader2,
  RefreshCw,
  Users,
  CheckCircle2,
  XCircle,
  Clock3,
  Sparkles,
} from "lucide-react";

interface LocalRecord {
  studentId: string;
  studentName: string;
  rollNumber: string;
  status: AttendanceStatus;
  remarks: string;
  attendanceId?: string;
}

export default function ResponsiveTeacherAttendancePage() {
  const { classId, className } = useSelector(
    (state: RootState) => state.teacherclassstate,
  );

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [records, setRecords] = useState<LocalRecord[]>([]);

  const {
    data: studentsData,
    isLoading: isStudentsLoading,
    refetch: refetchStudents,
  } = useGetStudent();

  const {
    data: attendanceData,
    isLoading: isAttendanceLoading,
    isFetching: isAttendanceFetching,
    refetch: refetchAttendance,
  } = useTeacherClassAttendance(classId as string, date);

  const markMutation = useTeacherMarkAttendance();
  const deleteMutation = useTeacherDeleteAttendance(classId as string, date);

  useEffect(() => {
    if (!studentsData?.data) return;

    const existingLogsMap = new Map<string, any>();

    if (Array.isArray(attendanceData?.data)) {
      attendanceData.data.forEach((log: any) => {
        const idKey =
          typeof log.studentId === "object" && log.studentId !== null
            ? log.studentId._id
            : log.studentId;

        if (idKey) {
          existingLogsMap.set(String(idKey), log);
        }
      });
    }

    const mergedRecords: LocalRecord[] = studentsData.data.map(
      (student: any) => {
        const existingLog = existingLogsMap.get(String(student._id));

        return {
          studentId: student._id,
          studentName: student.name || "Unknown Student",
          rollNumber: student.studentId || "N/A",
          status: (existingLog?.status as AttendanceStatus) || "PRESENT",
          remarks: existingLog?.remarks || "",
          attendanceId: existingLog?._id,
        };
      },
    );

    setRecords(mergedRecords);
  }, [studentsData, attendanceData]);

  const stats = useMemo(() => {
    const total = records.length;
    const present = records.filter((r) => r.status === "PRESENT").length;
    const absent = records.filter((r) => r.status === "ABSENT").length;
    const late = records.filter((r) => r.status === "LATE").length;
    return { total, present, absent, late };
  }, [records]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setRecords((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, status } : r)),
    );
  };

  const handleBulkMark = (status: AttendanceStatus) => {
    setRecords((prev) => prev.map((r) => ({ ...r, status })));
    toast.info(`Marked all students as ${status}`);
  };

  const handleRemarkChange = (studentId: string, remarks: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, remarks } : r)),
    );
  };

  const handleFetch = async () => {
    if (!classId) {
      toast.warning("Please select a class first.");
      return;
    }
    try {
      await Promise.all([refetchStudents(), refetchAttendance()]);
      toast.success("Attendance synced!");
    } catch {
      toast.error("Failed to fetch records.");
    }
  };

  const handleSave = () => {
    if (!classId) {
      toast.error("Class ID missing.");
      return;
    }

    markMutation.mutate(
      {
        classId,
        date,
        records: records.map((r) => ({
          studentId: r.studentId,
          status: r.status,
          remarks: r.remarks,
        })),
      },
      {
        onSuccess: () => {
          toast.success("Attendance saved successfully!");
          refetchAttendance();
        },
        onError: (err: any) => {
          toast.error(err?.message || "Failed to save attendance.");
        },
      },
    );
  };

  const handleDelete = (attendanceId?: string) => {
    if (!attendanceId) return;

    if (confirm("Delete this saved entry from database?")) {
      deleteMutation.mutate(attendanceId, {
        onSuccess: () => {
          toast.success("Entry removed!");
          refetchAttendance();
        },
        onError: (err: any) => {
          toast.error(err?.message || "Failed to delete.");
        },
      });
    }
  };

  const isLoading = isStudentsLoading || isAttendanceLoading;

  return (
    <div className="min-h-screen bg-slate-100/70 p-4 sm:p-6 max-w-7xl mx-auto space-y-6 text-slate-800">
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Class Attendance
            </h1>
            <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200">
              Active Session
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Class Name:{" "}
            <span className="font-mono text-slate-800 font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {className || "Select Class"}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="flex-1 md:flex-none px-3.5 py-2 rounded-lg text-sm bg-slate-50 border border-slate-300 font-medium text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition"
          />

          <button
            onClick={handleFetch}
            disabled={isAttendanceFetching || !classId}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg shadow-sm transition active:scale-95 disabled:opacity-50 cursor-pointer whitespace-nowrap"
          >
            <RefreshCw
              className={`w-4 h-4 ${isAttendanceFetching ? "animate-spin" : ""}`}
            />
            Fetch Data
          </button>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Roster
            </p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">
              {stats.total}
            </p>
          </div>
          <div className="p-2 sm:p-3 bg-slate-100 text-slate-600 rounded-xl">
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        <div className="bg-emerald-50/80 p-4 sm:p-5 rounded-xl border border-emerald-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] sm:text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Present
            </p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-700">
              {stats.present}
            </p>
          </div>
          <div className="p-2 sm:p-3 bg-emerald-600 text-white rounded-xl shadow-xs">
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        <div className="bg-rose-50/80 p-4 sm:p-5 rounded-xl border border-rose-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] sm:text-xs font-bold text-rose-800 uppercase tracking-wider">
              Absent
            </p>
            <p className="text-2xl sm:text-3xl font-black text-rose-700">
              {stats.absent}
            </p>
          </div>
          <div className="p-2 sm:p-3 bg-rose-600 text-white rounded-xl shadow-xs">
            <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        <div className="bg-amber-50/80 p-4 sm:p-5 rounded-xl border border-amber-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] sm:text-xs font-bold text-amber-800 uppercase tracking-wider">
              Late
            </p>
            <p className="text-2xl sm:text-3xl font-black text-amber-700">
              {stats.late}
            </p>
          </div>
          <div className="p-2 sm:p-3 bg-amber-500 text-white rounded-xl shadow-xs">
            <Clock3 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
      </div>

      {/* Roster & Quick Actions Table Container */}
      {isLoading ? (
        <div className="p-16 text-center text-slate-500 bg-white rounded-xl border border-slate-200 flex justify-center items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" /> Syncing
          class data...
        </div>
      ) : records.length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
          No students found. Select a valid Class ID and click{" "}
          <strong className="text-slate-800">Fetch Data</strong>.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Quick Bulk Actions Bar */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Sparkles className="w-4 h-4 text-amber-500" /> Bulk Mark Options:
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => handleBulkMark("PRESENT")}
                className="flex-1 sm:flex-none px-3.5 py-2 sm:py-1.5 text-xs font-bold bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 rounded-lg transition active:scale-95 cursor-pointer"
              >
                Mark All Present
              </button>
              <button
                onClick={() => handleBulkMark("ABSENT")}
                className="flex-1 sm:flex-none px-3.5 py-2 sm:py-1.5 text-xs font-bold bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 rounded-lg transition active:scale-95 cursor-pointer"
              >
                Mark All Absent
              </button>
            </div>
          </div>

          {/* DESKTOP TABLE VIEW */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-5 min-w-[100px]">Roll No</th>
                  <th className="py-3.5 px-5 min-w-[180px]">Student Name</th>
                  <th className="py-3.5 px-5 text-center min-w-[320px]">
                    Status Toggle
                  </th>
                  <th className="py-3.5 px-5 min-w-[200px]">Remarks</th>
                  <th className="py-3.5 px-5 text-center min-w-[130px]">
                    Action / State
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((r) => (
                  <tr
                    key={r.studentId}
                    className="hover:bg-slate-50/80 transition"
                  >
                    <td className="py-4 px-5">
                      <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                        {r.rollNumber}
                      </span>
                    </td>
                    <td className="py-4 px-5 font-semibold text-slate-900">
                      {r.studentName}
                    </td>

                    <td className="py-4 px-5">
                      <div className="flex items-center justify-center gap-2">
                        {/* Present */}
                        <button
                          type="button"
                          onClick={() =>
                            handleStatusChange(r.studentId, "PRESENT")
                          }
                          style={{
                            backgroundColor:
                              r.status === "PRESENT" ? "#16a34a" : "#f0fdf4",
                            color:
                              r.status === "PRESENT" ? "#ffffff" : "#15803d",
                            borderColor:
                              r.status === "PRESENT" ? "#16a34a" : "#bbf7d0",
                          }}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" /> Present
                        </button>

                        {/* Absent */}
                        <button
                          type="button"
                          onClick={() =>
                            handleStatusChange(r.studentId, "ABSENT")
                          }
                          style={{
                            backgroundColor:
                              r.status === "ABSENT" ? "#dc2626" : "#fef2f2",
                            color:
                              r.status === "ABSENT" ? "#ffffff" : "#b91c1c",
                            borderColor:
                              r.status === "ABSENT" ? "#dc2626" : "#fecaca",
                          }}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border"
                        >
                          <X className="w-3.5 h-3.5 stroke-[3]" /> Absent
                        </button>

                        {/* Late */}
                        <button
                          type="button"
                          onClick={() =>
                            handleStatusChange(r.studentId, "LATE")
                          }
                          style={{
                            backgroundColor:
                              r.status === "LATE" ? "#f59e0b" : "#fffbe8",
                            color: r.status === "LATE" ? "#ffffff" : "#b45309",
                            borderColor:
                              r.status === "LATE" ? "#f59e0b" : "#fde68a",
                          }}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border"
                        >
                          <Clock className="w-3.5 h-3.5 stroke-[3]" /> Late
                        </button>
                      </div>
                    </td>

                    <td className="py-4 px-5">
                      <input
                        type="text"
                        value={r.remarks}
                        onChange={(e) =>
                          handleRemarkChange(r.studentId, e.target.value)
                        }
                        placeholder="Add note..."
                        className="px-3 py-1.5 rounded-lg text-xs w-full bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:bg-white focus:border-blue-500 transition"
                      />
                    </td>

                    <td className="py-4 px-5 text-center">
                      {r.attendanceId ? (
                        <div className="flex items-center justify-center gap-2">
                          <span className="px-2.5 py-1 text-[11px] font-bold bg-blue-50 text-blue-700 rounded-md border border-blue-200">
                            Saved
                          </span>
                          <button
                            onClick={() => handleDelete(r.attendanceId)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete entry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="px-2.5 py-1 text-[11px] font-bold bg-amber-50 text-amber-700 rounded-md border border-amber-200">
                          Unsaved
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARD VIEW */}
          <div className="md:hidden flex flex-col divide-y divide-slate-100">
            {records.map((r) => (
              <div key={r.studentId} className="p-4 space-y-4">
                {/* Header: Name, Roll Number & Save Status */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                      {r.rollNumber}
                    </span>
                    <h3 className="text-base font-semibold text-slate-900 mt-1">
                      {r.studentName}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {r.attendanceId ? (
                      <span className="px-2 py-1 text-[10px] font-bold bg-blue-50 text-blue-700 rounded-md border border-blue-200">
                        Saved
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-[10px] font-bold bg-amber-50 text-amber-700 rounded-md border border-amber-200">
                        Unsaved
                      </span>
                    )}
                    {r.attendanceId && (
                      <button
                        onClick={() => handleDelete(r.attendanceId)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Delete entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Status Toggle Buttons */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(r.studentId, "PRESENT")}
                    style={{
                      backgroundColor:
                        r.status === "PRESENT" ? "#16a34a" : "#f0fdf4",
                      color: r.status === "PRESENT" ? "#ffffff" : "#15803d",
                      borderColor:
                        r.status === "PRESENT" ? "#16a34a" : "#bbf7d0",
                    }}
                    className="flex-1 py-2 rounded-lg text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer border"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" /> Present
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusChange(r.studentId, "ABSENT")}
                    style={{
                      backgroundColor:
                        r.status === "ABSENT" ? "#dc2626" : "#fef2f2",
                      color: r.status === "ABSENT" ? "#ffffff" : "#b91c1c",
                      borderColor:
                        r.status === "ABSENT" ? "#dc2626" : "#fecaca",
                    }}
                    className="flex-1 py-2 rounded-lg text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer border"
                  >
                    <X className="w-3.5 h-3.5 stroke-[3]" /> Absent
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusChange(r.studentId, "LATE")}
                    style={{
                      backgroundColor:
                        r.status === "LATE" ? "#f59e0b" : "#fffbe8",
                      color: r.status === "LATE" ? "#ffffff" : "#b45309",
                      borderColor: r.status === "LATE" ? "#f59e0b" : "#fde68a",
                    }}
                    className="flex-1 py-2 rounded-lg text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer border"
                  >
                    <Clock className="w-3.5 h-3.5 stroke-[3]" /> Late
                  </button>
                </div>

                {/* Remarks Input */}
                <div>
                  <input
                    type="text"
                    value={r.remarks}
                    onChange={(e) =>
                      handleRemarkChange(r.studentId, e.target.value)
                    }
                    placeholder="Add remark / note..."
                    className="px-3 py-2 rounded-lg text-sm w-full bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:bg-white focus:border-blue-500 transition"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Save Bar */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
            <button
              onClick={handleSave}
              disabled={markMutation.isPending}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {markMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Attendance
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
