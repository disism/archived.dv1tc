"use client"

import React, {useEffect, useState} from "react";
import {STREAMING_APIs} from "@/app/nav";
import {MusicData, PlaylistData} from "@/app/types";
import {handleResult} from "@/app/errors";
import EditPlaylist from "@/app/streaming/music/playlist/components/edit";
import {formatDuration} from "@/app/duration";
import {GetPreviewLink, IPFS_GATEWAY} from "@/app/ipfs";

export default function Page({ params }: { params: { slug: string } }) {
  const { MUSIC } = STREAMING_APIs

  const [playlist, setPlaylist] = useState<PlaylistData>()
  const [musics, setMusics] = useState<MusicData[]>()
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions: RequestInit = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(`${MUSIC}/playlists/${params.slug}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        if (result.code !== undefined) {
          handleResult(result);
          return;
        }
        setPlaylist(result.playlist)
        setMusics(result.musics)
      })
      .catch(error => console.log('error', error));
  }, [MUSIC, params.slug]);

  const removeMusicFromPlaylist = (id: string) => {
    const c = confirm("remove?")
    if (c) {
      const token = localStorage.getItem("token");
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const raw = JSON.stringify({
        "music_ids": [
          id
        ]
      });

      const requestOptions: RequestInit = {
        method: 'DELETE',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch(`${MUSIC}/playlists/${params.slug}/musics`, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result)
          if (result.message === "OK") {
            alert("success")
            location.reload()
          }
        })
        .catch(error => console.log('error', error));
    } else {
      alert("Cancel")
      return
    }
  }

  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const [isEditor, setIsEditor] = useState(false)
  return (
    <main>
      <h1>{playlist?.name}</h1>
      <p>{playlist?.description}</p>
      <pre>{playlist?.private ? "private" : "public"}</pre>
      <button onClick={() => setIsEditor(true)}>Edit</button>
      {isEditor ? <EditPlaylist id={params.slug} isEditor={setIsEditor} /> : null}
      <hr/>
      <ul>
      {musics?.map((i, idx) => {
        return (
          <li key={idx}>
            <p>
              {i.name} - {formatDuration(i.duration)}
              <button onClick={handlePlay}>Play</button>
              <button onClick={handlePause}>Stop</button>
              {/*{isPlaying && <audio src={`https://${i.file?.cid}.${IPFS_GATEWAY}/${i.file?.name}`} autoPlay />}*/}
              {isPlaying && <audio src={GetPreviewLink(i.file?.cid as string, i.file?.name as string)} autoPlay />}
              <button onClick={() => removeMusicFromPlaylist(i.id)}>Remove From Playlist</button>
            </p>
          </li>
        )
      })}
      </ul>
    </main>
  )
}
