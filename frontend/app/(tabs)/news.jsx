import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Image, RefreshControl, ScrollView, Text, View } from "react-native";
import AdminInput from "../../components/news/AdminInput";
import AnnouncementCard from "../../components/news/AnnouncementCard";
import CarouselEditorModal from "../../components/news/CarouselEditorModal";
import Carousel from "../../components/news/Carrousel";
import style from "../../Styles/NewsStyles";
import { useUser } from "../../context/UserContext";
import { useNewsData } from "../../hooks/useNewsData";

export default function News() {
  const { user } = useUser();
  const [showCarouselEditor, setShowCarouselEditor] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const {
    announcements,
    carouselImages,
    fetchAnnouncements,
    fetchCarouselImages,
    createAnnouncement,
    addImage,
    deleteImage,
    reorderImages,
  } = useNewsData();

  useFocusEffect(
    useCallback(() => {
      fetchAnnouncements();
      fetchCarouselImages();
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
            await fetchAnnouncements();
          }}
        />
      }
    >
      <View style={style.header}>
        <Image
          source={require("../assets/images/white_logo_nw.png")}
          style={style.logo}
        />
        <Text style={style.title}>La Forja</Text>
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
          onSend={createAnnouncement}
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
            onDeleted={fetchAnnouncements}
          />
        ))
      )}
    </ScrollView>
  );
}
