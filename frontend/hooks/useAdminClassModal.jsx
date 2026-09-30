import { useState } from "react";
import { useTranslation } from "../hooks/useTranslation";

export default function useAdminClassModal({
  createLessonException,
  createCustomException,
}) {
  const { t } = useTranslation();

  const [visible, setVisible] = useState(false);

  const [createMode, setCreateMode] = useState(null);

  const [selectedLessonId, setSelectedLessonId] = useState(null);

  const [newStartTime, setNewStartTime] = useState("");

  const [newEndTime, setNewEndTime] = useState("");

  const [newDescription, setNewDescription] = useState("");

  const openModal = () => {
    setVisible(true);
  };

  const resetState = () => {
    setCreateMode(null);

    setSelectedLessonId(null);

    setNewStartTime("");

    setNewEndTime("");

    setNewDescription("");
  };

  const closeModal = () => {
    setVisible(false);

    resetState();
  };

  const handleCreateExisting = async () => {
    await createLessonException({
      lessonId: selectedLessonId,
      startTime: newStartTime,
      endTime: newEndTime,
    });

    closeModal();
  };

  const handleCreateNew = async () => {
    if (!newDescription || !newStartTime || !newEndTime) {
      alert(t("adminClassModal.requiredFields"));
      return;
    }

    await createCustomException({
      description: newDescription,
      startTime: newStartTime,
      endTime: newEndTime,
    });

    closeModal();
  };

  return {
    visible,
    createMode,

    selectedLessonId,
    newStartTime,
    newEndTime,
    newDescription,

    setCreateMode,
    setSelectedLessonId,
    setNewStartTime,
    setNewEndTime,
    setNewDescription,

    openModal,
    closeModal,

    handleCreateExisting,
    handleCreateNew,
  };
}
