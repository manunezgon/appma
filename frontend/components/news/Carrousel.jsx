import { useEffect, useRef, useState } from "react";
import { Image, View } from "react-native";
import PagerView from "react-native-pager-view";
import style from "./Styles";

export default function Carousel({ images, interval = 3000 }) {
  const pagerRef = useRef(null);
  const pageRef = useRef(0);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextPage =
        pageRef.current + 1 >= images.length ? 0 : pageRef.current + 1;
      pagerRef.current?.setPage(nextPage);
      pageRef.current = nextPage;
      setPage(nextPage);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <View>
      <View style={style.carruselContainer}>
        <PagerView
          ref={pagerRef}
          style={style.pager}
          initialPage={0}
          onPageSelected={(e) => {
            pageRef.current = e.nativeEvent.position;
            setPage(e.nativeEvent.position);
          }}
        >
          {images.map((img, idx) => (
            <View key={idx} style={style.page}>
              <Image source={img} style={style.image} />
            </View>
          ))}
        </PagerView>
      </View>

      <View style={style.indicatorContainer}>
        {images.map((_, idx) => (
          <View
            key={idx}
            style={[style.indicator, { opacity: page === idx ? 1 : 0.3 }]}
          />
        ))}
      </View>
    </View>
  );
}
