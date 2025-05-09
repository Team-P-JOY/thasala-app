import { Image, type ImageSource } from "expo-image";

type Props = {
  imgSource: ImageSource;
  selectedImage?: string;
  size?: number;
};

export default function ImageViewer({
  imgSource,
  selectedImage,
  size = 120,
}: Props) {
  const imageSource =
    typeof selectedImage === "string" ? { uri: selectedImage } : imgSource;

  return (
    <Image
      source={imageSource}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
      }}
    />
  );
}
