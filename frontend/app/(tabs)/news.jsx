import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Image, RefreshControl, ScrollView, Text, View } from "react-native";
import AdminInput from "../../components/news/AdminInput";
import AnnouncementCard from "../../components/news/AnnouncementCard";
import CarouselEditorModal from "../../components/news/CarouselEditorModal";
import Carousel from "../../components/news/Carrousel";
import style from "../../components/news/Styles";
import { useUser } from "../../context/UserContext";
import { API_BASE_URL } from "../config";

export default function News() {
  const { user } = useUser();
  const [announcements, setAnnouncements] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [showCarouselEditor, setShowCarouselEditor] = useState(false);

  const images = [
    require("../assets/carrousel/img1.jpg"),
    require("../assets/carrousel/img2.jpg"),
    require("../assets/carrousel/img3.jpg"),
    require("../assets/carrousel/img4.jpg"),
  ];

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/announcements`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (!res.ok) return setAnnouncements([]);
      const data = await res.json();
      setAnnouncements(
        Array.isArray(data)
          ? [...data].sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
            )
          : [],
      );
    } catch (err) {
      console.error(err);
      setAnnouncements([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAnnouncements();
    }, [user]),
  );

  const createAnnouncement = async () => {
    if (!newMessage.trim()) return;
    try {
      await fetch(
        `${API_BASE_URL}/announcements?message=${encodeURIComponent(newMessage)}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${user?.token}` },
        },
      );
      setNewMessage("");
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAnnouncements();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={style.container}
      contentContainerStyle={style.inner}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={style.header}>
        <Image
          source={require("../assets/images/white_logo_nw.png")}
          style={style.logo}
        />
        <Text style={style.title}>La Forja</Text>
      </View>

      <Carousel
        images={images}
        interval={3000}
        isAdmin={user?.role === "ADMIN"}
        onEdit={() => setShowCarouselEditor(true)}
      />

      <CarouselEditorModal
        visible={showCarouselEditor}
        onClose={() => setShowCarouselEditor(false)}
        images={images}
        onAdd={() => console.log("Añadir foto")}
        onDelete={(idx) => console.log("Borrar foto", idx)}
      />

      <Text style={style.subtitle}>Noticias</Text>

      {user?.role === "ADMIN" && (
        <AdminInput
          value={newMessage}
          onChange={setNewMessage}
          onSend={createAnnouncement}
        />
      )}

      {/* Listado de anuncios */}
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
