import React from "react";

interface CustomAlertProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: "info" | "warning" | "success" | "error";
  onClose: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export default function CustomAlert({
  isOpen,
  title,
  message,
  type = "warning",
  onClose,
  onConfirm,
  confirmLabel = "Oke, Mengerti",
  cancelLabel = "Batal",
}: CustomAlertProps) {
  if (!isOpen) return null;

  const getTheme = () => {
    switch (type) {
      case "success":
        return {
          icon: "check_circle",
          iconColor: "text-green-500",
          bgColor: "bg-green-50",
          borderColor: "border-green-100",
          accentColor: "bg-green-500 hover:bg-green-600",
        };
      case "error":
        return {
          icon: "error",
          iconColor: "text-red-500",
          bgColor: "bg-red-50",
          borderColor: "border-red-100",
          accentColor: "bg-red-500 hover:bg-red-600",
        };
      case "info":
        return {
          icon: "info",
          iconColor: "text-blue-500",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-100",
          accentColor: "bg-[#2c46a9] hover:bg-[#020c38]",
        };
      case "warning":
      default:
        return {
          icon: "warning",
          iconColor: "text-amber-500",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-100",
          accentColor: "bg-amber-500 hover:bg-amber-600",
        };
    }
  };

  const theme = getTheme();

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Dark overlay backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Styled alert box card */}
      <div className="bg-white rounded-[32px] w-full max-w-md p-6 md:p-8 flex flex-col items-center text-center relative z-10 shadow-2xl border border-gray-100 animate-scale-up text-[#020c38]">
        
        {/* Rounded Icon badge */}
        <div className={`w-16 h-16 rounded-full ${theme.bgColor} flex items-center justify-center shrink-0 mb-5 border ${theme.borderColor}`}>
          <span className={`material-symbols-outlined text-[32px] ${theme.iconColor} select-none`}>
            {theme.icon}
          </span>
        </div>

        {/* Content messages */}
        <h3 className="font-sora font-extrabold text-xl tracking-tight text-[#020c38] mb-2">
          {title}
        </h3>
        <p className="font-poppins text-xs text-gray-500 leading-relaxed mb-6 max-w-sm whitespace-pre-wrap">
          {message}
        </p>

        {/* Action button rows */}
        <div className="flex flex-col sm:flex-row gap-2.5 w-full mt-2">
          {onConfirm && (
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 bg-[#2c46a9] hover:bg-[#020c38] text-white font-poppins font-bold py-3.5 px-4 rounded-2xl transition-all cursor-pointer text-xs"
            >
              {confirmLabel}
            </button>
          )}
          <button
            onClick={onClose}
            className={`flex-1 font-poppins font-bold py-3.5 px-4 rounded-2xl transition-all cursor-pointer text-xs ${
              onConfirm 
                ? "bg-slate-50 hover:bg-slate-100 text-gray-500 border border-slate-100" 
                : "bg-[#2c46a9] hover:bg-[#020c38] text-white shadow-md shadow-blue-150"
            }`}
          >
            {onConfirm ? cancelLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
