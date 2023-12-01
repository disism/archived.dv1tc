import React, { useState } from 'react';
import {handleResult} from "@/app/errors";
import {useRouter} from "next/navigation";
import {HttpClient} from "@/app/api";

const CreatePlaylist: React.FC = () => {

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const router = useRouter()

  const create = () => {
    const token = localStorage.getItem("token");
    if (token === null) {
      router.push("/");
      return;
    }
    const client = new HttpClient()
    client.setHeaderToken(token)

    const raw = {
      "name": name,
      "description": description,
    }

    client.post("/_streaming/v1/musics/playlists", raw).then(res => {
      if (res.message == "OK") {
        location.reload();
      }
    }).catch(error => console.log(error))
  }
  return (
    <main>
      <h3>Create</h3>
      <span>Title:</span>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <span>Desc:</span>
      <textarea onChange={e => setDescription(e.target.value)}></textarea>
      <span>Upload avatar</span>
      <input type="file" />
      <button onClick={() => create()}>Submit</button>
    </main>
  );
};

export default CreatePlaylist;