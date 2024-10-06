import { type ClassValue, clsx } from "clsx";
import CryptoJS from "crypto-js";
import { twMerge } from "tailwind-merge";
import { toHex } from "viem";
// import { privateKeyToAccount } from "viem/accounts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function copyToClipboard(str: string) {
  const clipboard = window.navigator.clipboard;
  /*
   * fallback to older browsers (including Safari)
   * if clipboard API not supported
   */
  if (!clipboard || typeof clipboard.writeText !== `function`) {
    const textarea = document.createElement(`textarea`);
    textarea.value = str;
    textarea.readOnly = true;
    textarea.contentEditable = "true";
    textarea.style.position = `absolute`;
    textarea.style.left = `-9999px`;

    document.body.appendChild(textarea);
    textarea.select();

    const range = document.createRange();
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
    textarea.setSelectionRange(0, textarea.value.length);

    document.execCommand(`copy`);
    document.body.removeChild(textarea);

    return Promise.resolve(true);
  }

  return clipboard.writeText(str);
}

export function deriveAccountFromUid(uid: string) {
  const hashedString = CryptoJS.SHA256(uid).toString();

  const buffer = Buffer.from(hashedString, "hex");
  // @ts-ignore
  const privateKey = toHex(buffer);

  console.log("Private Key: ", privateKey);

  return privateKey;
  // return privateKeyToAccount(privateKey);
}

export function convertFileToBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    // Event listener for when the file has been read
    reader.onloadend = () => {
      resolve(reader.result);
    };
    // Event listener for errors during reading
    reader.onerror = (error) => {
      reject(error);
    };
    // Read the file as a Data URL (Base64 encoded)
    reader.readAsDataURL(file);
  });
}

export const resizeImage = (file: File, maxSize: number): Promise<File> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(resizedFile);
            }
          },
          "image/jpeg",
          0.7,
        ); // Adjust quality here (0.7 = 70% quality)
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};
