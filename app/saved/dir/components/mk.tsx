import React, { useState } from 'react';
import {handleResult} from "@/app/errors";
import {SAVED_APIs} from "@/app/nav";
import {useRouter} from "next/navigation";

interface MkDirComponentProps {
  parentID: string | undefined;
}

const MKDir: React.FC<MkDirComponentProps> = ({ parentID }) => {
  const [dirName, setDirName] = useState('');
  const {DIRS} = SAVED_APIs
  const router = useRouter()

  const mkdir = () => {
    if (dirName === '') {
      alert('Create Dir Name');
      return;
    }

    const token = localStorage.getItem("token")
    if (token === null) {
      router.push("/")
      return
    }

    const url = `${DIRS}/${parentID}/subdir`;

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${token}`);

    const raw = JSON.stringify({
      name: dirName,
    });

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(url, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.code !== undefined) {
          handleResult(result);
          return;
        }
        location.reload();
      })
      .catch(error => console.log('error', error));

    setDirName('');
  };

  return (
    <div>
      <input
        type="text"
        value={dirName}
        onChange={e => setDirName(e.target.value)}
        placeholder="Dir Name"
      />
      <button onClick={mkdir}>Mk Dir</button>
    </div>
  );
};

export default MKDir;