export function getImageInfo(file: File): Promise<{ width: number, height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height
        });
      };
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      img.src = reader.result as string;
    };
    reader.onerror = () => {
      reject(new Error('Failed to read files'));
    };
    reader.readAsDataURL(file);
  });
}


export function getAudioInfo(file: File): Promise<{ duration: number }> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.addEventListener('loadedmetadata', () => {
      resolve({ duration: audio.duration });
    });
    audio.onerror = () => reject(new Error('Failed to load audio'));
    audio.src = URL.createObjectURL(file);
  });
}