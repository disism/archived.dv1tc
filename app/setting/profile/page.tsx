"use client"

import React, {useEffect, useState} from "react";
import {ACCOUNTS_APIs, UPLOAD_APIs} from "@/app/nav";
import {handleResult} from "@/app/errors";
import {AvatarData, User} from "@/app/types";
import {getImageInfo} from "@/app/file";
import Image from "next/image";
import {GetPreviewLink, IPFS_GATEWAY} from "@/app/ipfs";
import {useRouter} from "next/navigation";
interface NewAvatar {
  "cid": string;
  "name": string;
  "size": number;
  "height": number;
  "width": number;
}

export default function Page() {
  const router = useRouter()
  const [token, setToken] = useState("")

  const {USER, AVATAR} = ACCOUNTS_APIs
  const {UPLOAD} = UPLOAD_APIs

  const [userData, setUserData] = useState<User>()
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [mutations, setMutations] = useState(true)
  const [privateUser, setPrivateUser] = useState(false)

  useEffect(() => {
    if (userData?.bio != bio || userData?.name != name) {
      setMutations(false)
    } else {
      setMutations(true)
    }
  }, [bio, mutations, name, userData?.bio, userData?.name]);

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token === null) {
      router.push("/")
      return
    }
    setToken(token)

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions: RequestInit = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(USER, requestOptions)
      .then(response => response.json())
      .then(result => {
        setUserData(result.user)
        setName(result.user.name)
        setBio(result.user.bio)
      })
      .catch(error => console.log('error', error));
  }, [USER, router, token]);


  const editUser = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const raw = JSON.stringify({
      "name": name,
      "bio": bio
    });

    const requestOptions: RequestInit = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(USER, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        if (result.message === "OK") {
          alert("edit success")
          setUserData(result.user)
          location.reload()
        }
      })
      .catch(error => console.log('error', error));
  }

  const editAvatar = (f: FileList | null) => {
    if (f == undefined) {
      alert("Please Select A Image")
      return
    }
    if (f[0]==null) {
      alert("Please Select A Image")
      return
    }

    const file: File = f[0];

    getImageInfo(file).then(f => {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      const formdata = new FormData();

      formdata.append("file", file);

      const requestOptions: RequestInit = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };

      fetch(`${UPLOAD}/avatar`, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result)

          const newAvatarData: NewAvatar = {
            cid: result.cid,
            name: result.name,
            size: result.size,
            height: f.height,
            width: f.width
          };


          if (window.confirm('Success')) {
            editAvatarHandler(newAvatarData)
          } else {
            alert("Cancel")
            return;
          }
        })
        .catch(error => console.log('error', error));

    }).catch(err => {
      console.log(err)
        alert("Error")
      })

  }
  const editAvatarHandler = (newAvatarData: NewAvatar) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const raw = JSON.stringify(newAvatarData);

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(AVATAR, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        if (result.code != undefined) {
          handleResult(result)
          return
        }
        if (result.message == "OK") {
          alert("Success")
          location.reload()
        }
      })
      .catch(error => console.log('error', error));
  }

  const editUsername = () => {
    const username = prompt("edit username");
    if (username === null) {
      alert("Cancel")
      return;
    }
    if (username == "") {
      alert("input username")
      return;
    } else {
      if (username == userData?.username) {
        alert("no change")
        return
      }
      const password = prompt("password");
      if (password === null) {
        alert("Cancel")
        return;
      }
      if (password == "") {
        alert("input password")
        return;
      }
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const raw = JSON.stringify({
        "username": username,
        "password": password
      });

      const requestOptions: RequestInit = {
        method: 'PATCH',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch(`${USER}/username`, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result)
          if (result.code != undefined) {
            handleResult(result)
            return
          }
          if (result.message == "OK") {
            alert("success")
            localStorage.removeItem("token")
            location.reload()
          }
        })
        .catch(error => console.log('error', error));
    }
  }
  const editEmail = () => {
    const email = prompt("input email");
    if (email === null) {
      alert("Cancel")
      return;
    }
    console.log(email);
    if (email == "") {
      alert("input email")
      return;
    } else {
      const password = prompt("input password");
      if (password == "") {
        alert("input password")
        return;
      }
      if (password === null) {
        alert("Cancel")
        return
      }
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const raw = JSON.stringify({
        "email": email,
        "password": password
      });

      const requestOptions: RequestInit = {
        method: 'PATCH',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch(`${USER}/email`, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result)
          if (result.code != undefined) {
            handleResult(result)
            return
          }
          if (result.message == "OK") {
            alert("Success")
            localStorage.removeItem("token")
            location.reload()
          }
        })
        .catch(error => console.log('error', error));
    }
  }

  const editPassword = () => {
    const password = prompt("input password")
    if (password === null) {
      alert("Cancel")
      return
    }
    if (password == "") {
      alert("input password")
      return;
    }
    const newPassword = prompt("new password");
    if (newPassword === null) {
      alert("Cancel")
      return
    }
    if (newPassword == "") {
      alert("input password")
      return;
    }
    const confirmPassword = prompt("confirm password")
    if (confirmPassword === null) {
      alert("Cancel")
      return
    }
    if (confirmPassword == "") {
      alert("input password")
      return;
    }
    if (confirmPassword != newPassword) {
      alert("password error")
      return
    }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const raw = JSON.stringify({
      "new_password": newPassword,
      "password": password
    });

    const requestOptions: RequestInit = {
      method: 'PATCH',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`${USER}/password`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        if (result.code != undefined) {
          handleResult(result)
          return
        }
        if (result.message == "OK") {
          alert("Success")
          localStorage.removeItem("token")
          location.reload()
        }
      })
      .catch(error => console.log('error', error));

  }

  const editPrivateUser = (value: string) => {
    if (value == "true") {
      setPrivateUser(true)
    } else {
      setPrivateUser(false)
    }
  }
  const editPrivateUserHandler = () => {
    if (privateUser == userData?.private) {
      alert("no change")
      return
    }
    const password = prompt("input password")
    if (password === null) {
      alert("Cancel")
      return
    }
    if (password == "") {
      alert("input password")
      return;
    }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const raw = JSON.stringify({
      "private": privateUser,
      "password": password
    });

    const requestOptions: RequestInit = {
      method: 'PATCH',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`${USER}/private`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        if (result.code != undefined) {
          handleResult(result)
          return
        }
        if (result.message == "OK") {
          alert("change success")
          localStorage.removeItem("token")
          location.reload()
        }
      })
      .catch(error => console.log('error', error));
  }

  const loader = ({ src, width, quality }: { src: string, width: number, quality?: number }): string => {
    return `${src}?w=${width}&q=${quality || 75}`;
  };
  const comb = (avatar: AvatarData) => {
    // return `https://${avatar?.image?.cid}.${IPFS_GATEWAY}/${avatar?.image?.name}`
    return GetPreviewLink(avatar?.image?.cid, avatar?.image?.name)
  }

  return (
    <main>
    <h1>IAm</h1>
      <h3>Name</h3>
      <input type="text"
             value={name}
             onChange={e => setName(e.target.value)}
      />
      <h3>Bio</h3>
      <textarea
        rows={4}
        value={bio}
        onChange={e => setBio(e.target.value)} />

      <div>
        <button disabled={mutations} onClick={() => editUser()}>Submit</button>
      </div>
      <hr/>
      <h2>Avatar</h2>
      <div>
        {userData?.avatar != null ? <Image loader={loader} src={comb(userData?.avatar)} width={120} height={120} alt="avatar"/> : null}
        <div>
          <h3>Upload Avatar</h3>
          <input type="file" onChange={e => editAvatar(e.target.files)}/>
        </div>
        <div>
          <h3>History</h3>
          <button onClick={() => router.push("/setting/profile/avatar")}>Avatar History</button>
        </div>
      </div>
      <hr/>
      <h2>Private</h2>
      <h3>Username</h3>
        <button onClick={() => editUsername()}>Edit Username</button>
      <h3>Email</h3>
        <button onClick={() => editEmail()}>Edit Email</button>
      <h3>Password</h3>
        <button onClick={() => editPassword()}>Edit Password</button>

      <h4>Private</h4>
      <div>
        <select onChange={e => editPrivateUser(e.target.value)}>
          <option value="false">false</option>
          <option value="true">true</option>
        </select>
        <button onClick={() => editPrivateUserHandler()}>Ok</button>
      </div>
    </main>
  )
}
