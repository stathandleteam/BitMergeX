import React, { useCallback, useState, useTransition, useEffect } from "react";
import s from "./UserAvatarThumbnail.module.scss"; // Create a CSS file for styling
import { loadImg } from "@/design-system/utils/utils";

interface UserAvatarThumbnailProps {
  imageUrl: string;
  altText: string;
  firstName: string;
  lastName: string;
  style?: any;
}

const UserAvatarThumbnail: React.FC<UserAvatarThumbnailProps> = ({ imageUrl, altText, firstName, lastName, style }) => {

  let initials = '';
  if (!firstName || !lastName){
    initials = 'A';
  } else {
    initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;
  }

  const [src, setSrc] = useState("");
  const [isPending, startTransition] = useTransition();

  const load = useCallback(
     () => {
      startTransition(()=>{
         loadImg(imageUrl).then((src) => {
          if (src === "error") {
          } else {
           setSrc(src);
          }
        });
      })
    },
    [imageUrl],
  )

  // Execute the created function directly
  useEffect(() => {
    let mounted = false;
    if (!mounted) {
      load();
      mounted = true;
    }
  }, [load]);

  return (
    <div className={s["avatar-container"]} style = {style}>
      {src ? (
        <img src={imageUrl} alt={altText} className={s["avatar-image"]} />
      ) : (
        <div className={s["avatar-initials"]}>{initials}</div>
      )}
    </div>
  );
};

export default UserAvatarThumbnail;