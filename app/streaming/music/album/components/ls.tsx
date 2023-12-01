import React, {useEffect, useState} from "react";
import { HttpClient } from "@/app/api";
import {AlbumData} from "@/app/types";
import {useRouter} from "next/navigation";

const AlbumList: React.FC = () => {
  const router = useRouter()
  const [albums, setAlbums] = useState<AlbumData[]>([])
  useEffect(() => {
    const token = localStorage.getItem("token")
    const client = new HttpClient();
    client.setHeaders({ Authorization: `Bearer ${token}` });
      client.get("/_streaming/v1/musics/albums").then(data => {
        console.log(data);
        if (data.message != "OK") {
          alert(`My album: ${data.message}`)
          return
        }
        setAlbums(data.albums)
      }).catch(error => {
        console.error(error);
      })
  }, []);


  return (
    <div>
      {albums?.map((i, idx) => {
        return (
          <div key={idx}>
            <h3>{i.title}</h3>
            <p>{i.description}</p>
            <pre>{i.year}</pre>
            {i.artists?.map((j, idx) => {
              return <span key={idx}>{j.name}, </span>
            })}
            <div>
              <button onClick={() => router.push(`/streaming/music/album/${i.id}`)}>go</button>
            </div>
            <hr/>
          </div>
        )
      })}
    </div>
  )
}

export default AlbumList;