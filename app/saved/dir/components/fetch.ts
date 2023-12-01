import {SAVED_APIs} from "@/app/nav";
import {Subdir} from "@/app/types";

interface SubdirResponse {
  subdirs: Subdir[];
}

export async function getDirs(token: string): Promise<SubdirResponse | undefined> {
  const { DIRS } = SAVED_APIs
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);

  const requestOptions: RequestInit = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };

  try {
    const response = await fetch(`${DIRS}`, requestOptions);
    const result = await response.json();
    return result as SubdirResponse;
  } catch (error) {
    console.log('error', error);
    return undefined;
  }
}