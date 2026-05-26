import { useState } from "react";

export default function useEnrollmentActions({
  enrollUser,
  selectedDay,
  refreshDayData,
}) {
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const closeErrorModal = () => {
    setErrorModalVisible(false);
    setErrorMessage("");
  };

  const handleEnroll = async (scheduleId, isException = false) => {
    try {
      await enrollUser(
        isException ? null : scheduleId,
        selectedDay,
        isException ? scheduleId : null,
      );

      await refreshDayData();
    } catch (err) {
      const message = err?.message || "Error enrolling";

      if (message.toLowerCase().includes("already enrolled")) {
        return;
      }

      setErrorMessage(message);

      setErrorModalVisible(true);
    }
  };

  return {
    handleEnroll,

    errorModalVisible,
    errorMessage,

    closeErrorModal,
  };
}
