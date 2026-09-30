import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useScheduleWizard } from "../../hooks/useScheduleWizard.jsx";
import { useTranslation } from "../../hooks/useTranslation";
import { createScheduleStyles } from "../../Styles/ScheduleStyles.jsx";
import { useTheme } from "../../context/ThemeContext";
import Step1Mode from "./Step1Mode.jsx";
import Step2Select from "./Step2Select.jsx";
import Step3Lesson from "./Step3Lesson.jsx";
import Step4Schedule from "./Step4Schedule.jsx";
import Step5Confirm from "./Step5Confirm.jsx";

export default function ScheduleWizardModal({ onClose }) {
  const wizard = useScheduleWizard(onClose);
  const { t } = useTranslation();
  const { colors } = useTheme();
  const style = createScheduleStyles(colors);

  const { step, goBack, handleClose } = wizard;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={style.container}>
        <ScrollView
          contentContainerStyle={style.inner}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={style.title}>{t("scheduleManagement.title")}</Text>
          {step === 1 && <Step1Mode {...wizard} />}
          {step === 2 && <Step2Select {...wizard} />}
          {step === 3 && <Step3Lesson {...wizard} />}
          {step === 4 && <Step4Schedule {...wizard} />}
          {step === 5 && <Step5Confirm {...wizard} />}
          <View style={style.bottomButtons}>
            {step > 1 && (
              <TouchableOpacity
                style={[style.button, style.backButton]}
                onPress={goBack}
              >
                <Text style={style.buttonText}>
                  {t("scheduleManagement.back")}
                </Text>
              </TouchableOpacity>
            )}
            {step > 1 && (
              <TouchableOpacity
                style={[style.button, style.cancelButton]}
                onPress={handleClose}
              >
                <Text style={style.buttonText}>
                  {t("scheduleManagement.cancel")}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
