import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useRef, useState } from "react";
import { Image, RefreshControl, ScrollView, Text, View } from "react-native";
import AdminInput from "../../components/news/AdminInput";
import AnnouncementCard from "../../components/news/AnnouncementCard";
import CarouselEditorModal from "../../components/news/CarouselEditorModal";
import Carousel from "../../components/news/Carrousel";
import { useUser } from "../../context/UserContext";
import { useNewsData } from "../../hooks/useNewsData";
import style from "../../Styles/NewsStyles";

export default function News() {
  const { user } = useUser();
  const [showCarouselEditor, setShowCarouselEditor] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const {
    announcements,
    carouselImages,
    fetchAnnouncements,
    deleteAnnouncement,
    fetchCarouselImages,
    addImage,
    deleteImage,
    reorderImages,
    createAnnouncement,
  } = useNewsData();

  const handleSend = async (text) => {
    await createAnnouncement(text);
    setNewMessage("");
  };
  const lastNewsFocusFetchAt = useRef(0);
  const NEWS_FOCUS_MIN_MS = 60_000;

  useFocusEffect(
    useCallback(() => {
      const now = Date.now();
      if (now - lastNewsFocusFetchAt.current < NEWS_FOCUS_MIN_MS) return;
      lastNewsFocusFetchAt.current = now;
      void Promise.all([fetchAnnouncements(), fetchCarouselImages()]);
    }, [fetchAnnouncements, fetchCarouselImages]),
  );

  return (
    <ScrollView
      style={style.container}
      contentContainerStyle={style.inner}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={async () => {
            await Promise.all([fetchAnnouncements(), fetchCarouselImages()]);
          }}
        />
      }
    >
      <View style={style.header}>
        <Image
          source={require("../assets/images/white_logo.png")}
          style={style.logo}
        />
      </View>

      <Carousel
        images={carouselImages}
        interval={3000}
        isAdmin={user?.role === "ADMIN"}
        onEdit={() => setShowCarouselEditor(true)}
      />

      <CarouselEditorModal
        visible={showCarouselEditor}
        onClose={() => setShowCarouselEditor(false)}
        images={carouselImages}
        onAdd={addImage}
        onDelete={(idx) => deleteImage(carouselImages[idx].id)}
        onReorder={reorderImages}
      />

      <Text style={style.subtitle}>News</Text>

      {user?.role === "ADMIN" && (
        <AdminInput
          value={newMessage}
          onChange={setNewMessage}
          onSend={handleSend}
        />
      )}

      {announcements.length === 0 ? (
        <View style={style.newsContainer}>
          <Text style={style.text}>No hay noticias por ahora</Text>
        </View>
      ) : (
        announcements.map((item) => (
          <AnnouncementCard
            key={item.id}
            announcement={item}
            onDelete={() => deleteAnnouncement(item.id)}
            onDeleted={fetchAnnouncements}
          />
        ))
      )}
    </ScrollView>
  );
}
