const getTime = (value)=>{
    const date = new Date(value);
    const options = { timeZone: 'Asia/Kolkata', hour12: true, hour: '2-digit', minute: '2-digit' };
    const time = date.toLocaleTimeString('en-US', options);
    return time;
}
export default getTime;