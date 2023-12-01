import React, {ChangeEvent, useState} from 'react';
import {MusicData, PlaylistData} from '@/app/types';
import {formatDuration} from "@/app/duration";
import {useRouter} from "next/navigation";
import MusicEdit from "@/app/streaming/music/components/edit";
import {HttpClient} from "@/app/api";

interface MusicListProps {
  musics: MusicData[] | undefined,
  showAddMusic?: boolean
  showRemoveMusic?: boolean
  showAddToPlaylist?: boolean
}

const MusicLS: React.FC<MusicListProps> = ({
                                             musics,
                                             showAddMusic = true,
                                             showRemoveMusic = false,
                                             showAddToPlaylist = false
}) => {

  const router = useRouter()
  const [isEdit, setIsEdit] = useState(true);
  const [editedId, setEditedId] = useState("");


  const edit = (data: MusicData) => {
    setEditedId(data.id);
    setIsEdit(true);
  };

  const cancelEdit = () => {
    setIsEdit(false);
  }

  const addMusic = (id: string) => {
    const token = localStorage.getItem("token")
    if (token == null) {
      router.push("/")
      return
    }
    const c = confirm("Add to my music library")
    if (c) {
      const client = new HttpClient()
      client.setHeaderToken(token)
      client.post(`/_streaming/v1/musics/${id}`, {}).then(res => {
        console.log(res)
        if (res.message == "OK") {
          alert("Success")
        }
      }).catch(error => {
        console.log(error)
      })
    }
  }

  const remove = (id: string) => {
    const token = localStorage.getItem("token")
    if (token == null) {
      router.push("/")
      return
    }
    const c = confirm("Remove Music?")
    if (c) {
      const client = new HttpClient()
      client.setHeaderToken(token)
      client.delete(`/_streaming/v1/musics/${id}`, {}).then(res => {
        console.log(res)
        if (res.message == "OK") {
          alert("Success")
        }
      }).catch(error => {
        console.log(error)
      })
    }
  }


  const [selectedValue, setSelectedValue] = useState<string>("");
  const [playlists, setPlaylists] = useState<PlaylistData[]>()
  const selectPlaylist = () => {
    const token = localStorage.getItem("token")
    if (token === null) {
      router.push("/")
      return
    }
    const url = "/_streaming/v1/musics/playlists"

    const client = new HttpClient()
    client.setHeaderToken(token)
    client.get(url).then(res => {
      setPlaylists(res.playlists)
    }).catch(error => console.log(error))

  }
  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const v = JSON.parse(event.target.value)
    setSelectedValue(v.pid)
    const c = window.confirm(`Add to ${v.name} ?`)
    if (c) {
      addToPlaylist(v.pid, v.mid)
    } else {
      alert("Cancel")
    }
  };

  const addToPlaylist = (pid: string, mid: string) => {
    const token = localStorage.getItem("token")
    if (token === null) {
      router.push("/")
      return
    }
    const client = new HttpClient()
    client.setHeaderToken(token)
    const raw = {
      "music_ids": [mid]
    }
    client.post(`/_streaming/v1/musics/playlists/${pid}/musics`, raw).then(res => {
      if (res.message == "OK") {
        alert("Add Success")
        setSelectedValue("")
      }
    }).catch(error => console.log(error))
  }

  return (
    <div>
      {musics?.map((i, idx) => {
        return (
          <div key={idx}>
            {isEdit && editedId === i.id ? (
              <div>
                <MusicEdit music={i} />
                <div>
                  <button onClick={() => cancelEdit()}>Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                <MusicContainer music={i} />
                <button onClick={() => edit(i)}>Edit</button>
                {showAddMusic && <button onClick={() => addMusic(i.id)}>Add to my music library</button>}
                {showRemoveMusic && <button onClick={() => remove(i.id)}>Delete</button>}
                {showAddToPlaylist && <div>
                    <span>Add To Playlist</span>
                    <select onFocus={selectPlaylist} value={selectedValue} onChange={handleSelectChange}>
                        <option value="" disabled>Music add to playlist</option>
                        {playlists?.map((p, idx) => {
                          return (
                            <option key={idx} value={JSON.stringify({pid: p.id, name: p.name, mid: i.id})}>{p.name}</option>
                          )
                        })}
                    </select>
                </div>}
              </div>
            )
            }
          </div>
        )
      })}
    </div>
  );
};

export default MusicLS

const MusicContainer: React.FC<{ music: MusicData }> = ({ music }) => {
  return (
    <div>
      <hr/>
      <pre>{music.file?.cid}</pre>
      <pre>{music.id}</pre>
      <h2>{music.name}</h2>
      <pre>{music.description}</pre>
      <h6>{formatDuration(music.duration)}</h6>
      <div>
        {music.artists?.map((artist, idx) => (
          <span key={idx}>
            {artist.name} ,{' '}
          </span>
        ))}
      </div>
      <div>
        {music.genres?.map((genres, idx) => (
          <span key={idx}>
            {genres.name} ,{' '}
          </span>
        ))}
      </div>
    </div>
  )
}