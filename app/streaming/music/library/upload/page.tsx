
"use client"

import React, {ChangeEvent, useState} from "react";
import {MusicData} from "@/app/types";
import {createMusic, uploadFiles} from "@/app/streaming/music/api";
import {useRouter} from "next/navigation";
import MusicLS from "@/app/streaming/music/components/ls";

interface ExistMusicObject {
  name: string
  musics: MusicData[] | undefined
}

export default function Page() {
  const router = useRouter()

  const [okMusics, setOkMusics] = useState<MusicData[]>([])
  const [existsMusic, setExistsMusic] = useState<ExistMusicObject[]>([])

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {

    const token = localStorage.getItem("token");
    if (token === null) {
      router.push("/")
      return
    }
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const c = window.confirm(`Upload file`);
      if (c) {
        try {
          const createMusicArray = await uploadFiles(Array.from(selectedFiles), token as string);
          console.log(createMusicArray)
          const result = await createMusic(createMusicArray, token as string);
          console.log(result);
          if (result.message != "OK") {
            alert("Error")
            return
          } else {
            alert("Success")
          }

          setOkMusics(mp => [...mp, ...result.musics]);
          setExistsMusic(result.exists);

        } catch (error) {
          console.log('error', error);
        }
      } else {
        alert("Cancel");
      }
    }
  };



  return (
    <main>
      <div>
        <input type="file" multiple onChange={handleFileChange} />
        {existsMusic.length ? <h3>Exist</h3> : null}
        {existsMusic?.map((exist, idx) => {
          return (
            <div key={idx}>
              <h2>{exist.name}</h2>
              <MusicLS musics={exist?.musics}/>
            </div>
          )
        })}

        <h3>{okMusics?.length ? "ok" : null}</h3>
        <MusicLS musics={okMusics}/>
      </div>
    </main>
  )
}
