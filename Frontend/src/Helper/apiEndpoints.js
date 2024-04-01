

const apiEndpoints = {
    authentication: {
      signup: '/api/authentication/signup',
      login: '/api/authentication/login',
      verifyOTP: '/api/authentication/verifyOTP',
    },
    user:{
      searchUser:'/api/chat/searchUser/'
    },
    chat:{
      fetchChats:"/api/chat/fetchChats",
      createChat:"/api/chat/createChat",
    },
    messages:{
      fetchMessages:"/api/message/fetchMessages/",
      sendMessage:"/api/message/sendMessage",
       messageSeen:"/api/message/messageSeen"
      
    }
  };
  
  export default apiEndpoints;
  