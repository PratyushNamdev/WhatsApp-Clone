import React, { useState, useRef, useContext } from "react";
import AvatarEditor from "react-avatar-editor";
import { updateUserProfile } from "../../Services/UserServices/UserProfileService";
import AuthContext from "../../Context/Authentication/AuthContext";
import toast from "react-hot-toast";
import style from "../../CSS/CropDP.module.css";
import { CloseIcon, TickIcon } from "../../Helper/icons";
export default function CropDP({ imageToCrop, setImageToCrop }) {
  const { setUser } = useContext(AuthContext);
  const [slideValue, setSlideValue] = useState(10);
  
  const editorRef = useRef(null);
  const handleSave = async () => {
    if (editorRef.current) {
      // Get the canvas scaled image
      const canvas = editorRef.current.getImageScaledToCanvas();
      const dataUrl = canvas.toDataURL();

      setImageToCrop(null);
      let updatedUser = await updateUserProfile({ newProfilePic: dataUrl });
      console.log(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success("Profile Picture updated", {
        style: {
          background: "#202c33",
          color: "#fff",
        },
      });
    }
  };
  const handleCancel = () => {
    setImageToCrop(null)
  };
  return (
    <div className={style.cropperContainer}>
      <div>
        <div className={style.cropperHeader}>
          <div>
            <button onClick={handleCancel}>
              <span>
                <CloseIcon />
              </span>
            </button>
          </div>

          <div><article>Drag the image to adjust</article></div>
        </div>
        <AvatarEditor
          ref={editorRef}
          image={imageToCrop}
          crossOrigin="anonymous" // Add crossOrigin attribute for CORS
          borderRadius={1000}
          border={50}
          color={[255, 255, 255, 0.6]} // RGBA
          scale={slideValue / 10}
          rotate={0}
          width={380}
          height={380}
        />
      </div>
      <input
        type="range"
        min={10}
        max={50}
        value={slideValue}
        onChange={(e) => setSlideValue(e.target.value)}
      />
      <div className={style.btnBox}>
        <button onClick={handleSave}>
          <span>
            <TickIcon />
          </span>
        </button>
      </div>
    </div>
  );
}
