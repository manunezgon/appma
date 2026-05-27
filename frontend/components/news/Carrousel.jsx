import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import PagerView from "react-native-pager-view";
import style from "../../Styles/NewsStyles";
import { colors } from "../../Styles/theme";

export default function Carousel({ images, interval = 3000, onEdit, isAdmin }) {
  const pagerRef = useRef(null);
  const pageRef = useRef(0);
  const [page, setPage] = useState(0);
  const [localImages, setLocalImages] = useState(images);

  useEffect(() => {
    setLocalImages(images);
  }, [images]);

  useEffect(() => {
    if (!localImages.length) return;
    const timer = setInterval(() => {
      const nextPage = (pageRef.current + 1) % localImages.length;
      pagerRef.current?.setPage(nextPage);
      pageRef.current = nextPage;
      setPage(nextPage);
    }, interval);

    return () => clearInterval(timer);
  }, [interval, localImages.length]);

  return (
    <View style={style.carruselWrapper}>
      <View style={style.carruselContainer}>
        <PagerView
          ref={pagerRef}
          key="carousel"
          style={style.pager}
          initialPage={0}
          onPageSelected={(e) => {
            pageRef.current = e.nativeEvent.position;
            setPage(e.nativeEvent.position);
          }}
        >
          {localImages.map((img, idx) => (
            <View key={idx} style={style.page}>
              <Image
                source={{ uri: img.imageUrl }}
                style={[style.image, { opacity: img.uploading ? 0.5 : 1 }]}
              />
            </View>
          ))}
        </PagerView>
      </View>

      {isAdmin && onEdit && (
        <TouchableOpacity style={style.editButton} onPress={onEdit}>
          <Ionicons name="albums-outline" size={25} color={colors.text} />
        </TouchableOpacity>
      )}

      <View style={style.indicatorContainer}>
        {localImages.map((_, idx) => (
          <View
            key={idx}
            style={[style.indicator, { opacity: page === idx ? 1 : 0.3 }]}
          />
        ))}
      </View>
    </View>
  );
}
