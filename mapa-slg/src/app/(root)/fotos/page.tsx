"use client";
import { Image } from "@heroui/react";

export default function PhotosGallery() {
  const prefix = "galeria/";
  const photos = [
    "1.jpeg",
    "2.jpeg",
    "3.jpeg",
    "4.jpeg",
    "5.jpeg",
    "6.jpeg",
    "7.jpeg",
    "8.jpeg",
    "9.jpeg",
    "10.jpeg",
    "11.jpeg",
    "12.jpeg",
    "13.jpeg",
    "14.jpeg",
    "15.jpeg",
    "16.jpeg",
    "17.jpeg",
    "18.jpeg",
    "19.jpeg",
    "20.jpeg",
    "21.jpeg",
    "22.jpeg",
    "23.jpeg",
    "24.jpeg",
    "25.jpeg",
    "26.jpeg",
    "27.jpeg",
  ].map((fileName) => prefix + fileName);
  const twoArraysOfPhotos = [
    photos.slice(0, Math.floor(photos.length / 2)),
    photos.slice(Math.floor(photos.length / 2)),
  ];
  return (
    <main className="!grid grid-cols-1 lg:grid-cols-2 overflow-y-auto h-screen content-start bg-black -mt-28 pt-28 px-4 lg:px-12 gap-2 pb-28 ">
      <div className="flex flex-col w-full gap-2 justify-start self-start">
        {twoArraysOfPhotos[0].map((photo, index) => (
          <Image
            alt="Foto Colegio San Luis Gonzaga"
            src={photo}
            key={index}
            removeWrapper
            className="w-full object-contain"
            radius="sm"
            loading="lazy"
          />
        ))}
      </div>
      <div className="flex flex-col w-full gap-2 justify-start self-start">
        {twoArraysOfPhotos[1].map((photo, index) => (
          <Image
            alt="Foto Colegio San Luis Gonzaga"
            src={photo}
            key={index + twoArraysOfPhotos[0].length}
            removeWrapper
            className="w-full object-contain"
            radius="sm"
            loading="lazy"
          />
        ))}
      </div>
    </main>
  );
}
