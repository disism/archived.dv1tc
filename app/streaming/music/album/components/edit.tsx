import React, {useState} from 'react';
import {AlbumData, MusicArtistData} from "@/app/types";
import NumericInput from "@/app/components/input";
import AddArtist from "@/app/streaming/music/components/artist";

interface AlbumEditProps {
  album: AlbumData | undefined;
}


const AlbumEdit: React.FC<AlbumEditProps> = ({ album }) => {

  const [title, setTitle] = useState<string | undefined>(album?.title);
  const [year, setYear] = useState<number | undefined>(album?.year);
  const [description, setDescription] = useState<string | undefined>(album?.description);

  const [artists, setArtists] = useState<MusicArtistData[]>(album?.artists || []);

  const handleValueChange = (newValue: number) => {
    setYear(newValue);
  };
  const handlerAddArtist = (artist: MusicArtistData) => {
    setArtists([...artists, artist]);
  };

  const removeArtist = (index: number) => {
    const updatedArtists = artists.filter((_, idx) => idx !== index);
    setArtists(updatedArtists);
  };

  console.log(artists)

  const submit = () => {

  }
  return (
    <div>
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
        <NumericInput value={year!} onChange={handleValueChange} />
      </div>
      <div>
        <p>Artist:</p>
        {artists?.map((artist, idx) => (
          <span key={idx}>
            {artist.name} <button onClick={() => removeArtist(idx)}>Remove</button>
          </span>
        ))}
      </div>
      <div>
        <p>Add Artist</p>
        <AddArtist onAddArtist={handlerAddArtist} />
      </div>
      <div>
        <button onClick={() => submit()}>Submit</button>
      </div>
    </div>
  );
};

export default AlbumEdit