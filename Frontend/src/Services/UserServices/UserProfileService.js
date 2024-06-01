import HOST from "../../Helper/host";
import apiEndpoints from "../../Helper/apiEndpoints";
import toast from "react-hot-toast";

// Unified function to update user profile
export const updateUserProfile = async (updateData) => {
  if(updateData?.newProfilePic){
    toast('Setting up new Profile Picture' , {
      icon:"🕒",
      style: {
        background: "#202c33",
        color: '#fff',
      },
    })
  }
  try {
    const response = await fetch(`${HOST}${apiEndpoints.user.updateProfile}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        authToken: localStorage.getItem('token'),
      },
      body: JSON.stringify(updateData),
    });
    if (!response.ok) {
      throw new Error('Failed to update user profile');
    }
    const data = await response.json();
    if(data?.error){
       toast.error("Failed to update user")
    }
   return data.user;
  } catch (error) {
    toast.error(error?.message)
    console.error(error);
  }
};
 export const deleteProfilePicture = async ()=>{
  toast('Removing Profile Picture, you okay??' , {
    icon:"🕒",
    style: {
      background: "#202c33",
      color: '#fff',
    },
  })
  try {
    const response = await fetch(`${HOST}${apiEndpoints.user.deleteProfilePicture}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        authToken: localStorage.getItem('token'),
      },
    });
    if (!response.ok) {
      throw new Error('Failed to update user profile');
    }
    const data = await response.json();
    if(data?.error){
       toast.error("Failed to update user")
    }
    toast.success("Profile Picture Removed", {
      style: {
        background: "#202c33",
        color: "#fff",
      },
    });
   return data.user;
  } catch (error) {
    toast.error(error?.message)
    console.error(error);
  }
 }