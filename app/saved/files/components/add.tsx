import React, {useState, ChangeEvent} from 'react';
import {SAVED_APIs, UPLOAD_APIs} from "@/app/nav";
import {handleResult} from "@/app/errors";
import {useRouter} from "next/navigation";

interface FileObject {
  cid: string;
  name: string;
  size: string;
  caption: string;
}

const UploadFiles: React.FC = () => {
  const router = useRouter()
  const { UPLOAD } = UPLOAD_APIs
  const { FILES } = SAVED_APIs

  const [files, setFiles] = useState<FileObject[]>([]);
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;

    if (selectedFiles) {
      const formdata = new FormData();

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        formdata.append("files", file)
      }
      
      const c = window.confirm(`UPLOAD?`)
      if (c) {
        const requestOptions: RequestInit = {
          method: 'POST',
          body: formdata,
          redirect: 'follow'
        };

        fetch(`${UPLOAD}/files`, requestOptions)
          .then(response => response.json())
          .then(result => {
            const p: FileObject[] = result.files.map((file: FileObject) => ({
              name: file.name,
              cid: file.cid,
              size: file.size,
            }));

            setFiles(p);
          })
          .catch(error => console.log('error', error));
      } else {
        alert("Cancel")
      }
    }
  }

  const handleCaptionChange = (index: number, event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedFiles = [...files];
    updatedFiles[index].caption = event.target.value;
    setFiles(updatedFiles);
  };

  const handleFormSubmit = () => {
    const token = localStorage.getItem("token")
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const raw = JSON.stringify({files});

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(FILES, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.code !== undefined) {
          handleResult(result);
          return;
        }
        router.push("/saved/files");
      })
      .catch(error => console.log('error', error));
  };
  return (
    <div>
      <input type="file" multiple onChange={handleFileChange} />
      <ul>
      {files?.map((f, idx) => {
        return (
            <li key={idx}>
              <div>{f.name}</div>
              <span>Edit</span>
              <textarea value={f.caption}
                        onChange={(event) => handleCaptionChange(idx, event)}
              />
            </li>
        )
      })}
      </ul>
      <button onClick={() => handleFormSubmit()}>Upload</button>
    </div>
  );
};

export default UploadFiles