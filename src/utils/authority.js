// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  const authorityString =
    typeof str === 'undefined' ? localStorage.getItem('antd-pro-authority') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  return authority || ['admin'];
}

export function setAuthority({userName,currentAuthority}) {
  //const proAuthority = typeof currentAuthority === 'string' ? [currentAuthority] : currentAuthority;
   localStorage.setItem('userName', JSON.stringify(userName));
   localStorage.setItem('antd-pro-authority', JSON.stringify(currentAuthority));
   return 
}

export const btnAuthority=(rightCode)=>{
  return getAuthority().some(item => {
    return item === rightCode;
  });
}
