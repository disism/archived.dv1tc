import React from 'react';
import {handleResult} from "@/app/errors";
import {SAVED_APIs} from "@/app/nav";
import {useRouter} from "next/navigation";

interface RMDirComponentProps {
  id: string | undefined;
}

const RMDir: React.FC<RMDirComponentProps> = ({ id }) => {
  const router = useRouter()
  const {DIRS} = SAVED_APIs
  const rmdir = () => {
    if (id === '') {
      alert('Create?');
      return;
    }
    const d = window.confirm("ok?")
    if (!d) {
      alert("Cancel")
      return;
    }

    const deleteUrl = `${DIRS}/${id}`;

    const token = localStorage.getItem("token")
    if (token === null) {
      router.push("/")
      return
    }
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions: RequestInit = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(deleteUrl, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.code !== undefined) {
          handleResult(result);
          return;
        }
        alert("Success")
        router.back()
      })
      .catch(error => console.log('error', error));

  };

  return (
    <div>
      <button onClick={rmdir}>Delete</button>
    </div>
  );
};

export default RMDir;