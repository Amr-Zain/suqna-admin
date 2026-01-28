import { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";
import { t } from "i18next";
import offlineJson from "@/assets/icons/animated/NoInternet.json";

const NetworkWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasComeBackOnline, setHasComeBackOnline] = useState(false);
  const [countdown, setCountdown] = useState(20);
  const reloadTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setHasComeBackOnline(true);
      setCountdown(20);

      // Start countdown
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Start reload timer
      reloadTimerRef.current = setTimeout(() => {
        window.location.reload();
      }, 20000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setHasComeBackOnline(false);

      // Cancel timers
      if (reloadTimerRef.current) clearTimeout(reloadTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (reloadTimerRef.current) clearTimeout(reloadTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, []);

  if (!isOnline || hasComeBackOnline) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center bg-white">
        <Lottie animationData={offlineJson} loop className="w-72 h-50 mb-6" />
        <h1 className="text-3xl font-bold mb-4 text-red-600">
        
          { t("connection_error_page.no_internet_title")}
  
        </h1>

        <p className="text-gray-600 mb-4">

           {t("connection_error_page.no_internet_message")}

        </p>

        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          onClick={() => window.location.reload()}
        >
          {t("connection_error_page.retry_button")}
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default NetworkWrapper;
