import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import { TouchableOpacity, View } from "react-native";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import style from "../../Styles/NewsStyles";
import { colors } from "../../Styles/theme";

const hasContent = (html) => {
  if (!html) return false;

  const text = html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();

  return text.length > 0;
};

export default function AdminInput({ value, onChange, onSend }) {
  const editorRef = useRef(null);

  const handleChange = (html) => {
    onChange(html);
  };

  const handleSend = () => {
    if (!hasContent(value)) return;

    onSend(value);
    editorRef.current?.setContentHTML("");
  };

  const canSend = hasContent(value);

  return (
    <View style={style.inputContainer}>
      {/* Editor */}
      <View style={style.editorContainer}>
        <RichEditor
          ref={editorRef}
          style={style.richEditor}
          initialContentHTML={value}
          placeholder="Share a message..."
          onChange={handleChange}
          editorStyle={{
            backgroundColor: colors.surface,
            color: colors.text,
            placeholderColor: colors.textSubtle,
            cssText: `
              body {
                font-size: 16px;
                padding: 0;
                margin: 0;
              }

              p {
                margin: 0 0 8px 0;
              }
            `,
          }}
        />
      </View>

      {/* Toolbar + enviar */}
      <View style={style.editorActions}>
        <RichToolbar
          editor={editorRef}
          actions={[
            actions.setBold,
            actions.setItalic,
            actions.setUnderline,
            actions.insertBulletsList,
            actions.insertOrderedList,
          ]}
          iconTint={colors.textMuted}
          selectedIconTint={colors.primary}
          style={style.richToolbar}
        />

        <TouchableOpacity
          onPress={handleSend}
          disabled={!canSend}
          style={[
            style.sendButton,
            {
              opacity: canSend ? 1 : 0.4,
            },
          ]}
        >
          <Ionicons
            name="megaphone-outline"
            size={28}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

