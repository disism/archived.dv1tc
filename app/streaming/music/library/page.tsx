
"use client"

import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {MusicData} from "@/app/types";
import {HttpClient} from "@/app/api";
import MusicLS from "@/app/streaming/music/components/ls";

export default function Page() {

  const router = useRouter()

  const [musics, setMusics]= useState<MusicData[]>([])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/")
      return
    }
    const client = new HttpClient()
    client.setHeaderToken(token)
    client.get("/_streaming/v1/musics").then(res => {
      setMusics(res.musics)
    }).catch(error => console.log(error))
  }, [router]);


  return (
    <main>
      <h1>Muiscs</h1>
      <button onClick={() => router.push("/streaming/music/library/upload")}>Upload</button>
      <h2>My Music</h2>
      <MusicLS musics={musics} showAddMusic={false} showRemoveMusic={true} showAddToPlaylist={true}/>
    </main>
  )
}
