import React, { useState, ChangeEvent, KeyboardEvent } from 'react';
import {HttpClient} from "@/app/api";
import {useRouter} from "next/navigation";

interface MusicArtistData {
  id: string;
  name: string;
}

interface AddArtistProps {
  onAddArtist: (artist: MusicArtistData) => void;
}

const AddArtist: React.FC<AddArtistProps> = ({ onAddArtist }) => {
  const router = useRouter()
  const [addArtistValue, setAddArtistValue] = useState('');
  const [searchArtists, setSearchArtists] = useState<MusicArtistData[]>([]);
  const [showCreateArtistButton, setShowCreateArtistButton] = useState(false)
  const [createArtistValue, setCreateArtistValue] = useState("")

  const handleAddArtistInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAddArtistValue(event.target.value);
    setShowCreateArtistButton(false)
  };

  const handleArtistKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (addArtistValue === "") {
        alert("input")
        return;
      }
      const client = new HttpClient()
      const token = localStorage.getItem("token")
      if (token == null) {
        router.push("/")
        return
      }
      client.setHeaderToken(token)
      client.get(`/_streaming/v1/musics/artists?name=${addArtistValue}`).then(res => {
        setSearchArtists(res.artists);
      }).catch(error => {
        console.log(error)
      })
      setShowCreateArtistButton(true)
      setCreateArtistValue(addArtistValue)
      setAddArtistValue("")
    }
  }

  const handleAddArtist = (artist: MusicArtistData) => {
    onAddArtist(artist);
    setAddArtistValue('');
    setSearchArtists([]);
  };

  const handleCreateArtist = () => {
    const c = confirm(`Create Artist: ${createArtistValue} ?`)
    if (c) {
      const token = localStorage.getItem("token")
      if (token == null) {
        router.push("/")
        return
      }
      const client = new HttpClient()
      client.setHeaderToken(token);
      const raw = {
        "artists": [createArtistValue]
      }
      client.post(`/_streaming/v1/musics/artists`, raw).then((res) => {
        console.log(res);
        if (res.message == "OK") {
          alert(`Create artist ${createArtistValue} Success`)
          onAddArtist(res.artists[0]);
        }
      }).catch(error => {
        console.log(error)
      })
    } else {
      alert("Cancel")
    }
    setAddArtistValue('');
    setSearchArtists([]);
  };


  return (
    <div>
      <input
        type="text"
        value={addArtistValue}
        onChange={handleAddArtistInputChange}
        onKeyDown={handleArtistKeyPress}
      />

      <div>
        <ul>
          {searchArtists.map((artist, idx) => (
            <li key={idx}>
              {artist.name}
              <button onClick={() => handleAddArtist(artist)}>Add</button>
            </li>
          ))}
        </ul>
        {showCreateArtistButton && (
          <div>
            No Artist?
            <button onClick={handleCreateArtist}>{`Create [ ${createArtistValue} ]`}</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddArtist;