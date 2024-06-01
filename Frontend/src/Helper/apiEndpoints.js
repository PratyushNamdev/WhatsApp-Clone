

const apiEndpoints = {
    authentication: {
      signup: '/api/authentication/signup',
      login: '/api/authentication/login',
      verifyOTP: '/api/authentication/verifyOTP',
    },
    user:{
      searchUser:'/api/user/searchUser/',
      updateProfile:'/api/user/updateProfile',
      deleteProfilePicture:'/api/user/deleteProfilePicture'
    },
    chat:{
      fetchChats:"/api/chat/fetchChats",
      createChat:"/api/chat/createChat",
    },
    messages:{
      fetchMessages:"/api/message/fetchMessages/",
      sendMessage:"/api/message/sendMessage",
       messageSeen:"/api/message/messageSeen"
      
    },
    groupChat:{
      createGroupChat:"/api/chat/createGroupChat"
    }
  };
  
  export default apiEndpoints;
  