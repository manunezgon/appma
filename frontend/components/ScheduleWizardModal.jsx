import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useScheduleWizard } from "../hooks/useScheduleWizard";
import Step1Mode from "./ScheduleWizard/Step1Mode.jsx";
import Step2Select from "./ScheduleWizard/Step2Select.jsx";
import Step3Lesson from "./ScheduleWizard/Step3Lesson.jsx";
import Step4Schedule from "./ScheduleWizard/Step4Schedule.jsx";
import Step5Confirm from "./ScheduleWizard/Step5Confirm.jsx";

/**
 * Main Wizard Modal for managing lessons and schedules.
 * Handles the flow from step 1 to 5, rendering the corresponding step component.
 */
export default function ScheduleWizardModal({ onClose }) {
  const wizard = useScheduleWizard(onClose);
  const { step, goBack, handleClose } = wizard;
  const totalSteps = 5;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner}>
        {/* --- Wizard Title & Step Indicator --- */}
        <Text style={styles.title}>Schedule Management</Text>
        <Text style={styles.stepIndicator}>
          Step {step} of {totalSteps}
        </Text>

        {/* --- Render the current step component --- */}
        {step === 1 && <Step1Mode {...wizard} />}
        {step === 2 && <Step2Select {...wizard} />}
        {step === 3 && <Step3Lesson {...wizard} />}
        {step === 4 && <Step4Schedule {...wizard} />}
        {step === 5 && <Step5Confirm {...wizard} />}

        {/* --- Navigation Buttons: Back / Cancel --- */}
        <View style={styles.bottomButtons}>
          {step > 1 && (
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          )}
          {step > 1 && (
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#bb0000", // Dark red background
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  inner: {
    paddingBottom: 50, // Bottom padding for scrollable content
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff",
  },
  stepIndicator: {
    marginBottom: 15,
    color: "#fff",
  },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  backButton: {
    flex: 1,
    marginRight: 5,
    backgroundColor: "#757575",
    padding: 10,
    borderRadius: 8,
  },
  cancelButton: {
    flex: 1,
    marginLeft: 5,
    backgroundColor: "#E53935",
    padding: 10,
    borderRadius: 8,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#1976D2",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});