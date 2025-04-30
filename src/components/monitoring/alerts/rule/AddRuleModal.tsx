import { useState, useEffect, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import CustomDropdown from "./Dropdown";
import NotificationOption from "./NotificationOption";



// Types
interface AddRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ruleData: FormValues) => void;
  editRule?: RuleData;
}

interface FormValues {
  ruleName: string;
  metric: string;
  threshold: string;
  duration: string;
  recipient: string;
  notifications: string;
}

interface RuleData {
  ruleId?: string;
  ruleName: string;
  metric: string;
  threshold: string;
  duration: string;
  recipient: string;
  notifications: string;
}

// Constants
const RECIPIENTS = [
  "DevOps Team",
  "Support Team",
  "Security Team",
  "Design Team",
  "Developer Team",
];
const DURATIONS = ["Immediate", "1 min", "5 mins", "10 mins", "30 mins"];
const NOTIFICATION_OPTIONS = ["SMS", "E-mail", "In-App"];

// Subcomponents
const CloseButton = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="text-gray-500 hover:text-gray-700">
    <svg
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
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  </button>
);



// ... (Types, Constants, and Subcomponents remain unchanged)

export default function AddRuleModal({
  isOpen,
  onClose,
  onSubmit,
  editRule,
}: AddRuleModalProps) {
  const isEditMode = !!editRule;

  const extractThresholdValue = (formatted: string) => {
    if (!formatted) return "";
    const match = formatted.match(/> (\d+)%/);
    return match ? match[1] : formatted;
  };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      ruleName: "",
      metric: "",
      threshold: "",
      duration: "10 mins",
      recipient: "DevOps Team",
    },
  });

  // UI state
  const [duration, setDuration] = useState("10 mins");
  const [recipient, setRecipient] = useState("DevOps Team");
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    SMS: false,
    "E-mail": false,
    "In-App": true,
  });
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);
  const [showRecipientDropdown, setShowRecipientDropdown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldSlideIn, setShouldSlideIn] = useState(false); // New state for animation

  const toggleNotification = (notification: string) => {
    setNotifications((prev) => ({
      ...prev,
      [notification]: !prev[notification],
    }));
  };

  const onFormSubmit: SubmitHandler<FormValues> = (data) => {
    const thresholdValue = parseInt(data.threshold);
    const formattedThreshold = isNaN(thresholdValue)
      ? data.threshold
      : `> ${thresholdValue}%`;

    const notificationMediums = Object.entries(notifications)
      .filter(([_, isSelected]) => isSelected)
      .map(([notification]) => notification)
      .join(", ");

    if (!notificationMediums) {
      return;
    }

    onSubmit({
      ...data,
      threshold: formattedThreshold,
      notifications: notificationMediums,
      ...(isEditMode && editRule?.ruleId && { ruleId: editRule.ruleId }),
    });

    onClose();
  };

  useEffect(() => {
    setValue("duration", duration);
  }, [duration, setValue]);

  useEffect(() => {
    setValue("recipient", recipient);
  }, [recipient, setValue]);

  // Handle visibility and animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true); // Render the modal
      setTimeout(() => {
        setShouldSlideIn(true); // Trigger slide-in animation after mount
      }, 0);
    } else {
      setShouldSlideIn(false); // Start slide-out animation
      const timer = setTimeout(() => {
        setIsVisible(false); // Remove from DOM after animation
      }, 300); // Match duration-300
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && editRule) {
        reset({
          ruleName: editRule.ruleName,
          metric: editRule.metric,
          threshold: extractThresholdValue(editRule.threshold),
          duration: editRule.duration,
          recipient: editRule.recipient,
        });
        setDuration(editRule.duration);
        setRecipient(editRule.recipient);
        const notificationsList = editRule.notifications.split(", ");
        const notificationState = {
          SMS: notificationsList.includes("SMS"),
          "E-mail": notificationsList.some(
            (n) => n.toUpperCase() === "EMAIL" || n.toUpperCase() === "E-MAIL"
          ),
          "In-App": notificationsList.includes("In-App"),
        };
        setNotifications(notificationState);
      } else {
        reset({
          ruleName: "",
          metric: "",
          threshold: "",
          duration: "10 mins",
          recipient: "DevOps Team",
        });
        setDuration("10 mins");
        setRecipient("DevOps Team");
        setNotifications({
          SMS: false,
          "E-mail": false,
          "In-App": true,
        });
      }
    }
  }, [isOpen, reset, editRule, isEditMode]);

  if (!isVisible && !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-30" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-[520px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          shouldSlideIn ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Header with title */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {isEditMode ? "Edit Alert Rule" : "Create a new Alert Rule"}
            </h2>
            <CloseButton onClick={onClose} />
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onFormSubmit)}
            className="flex flex-col gap-4 flex-grow overflow-y-auto"
          >
            {/* Rule Name Input */}
            <div>
              <input
                {...register("ruleName", { required: "Rule name is required" })}
                type="text"
                placeholder="Rule name"
                className={`w-full p-3 border-2 ${
                  errors.ruleName ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:border-primary focus:outline-none`}
              />
              {errors.ruleName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.ruleName.message}
                </p>
              )}
            </div>

            {/* Metric and Threshold Inputs */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <input
                  {...register("metric", { required: "Metric is required" })}
                  type="text"
                  placeholder="Metric"
                  className={`w-full p-3 border-2 ${
                    errors.metric ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:border-primary focus:outline-none`}
                />
                {errors.metric && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.metric.message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <input
                  {...register("threshold", {
                    required: "Threshold is required",
                    pattern: { value: /^\d+$/, message: "Must be a number" },
                  })}
                  type="text"
                  placeholder="Threshold"
                  className={`w-full p-3 border-2 ${
                    errors.threshold ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:border-primary focus:outline-none`}
                />
                {errors.threshold && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.threshold.message}
                  </p>
                )}
              </div>
            </div>

            {/* Duration Dropdown */}
            <CustomDropdown
              value={duration}
              options={DURATIONS}
              onChange={setDuration}
              isOpen={showDurationDropdown}
              toggleOpen={() => setShowDurationDropdown(!showDurationDropdown)}
              register={register("duration")}
            />

            {/* Recipient Dropdown */}
            <CustomDropdown
              value={recipient}
              options={RECIPIENTS}
              onChange={setRecipient}
              isOpen={showRecipientDropdown}
              toggleOpen={() =>
                setShowRecipientDropdown(!showRecipientDropdown)
              }
              register={register("recipient")}
            />

            {/* Notification Medium */}
            <div className="mt-4">
              <p className="text-xl font-bold mb-4">Notification Medium</p>
              <div className="flex flex-col gap-5">
                {NOTIFICATION_OPTIONS.map((option) => (
                  <NotificationOption
                    key={option}
                    label={option}
                    isSelected={notifications[option] || false}
                    onToggle={() => toggleNotification(option)}
                  />
                ))}
              </div>
              {Object.values(notifications).every((v) => !v) && (
                <p className="text-red-500 text-sm mt-1">
                  Select at least one notification method
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-auto pt-4">
              <button
                type="submit"
                disabled={Object.values(notifications).every((v) => !v)}
                className={`w-full ${
                  Object.values(notifications).every((v) => !v)
                    ? "bg-gray-400"
                    : "bg-primary hover:bg-primary/90"
                } text-white py-3 rounded-lg font-medium`}
              >
                {isEditMode ? "Update Rule" : "Create Rule"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}