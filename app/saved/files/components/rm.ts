import {SAVED_APIs} from "@/app/nav";
import {handleResult} from "@/app/errors";

export const RMFile = (id: string) => {
  const { FILES } = SAVED_APIs
  const token = localStorage.getItem("token")

  const x = window.confirm("Delete?")
  if (x) {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions: RequestInit = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(`${FILES}/${id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.code !== undefined) {
          handleResult(result);
          return;
        }
        alert("Deleted!")
        location.reload()
      })
      .catch(error => console.log('error', error));
    return
  } else {
    alert("Cancel")
    return;
  }

}