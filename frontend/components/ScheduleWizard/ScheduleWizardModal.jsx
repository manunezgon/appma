import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useScheduleWizard } from "../../hooks/useScheduleWizard.jsx";
import Step1Mode from "./Step1Mode.jsx";
import Step2Select from "./Step2Select.jsx";
import Step3Lesson from "./Step3Lesson.jsx";
import Step4Schedule from "./Step4Schedule.jsx";
import Step5Confirm from "./Step5Confirm.jsx";
import style from "./Styles.jsx";


export default function ScheduleWizardModal({ onClose }) {
  const wizard = useScheduleWizard(onClose);
  const { step, goBack, handleClose } = wizard;

  return (
    <View style={style.container}>
      <ScrollView contentContainerStyle={style.inner}>
        <Text style={style.title}>Schedule Management</Text>

        {step === 1 && <Step1Mode {...wizard} />}
        {step === 2 && <Step2Select {...wizard} />}
        {step === 3 && <Step3Lesson {...wizard} />}
        {step === 4 && <Step4Schedule {...wizard} />}
        {step === 5 && <Step5Confirm {...wizard} />}

        <View style={style.bottomButtons}>
          {step > 1 && (
            <TouchableOpacity style={[style.button, style.backButton]} onPress={goBack}>
              <Text style={style.buttonText}>Back</Text>
            </TouchableOpacity>
          )}
          {step > 1 && (
            <TouchableOpacity
              style={[style.button, style.cancelButton]}
              onPress={handleClose}
            >
              <Text style={style.buttonText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}