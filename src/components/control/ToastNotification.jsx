import React from "react";
import { Check, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ToastNotification({ message, type = "success" }) {
  if (!message) return null;

  const isSuccess = type === "success";

  return (
    <AnimatePresence>
      <motion.div
        key={message}
        initial={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        exit={{ opacity: 0, translateY: -20 }}
        transition={{ duration: 0.25 }}
        className={`toast-notification ${isSuccess ? "success" : "error"}`}
      >
        {isSuccess ? <Check size={16} /> : <AlertCircle size={16} />}
        <span>{message}</span>
      </motion.div>
    </AnimatePresence>
  );
}
