import React, { useState, ChangeEvent, KeyboardEvent } from 'react';
import {HttpClient} from "@/app/api";
import {useRouter} from "next/navigation";

interface MusicGenreData {
  id: string;
  name: string;
}

interface AddGenreProps {
  onAddGenre: (genre: MusicGenreData) => void;
}

const AddGenre: React.FC<AddGenreProps> = ({ onAddGenre }) => {
  const router = useRouter()
  const [addGenreValue, setAddGenreValue] = useState('');
  const [searchGenres, setSearchGenres] = useState<MusicGenreData[]>([]);
  const [showCreateGenreButton, setShowCreateGenreButton] = useState(false)
  const [createGenreValue, setCreateGenreValue] = useState("")

  const handleAddGenreInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAddGenreValue(event.target.value);
    setShowCreateGenreButton(false)
  };

  const handleGenreKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (addGenreValue === "") {
        alert("input ")
        return;
      }
      const client = new HttpClient()
      const token = localStorage.getItem("token")
      if (token == null) {
        router.push("/")
        return
      }
      client.setHeaderToken(token)
      client.get(`/_streaming/v1/musics/genres?name=${addGenreValue}`).then(res => {
        setSearchGenres(res.genres);
      }).catch(error => {
        console.log(error)
      })
      setShowCreateGenreButton(true)
      setCreateGenreValue(addGenreValue)
      setAddGenreValue("")
    }
  }

  const handleAddGenre = (genre: MusicGenreData) => {
    onAddGenre(genre);
    setAddGenreValue('');
    setSearchGenres([]);
  };

  const handleCreateGenre = () => {
    const c = confirm(`Create genre: ${createGenreValue} ?`)
    if (c) {
      const token = localStorage.getItem("token")
      if (token == null) {
        router.push("/")
        return
      }
      const client = new HttpClient()
      client.setHeaderToken(token);
      const raw = {
        "genres": [createGenreValue]
      }
      client.post(`/_streaming/v1/musics/genres`, raw).then((res) => {
        console.log(res);
        if (res.message == "OK") {
          alert(`Cerate ${createGenreValue} Success`)
          onAddGenre(res.genres[0]);
        }
      }).catch(error => {
        console.log(error)
      })
    } else {
      alert("Cancel")
    }
    setAddGenreValue('');
    setSearchGenres([]);
  };


  return (
    <div>
      <input
        type="text"
        value={addGenreValue}
        onChange={handleAddGenreInputChange}
        onKeyDown={handleGenreKeyPress}
      />

      <div>
        <ul>
          {searchGenres.map((genre, idx) => (
            <li key={idx}>
              {genre.name}
              <button onClick={() => handleAddGenre(genre)}>Add</button>
            </li>
          ))}
        </ul>
        {showCreateGenreButton && (
          <div>
            No Genres?
            <button onClick={handleCreateGenre}>{`Create ${createGenreValue}`}</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddGenre;