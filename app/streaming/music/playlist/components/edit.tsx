import React, { useState } from 'react';
import {handleResult} from "@/app/errors";
import {STREAMING_APIs} from "@/app/nav";
import {useRouter} from "next/navigation";

interface EditPlaylistProps {
  id: string,
  isEditor: (value: (((prevState: boolean) => boolean) | boolean)) => void
}

const EditPlaylist: React.FC<EditPlaylistProps> = ({ id, isEditor }) => {

  const router = useRouter()
  const MUSIC = STREAMING_APIs.MUSIC;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const edit = () => {
    const token = localStorage.getItem("token");

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const raw = JSON.stringify({
      "name": name,
      "description": description,
    });

    const requestOptions: RequestInit = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`${MUSIC}/playlists/${id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        if (result.code !== undefined) {
          handleResult(result);
          return;
        }
        location.reload();
      })
      .catch(error => console.log('error', error));
  };

  const editPrivate = (value: string) => {
    const c = confirm(`Set Private ${value == "true" ? "ok" : "not ok"}`)
    if (c) {
      const token = localStorage.getItem("token")
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions: RequestInit = {
        method: 'PATCH',
        headers: myHeaders,
        redirect: 'follow'
      };

      fetch(`${MUSIC}/playlists/${id}/private/${value}`, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result)
          if (result.code !== undefined) {
            handleResult(result);
            return;
          }
          location.reload();
        })
        .catch(error => console.log('error', error));
    } else  {
      alert("Cancel")
    }
  }

  const d = () => {
    const c = confirm("remove?")
    if (c) {

      const token = localStorage.getItem("token")
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions: RequestInit = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
      };

      fetch(`${MUSIC}/playlists/${id}`, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result)
          if (result.code !== undefined) {
            handleResult(result);
            return;
          }
          router.back()
        })
        .catch(error => console.log('error', error));
    } else {
      alert("Cancel")
    }
  }

  return (
    <main>
      <h3>Edit</h3>
      <div>
        <span>Open Status</span>
        <select onChange={e => editPrivate(e.target.value)}>
          <option>---</option>
          <option value="true">Private</option>
          <option value="false">Public</option>
        </select>
      </div>
      <hr/>
      <div>
        <div>
          <span>Title</span>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div>
          <span>Desc:</span>
          <textarea onChange={e => setDescription(e.target.value)}></textarea>
        </div>
        <div>
          <span>Upload Cover</span>
          <input type="file" />
        </div>
        <button onClick={() => edit()}>Sbmit</button>
      </div>
      <hr/>
      <div>
        <button onClick={() => isEditor(false)}>Close</button><button onClick={() => d()}>Delete</button>
      </div>
    </main>
  );
};

export default EditPlaylist;