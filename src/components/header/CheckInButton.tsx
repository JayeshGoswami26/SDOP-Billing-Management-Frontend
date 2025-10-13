/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, LogOut, Fingerprint, Loader2, AlertCircle, CheckCircle, Clock4 } from "lucide-react";
import { Modal } from "../ui/modal";
import ToggleButton from "../ui/button/ToggleButton";
import axios from "axios";
import { CheckInData } from "../../types/Header";
import { getAuth } from "../../utils/auth";

const CheckInButton: React.FC = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showCheckOutModal, setShowCheckOutModal] = useState(false);
  const [checkInData, setCheckInData] = useState<CheckInData>({
    startTime: new Date(),
    totalTime: 0,
    isActive: false,
    isPaused: false,
    shiftLunchTime: 0,
    shiftBreakTime: 0,
    status: '',
    leaveStatus: '',
    pauses: [],
  });
  const [notes, setNotes] = useState("");
  const [totalHours, setTotalHours] = useState("0");
  const [attendanceStatus, setAttendanceStatus] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [pauseResumeLoading, setPauseResumeLoading] = useState(false);
  const { token } = getAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>('');
  const baseURL = import.meta.env.VITE_API_URL;

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getElapsedSeconds = (from: Date, to: Date) => {
    return Math.floor((to.getTime() - from.getTime()) / 1000);
  };

  // Helper to sum all paused ms
  const getTotalPausedMs = (pauses: { pauseTime: string; resumeTime?: string }[] = [], isPaused: boolean) => {
    let total = 0;
    for (let i = 0; i < pauses.length; i++) {
      const pause = pauses[i];
      const start = new Date(pause.pauseTime).getTime();
      const end = pause.resumeTime ? new Date(pause.resumeTime).getTime() : (isPaused && i === pauses.length - 1 ? Date.now() : start);
      total += Math.max(0, end - start);
    }
    return total;
  };

  // Timer logic: always subtract total paused ms
  const startTimerFrom = (startTime: Date, pauses: { pauseTime: string; resumeTime?: string }[] = [], isPaused: boolean) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (isPaused) {
      // If paused, set totalTime once and don't update
      setCheckInData((prev) => {
        const now = new Date();
        const totalPausedMs = getTotalPausedMs(pauses, isPaused);
        const totalTime = Math.floor((now.getTime() - startTime.getTime() - totalPausedMs) / 1000);
        return { ...prev, totalTime };
      });
      return;
    }
    intervalRef.current = setInterval(() => {
      setCheckInData((prev) => {
        const now = new Date();
        const totalPausedMs = getTotalPausedMs(pauses, false);
        const totalTime = Math.floor((now.getTime() - startTime.getTime() - totalPausedMs) / 1000);
        return { ...prev, totalTime };
      });
    }, 1000);
  };

  // Stop timer
  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Get status display info
  const getStatusDisplay = (status: string, leaveStatus: string) => {
    const statusConfig = {
      // 'present': { 
      //   icon: <CheckCircle size={16} className="text-green-500" />, 
      //   message: 'Present', 
      //   color: 'text-green-600',
      //   bgColor: 'bg-green-50 dark:bg-green-900/20'
      // },
      'late_check_in': { 
        icon: <AlertCircle size={16} className="text-orange-500" />, 
        message: 'Late Check-in', 
        color: 'text-orange-600',
        bgColor: 'bg-orange-50 dark:bg-orange-900/20'
      },
      'halfDay': { 
        icon: <Clock4 size={16} className="text-blue-500" />, 
        message: 'Half Day', 
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20'
      },
      'present_on_leave': { 
        icon: <CheckCircle size={16} className="text-purple-500" />, 
        message: 'Present on Leave', 
        color: 'text-purple-600',
        bgColor: 'bg-purple-50 dark:bg-purple-900/20'
      },
      'overtime': { 
        icon: <Clock4 size={16} className="text-indigo-500" />, 
        message: 'Overtime', 
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50 dark:bg-indigo-900/20'
      },
      'holiday': { 
        icon: <CheckCircle size={16} className="text-yellow-500" />, 
        message: 'Holiday', 
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
      },
      'weekend': { 
        icon: <CheckCircle size={16} className="text-yellow-500" />, 
        message: 'Weekend', 
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
      },
      'not_in_office': { 
        icon: <AlertCircle size={16} className="text-red-500" />, 
        message: 'Not in Office', 
        color: 'text-red-600',
        bgColor: 'bg-red-50 dark:bg-red-900/20'
      },
      'absent': { 
        icon: <AlertCircle size={16} className="text-red-500" />, 
        message: 'Absent', 
        color: 'text-red-600',
        bgColor: 'bg-red-50 dark:bg-red-900/20'
      },
      'leave': { 
        icon: <CheckCircle size={16} className="text-blue-500" />, 
        message: 'On Leave', 
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20'
      }
    };

    return statusConfig[status as keyof typeof statusConfig] || statusConfig.not_in_office;
  };

  const fetchTodayAttendance = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseURL}/employee/today/attendance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const attendance = response.data;
      
      if (attendance && attendance.checkInTime) {
        const checkInTime = new Date(attendance.checkInTime);
        setCheckInData({
          startTime: checkInTime,
          totalTime: 0, // will be set by timer
          isActive: true,
          isPaused: attendance.isPaused,
          shiftLunchTime: attendance.shiftLunchTime,
          shiftBreakTime: attendance.shiftBreakTime,
          status: attendance.status,
          leaveStatus: attendance.leaveStatus,
          pauses: attendance.pauses || [],
        });

        const checkInData = {
          checkInTime: attendance.checkInTime,
          totalHours: attendance.totalHours,
          pauses: attendance.pauses,
          checkOutTime: attendance.checkOutTime,
        }

        localStorage.setItem("checkInData", JSON.stringify(checkInData))
        setTotalHours(attendance.totalHours || "0");
        setAttendanceStatus(attendance.status || '');
        
        // Set status message based on attendance status
        const statusInfo = getStatusDisplay(attendance.status || '', attendance.leaveStatus || '');
        setStatusMessage(statusInfo.message);

        if (attendance.totalHours === "0" && !attendance.checkOutTime) {
          setIsCheckedIn(true);
          startTimerFrom(checkInTime, attendance.pauses || [], attendance.isPaused);
        } else {
          setIsCheckedIn(false);
          stopTimer();
        }
      } else {
        setIsCheckedIn(false);
        setTotalHours("0");
        setAttendanceStatus('');
        setStatusMessage('');
        setCheckInData({
          startTime: new Date(),
          totalTime: 0,
          isActive: false,
          isPaused: false,
          shiftLunchTime: 0,
          shiftBreakTime: 0,
          status: '',
          leaveStatus: '',
          pauses: [],
        });
      }
    } catch (err) {
      setError("Failed to fetch attendance");
      setIsCheckedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const hasFetchedAttendance = useRef(false)

  useEffect(() => {
    if(!hasFetchedAttendance.current) {
      fetchTodayAttendance()
      hasFetchedAttendance.current = true
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [token, baseURL]);

  const handleCheckIn = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await axios.get(`${baseURL}/employee/check-in`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const attendance = response.data.data || response.data;
      if (attendance && attendance.checkInTime) {
        const checkInTime = new Date(attendance.checkInTime);
        setCheckInData({
          startTime: checkInTime,
          totalTime: 0, // will be set by timer
          isActive: true,
          isPaused: attendance.isPaused,
          shiftLunchTime: attendance.shiftLunchTime,
          shiftBreakTime: attendance.shiftBreakTime,
          status: attendance.status,
          leaveStatus: attendance.leaveStatus,
          pauses: attendance.pauses || [],
        });
        setIsCheckedIn(true);
        setTotalHours("0");
        setAttendanceStatus(attendance.status || '');
        
        // Set status message based on response
        const statusInfo = getStatusDisplay(attendance.status || '', attendance.leaveStatus || '');
        setStatusMessage(statusInfo.message);
        
        startTimerFrom(checkInTime, attendance.pauses || [], attendance.isPaused);
      }
      setShowCheckInModal(false);
    } catch (error: any) {
      setError(error?.response?.data?.message || "Error checking in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await axios.get(`${baseURL}/employee/check-out`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const attendance = response.data.data?.attendance || response.data.attendance || response.data;
      if (attendance && attendance.totalHours) {
        setTotalHours(attendance.totalHours);
        stopTimer();
        setCheckInData((prev) => ({ ...prev, isActive: false }));
        setAttendanceStatus(attendance.status || '');
        
        // Set status message based on checkout result
        const statusInfo = getStatusDisplay(attendance.status || '', attendance.leaveStatus || '');
        setStatusMessage(statusInfo.message);
        
        setShowCheckOutModal(false);
      }
    } catch (error: any) {
      setError(error?.response?.data?.message || "Error checking out");
      setIsCheckedIn(false);
      setCheckInData({
        startTime: new Date(),
        totalTime: 0,
        isActive: false,
        isPaused: false,
        shiftLunchTime: 0,
        shiftBreakTime: 0,
        status: '',
        leaveStatus: '',
      });
      setNotes("");
    } finally {
      setIsLoading(false);
      setIsCheckedIn(false);
      setCheckInData({
        startTime: new Date(),
        totalTime: 0,
        isActive: false,
        isPaused: false,
        shiftLunchTime: 0,
        shiftBreakTime: 0,
        status: '',
        leaveStatus: '',
      });
      setNotes("");
    }
  };

  // Handle check in button click
  const handleCheckInButton = () => {
    handleCheckIn();
  };

  // Handle toggle pause/resume
  const handleToggleTimer = async () => {
    if (pauseResumeLoading) return;
    setPauseResumeLoading(true);
    setError("");
    try {
      if (!token) throw new Error("No auth token");
      if (!checkInData.isPaused) {
        // Pause
        await axios.get(`${baseURL}/employee/pauseTracker`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Refetch attendance to get updated pauses
        await fetchTodayAttendance();
      } else {
        // Resume
        await axios.get(`${baseURL}/employee/resumeTracker`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Refetch attendance to get updated pauses
        await fetchTodayAttendance();
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to update tracker");
    } finally {
      setPauseResumeLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  // Get status display info for current status
  const currentStatusInfo = getStatusDisplay(checkInData.status || '', checkInData.leaveStatus || '');

  return (
    <>
      {totalHours !== "0" ? (
        <div className="flex items-center gap-2">
          <div className="w-[120px] flex mt-1 justify-between items-center gap-2 px-3 py-2 bg-themeBlueLight dark:bg-white/[0.3] rounded-lg">
            <Clock size={16} className="text-themeBlue dark:text-white" />
            <span className="font-mono text-sm text-themeBlue dark:text-white">
              {totalHours}
            </span>
          </div>
          {/* Status indicator */}
          {/* {attendanceStatus && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${currentStatusInfo.bgColor}`}>
              {currentStatusInfo.icon}
              <span className={`font-medium ${currentStatusInfo.color}`}>
                {statusMessage}
              </span>
            </div>
          )} */}
        </div>
      ) : isCheckedIn ? (
        <div className="flex items-center gap-2">
          <div className="w-[120px] flex mt-1 justify-between items-center gap-2 px-3 py-2 bg-themeBlueLight dark:bg-white/[0.3] rounded-lg">
            <Clock size={16} className="text-themeBlue dark:text-white" />
            <span className="font-mono text-sm text-themeBlue dark:text-white">
              {formatTime(checkInData.totalTime)}
            </span>
          </div>
          
          {/* Status indicator */}
          {/* {attendanceStatus && (
            <div className={`w-[120px] flex items-center gap-1 px-2 py-1 rounded-md text-xs ${currentStatusInfo.bgColor}`}>
              {currentStatusInfo.icon}
              <span className={`font-medium ${currentStatusInfo.color}`}>
                {statusMessage}
              </span>
            </div>
          )} */}
          
          <ToggleButton
            checked={checkInData.isPaused}
            onChange={handleToggleTimer}
            id="pause-resume-toggle"
            disabled={pauseResumeLoading}
          />
          <button
            onClick={()=>setShowCheckOutModal(!showCheckOutModal)}
            className="relative flex flex-col items-center justify-center group focus:outline-none"
          >
            <span className="relative flex items-center justify-center w-8 h-8 lg:w-[2.7rem] lg:h-[2.7rem] rounded-full bg-gradient-to-br from-red-500 to-pink-500 shadow-lg dark:from-red-600 dark:to-pink-700 border-2 border-white dark:border-none transition-all group-hover:scale-100 group-active:scale-95">
              <Fingerprint
                size={20}
                className="text-white dark:text-white drop-shadow-sm"
              />
            </span>
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowCheckInModal(true)}
          className=" relative flex flex-col items-center justify-center group focus:outline-none"
        >
          <span className="relative flex items-center justify-center w-8 h-8 lg:w-[2.7rem] lg:h-[2.7rem] rounded-full bg-gradient-to-br from-indigo-500 to-indigo-900 shadow-lg dark:from-indigo-500 dark:to-indigo-900 border-2 border-white dark:border-gray-900 transition-all group-hover:scale-100 group-active:scale-95">
            <Fingerprint
              size={16}
              className="text-white dark:text-white drop-shadow-sm animate-fingerprint-scan"
            />
            <span className="absolute inset-0 pointer-events-none animate-fingerprint-glow rounded-full" />
          </span>
        </button>
      )}

      {/* Check In Modal */}
      <Modal
        isOpen={showCheckInModal}
        onClose={() => {setShowCheckInModal(false) ;setError('')}}
        className="max-w-md w-full p-0 mx-5 md:mx-0"
      >
        <div className="flex flex-col items-center p-8">
          <span className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-brand-500 to-blue-500 shadow-lg dark:from-brand-500 dark:to-blue-900 mb-4">
            <Fingerprint
              size={30}
              className="text-white dark:text-white animate-fingerprint-scan"
            />
          </span>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Ready to Check In?
          </h2>
          {error && (
            <div className="text-red-500 bg-red-200 px-4 py-2 rounded-2xl text-sm mb-4 max-w-md text-center">
              <p>{error}</p>
            </div>
          )}
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
            Start your work session by checking in. Your time will be tracked
            until you check out.
          </p>
          <div className="flex gap-3 w-full justify-center text-sm md:text-base">
            <motion.button
              whileHover={{ scale: 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCheckInButton}
              className="flex-1 px-2 py-1 md:px-6 md:py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-brand-400"
              disabled={isLoading}
            >
              {isLoading ? <span className="flex items-center gap-2"><Loader2 className="animate-spin" /> Checking In</span> : "Yes, Check In"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {setShowCheckInModal(false) ;setError('')}}
              className="flex-1 px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors shadow-md dark:bg-themeBackgroundColorDark/20 dark:text-white dark:hover:bg-themeBackgroundColorDark/50"
              disabled={isLoading}
            >
              Cancel
            </motion.button>
          </div>
        </div>
      </Modal>

      {/* Check Out Modal */}
      <Modal
        isOpen={showCheckOutModal}
        onClose={() => setShowCheckOutModal(false)}
        className="w-full max-w-md md:max-w-2xl mx-2 md:mx-0"
      >
        <div className="flex flex-col items-center p-8">
          <span className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-pink-500 shadow-lg dark:from-red-600 dark:to-pink-700 mb-4">
            <LogOut size={30} className="text-white dark:text-white" />
          </span>
          <h2 className="text-2xl font-bold text-gray-700 dark:text-white mb-2">
            Check Out Summary
          </h2>
          {error && (
            <div className="text-red-500 bg-red-200 px-4 py-2 rounded-2xl text-sm mb-4 max-w-md text-center">
              <p>{error}</p>
            </div>
          )}
          
          {/* Status display in checkout modal */}
          {attendanceStatus && (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-4 ${currentStatusInfo.bgColor}`}>
              {currentStatusInfo.icon}
              <span className={`font-medium ${currentStatusInfo.color}`}>
                {statusMessage}
              </span>
            </div>
          )}
          
          <div className="bg-transparent dark:bg-transparent rounded-lg p-3 mb-4 w-full text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Total Time Worked
            </p>
            <p className="text-2xl font-mono font-bold text-gray-700 dark:text-white">
              {formatTime(checkInData.totalTime)}
            </p>
          </div>
          <div className="flex gap-3 w-full justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCheckOutModal(false)}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors shadow-md dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            disabled={isLoading}
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCheckOut}
              className={`px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 ${isLoading ? 'cursor-not-allowed': 'cursor-pointer'}`}
              disabled={isLoading}
            >
              {isLoading ? <span className="flex items-center gap-2"><Loader2 className="animate-spin" /> Checking Out</span> : "Save & Check Out"}
            </motion.button>
          </div>
        </div>
      </Modal>

      {/* Fingerprint scan animation styles */}
      <style>{`
        @keyframes fingerprint-scan {
          0%, 100% { filter: drop-shadow(0 0 0 #fff); opacity: 1; }
          50% { filter: drop-shadow(0 0 16px #fff); opacity: 0.85; }
        }
        .animate-fingerprint-scan {
          animation: fingerprint-scan 1.5s infinite;
        }
        @keyframes fingerprint-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.3); }
          50% { box-shadow: 0 0 20px 2px rgba(59,130,246,0.5); }
        }
        .animate-fingerprint-glow {
          animation: fingerprint-glow 1.5s infinite;
        }
      `}</style>
    </>
  );
};

export default CheckInButton;