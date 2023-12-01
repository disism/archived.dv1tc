
"use client"

import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {STREAMING_APIs} from "@/app/nav";
import {PlaylistData} from "@/app/types";
import CreatePlaylist from "@/app/streaming/music/playlist/components/create";
import {HttpClient} from "@/app/api";

export default function Page() {
  const router = useRouter()


  const [playlists, setPlaylists] = useState<PlaylistData[]>()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token === null) {
      router.push("/")
      return
    }
    const client = new HttpClient()
    client.setHeaderToken(token)
    client.get("/_streaming/v1/musics/playlists").then(res => {
      setPlaylists(res.playlists)
    }).catch(error => console.log(error))
  }, [router]);
  return (

    <main>
      <h1>Music</h1>

      <button onClick={() => router.push("/streaming/music/library")}>My Music Library</button>
      <button onClick={() => router.push("/streaming/music/album")}>My Album Library</button>

      <h1>Playlist</h1>
      <CreatePlaylist />

      <h3>My Playlist</h3>
      <div>
        <ul>
          {playlists?.map((i, idx) => {
            return (
              <li key={idx}>
                <button onClick={() => router.push(`/streaming/music/playlist/${i.id}`)}><h4>{i.name}</h4></button>
              </li>
            )
          })}
        </ul>
      </div>


    </main>
  )
}
