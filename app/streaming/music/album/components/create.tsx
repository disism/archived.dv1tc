import React, { useState } from "react";
import NumericInput from "@/app/components/input";
import AddArtist from "@/app/streaming/music/components/artist";
import { HttpClient } from "@/app/api";
import { MusicArtistData } from "@/app/types";

const AlbumCreation: React.FC = () => {

  const [title, setTitle] = useState("");
  const [year, setYear] = useState(1988);
  const [description, setDescription] = useState(
    "К"
  );

  const [artists, setArtists] = useState<MusicArtistData[]>([]);

  const handleValueChange = (newValue: number) => {
    setYear(newValue);
  };

  const create = async () => {
    const token = localStorage.getItem("token")
    const c = confirm(`Create ${title} ?`)
    if (!c) {
      alert("Cancel")
      return
    }
    const client = new HttpClient();
    client.setHeaders({ Authorization: `Bearer ${token}` });
    const a: string[] = []
    artists.map(i => {
      a.push(i.id)
    })
    console.log(a)
    const raw = {
      title: title,
      year: year,
      description: description,
      artist_ids: a,
    };

    try {
      const data = await client.post("/_streaming/v1/musics/albums", raw);
      console.log(data);
      if (data.message != "OK") {
        alert(`Error: ${data.message}`)
        return
      } else {
        alert(`Create Album ${title} Success`)
        location.reload()
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlerAddArtist = (artist: MusicArtistData) => {
    setArtists([...artists, artist]);
  };

  const removeArtist = (index: number) => {
    const updatedArtists = artists.filter((_, idx) => idx !== index);
    setArtists(updatedArtists);
  };

  return (
    <main>
      <h2>Create</h2>
      <div>
        <span>Name:</span>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>
      <div>
        <span>Desc:</span>
        <input
          type="text"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>
      <div>
        <span>Year: </span>
        <NumericInput value={year} onChange={handleValueChange} />
      </div>
      <div>
        <span>Artist: </span>
        {artists?.map((artist, idx) => (
          <span key={idx}>
            {artist.name} <button onClick={() => removeArtist(idx)}>Remove</button>
          </span>
        ))}
        <AddArtist onAddArtist={handlerAddArtist} />
      </div>
      <button onClick={create}>Create</button>
    </main>
  );
};

export default AlbumCreation;