
"use client"

import React, {useEffect, useState} from "react";
import {HttpClient} from "@/app/api";
import {useRouter} from "next/navigation";
import {AlbumData} from "@/app/types";
import AlbumEdit from "@/app/streaming/music/album/components/edit";

export default function Page({ params }: { params: { slug: string } }) {
  const router = useRouter()

  const [album, setAlbum] = useState<AlbumData>()
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const client = new HttpClient()
    const token = localStorage.getItem("token")
    if (token == null) {
      router.push("/")
      return
    }
    client.setHeaderToken(token)
    client.get(`/_streaming/v1/musics/albums/${params.slug}`).then(res => {
      if (res.message == "OK") {
        setAlbum(res.album)
      }
    }).catch(error => {
      console.log(error)
    })
  }, [params.slug, router]);



  return (
    <main>
      <div>
        <h1>{album?.title}</h1>
        <p>{album?.description}</p>
        <pre>{album?.year}</pre>
        {album?.artists?.map((i, idx) => {
          return (
            <span key={idx}>{i.name} , {' '}</span>
          )
        })}
        <div>
          <button onClick={() => setIsEdit(true)}>Edit</button>
        </div>
      </div>
      <div>
        {isEdit && (
          <div>
            <AlbumEdit album={album} />
            <button onClick={() => setIsEdit(false)}>Cancel</button>
          </div>
        )}
      </div>

    </main>
  )
}
