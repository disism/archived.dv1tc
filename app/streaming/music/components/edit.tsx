import React, {useState} from 'react';
import {MusicArtistData, MusicData, MusicGenreData} from "@/app/types";
import {HttpClient} from "@/app/api";
import {useRouter} from "next/navigation";
import AddArtist from "@/app/streaming/music/components/artist";
import AddGenre from "@/app/streaming/music/components/genre";

interface MusicEditProps {
  music: MusicData| undefined;
}

interface EditObject {
  name?: string;
  description?: string;
  album_id?: number;
  artist_ids?: string[];
  genre_ids?: string[];
}

function arraysAreEqual(arr1: any[], arr2: any[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}

const MusicEdit: React.FC<MusicEditProps> = ({music}) => {
  const router = useRouter()
  if (music == undefined) {
    router.back()
  }
  const [editedName, setEditedName] = useState(music?.name);
  const [editedDescription, setEditedDescription] = useState(music?.description);
  const [artists, setArtists] = useState<MusicArtistData[]>(music?.artists || []);
  const [genres, setGenres] = useState<MusicGenreData[]>(music?.genres || []);

  const submitEdit = () => {
    const raw: EditObject = {}
    if (editedName != music?.name) {
      raw.name = editedName
    }
    if (editedDescription != music?.description) {
      raw.description = editedDescription
    }
    if (artists.length != 0) {
      const eq = arraysAreEqual(artists, music?.artists as any[])
      if (!eq) {
        raw.artist_ids = artists.map(i => i.id)
      }
    }
    if (artists.length == 0 && music?.artists?.length != 0) {
      raw.artist_ids = [""]
    }

    if (genres.length != 0) {
      const eq = arraysAreEqual(genres, music?.genres as any[])
      if (!eq) {
        raw.genre_ids = genres.map(i => i.id)
      }
    }

    if (genres.length == 0 && music?.genres?.length != 0) {
      raw.genre_ids = [""]
    }
    console.log(raw)

    const token = localStorage.getItem("token")
    if (token == null) {
      router.push("/")
      return
    }
    const client = new HttpClient()
    client.setHeaderToken(token);
    client.put(`/_streaming/v1/musics/${music?.id}`, raw).then((res) => {
      console.log(res);
      if (res.message == "OK") {
        alert(`Update ${editedName} Success`)
      }
    }).catch(error => {
      console.log(error)
    })
  };


  const removeArtist = (idx: number) => {
    setArtists(prevArtists => {
      const updatedArtists = [...prevArtists];
      updatedArtists.splice(idx, 1);
      return updatedArtists;
    });
  };

  const removeGenre = (idx: number) => {
    setGenres(prevGenres => {
      const updatedGenres = [...prevGenres];
      updatedGenres.splice(idx, 1);
      return updatedGenres;
    });
  };


  const handlerAddArtist = (artist: MusicArtistData) => {
    setArtists((prevArtists) => [...prevArtists, artist]);
  };

  const handlerAddGenre = (genre: MusicGenreData) => {
    setGenres((prevGenres) => [...prevGenres, genre]);
  }

  return (
    <div>
      <h1>Edit</h1>
      <div>
        <span>Music Name: </span>
        <input
          type="text"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
        />
      </div>
      <div>
        <span>Desc:</span>
        <input
          type="text"
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
        />
      </div>
      <div>
        <span>Album:</span>
      </div>
      <div>
        <div>
          <p>Artists</p>
          {artists?.map((artist, idx) => (
            <span key={idx}>
              {artist.name} <button onClick={() => removeArtist(idx)}>Remove</button>
            </span>
          ))}
        </div>
        <div>
          <span>Add</span>
          <AddArtist onAddArtist={handlerAddArtist} />
        </div>
      </div>

      <div>
        <div>
          <p>Genre</p>
          {genres?.map((genre, idx) => (
            <span key={idx}>
              {genre.name} <button onClick={() => removeGenre(idx)}>Remove</button>
            </span>
          ))}
        </div>
        <div>
          <span>Add Gnere</span>
          <AddGenre onAddGenre={handlerAddGenre} />
        </div>
      </div>

      <div>
        <button onClick={() => submitEdit()}>Submit</button>
      </div>
    </div>
  );
};

export default MusicEdit