import React from 'react';
import { useRouter } from 'next/navigation';
import {DirData} from "@/app/types";

interface SavedDirsProps {
  dirs: DirData[] | undefined;
}

const SavedDirs: React.FC<SavedDirsProps> = ({ dirs }) => {
  const router = useRouter()
  return (
    <ul>
      {dirs?.map((dir, idx) => (
        <li key={idx}>
          <button onClick={() => router.push(`/saved/dir/${dir.id}`)}>{dir.name}</button>
        </li>
      ))}
    </ul>
  );
};

export default SavedDirs;