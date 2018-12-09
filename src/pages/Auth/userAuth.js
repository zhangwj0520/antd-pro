export const isAuthenticated = ({ WrappedComponent, rightCode }) => {
  const authData = ['admin', 'ddd', 'add'];
  console.log(rightCode);
  console.log(authData);

  const checkAuth = (data, rightCode) => {
    if (data) {
      const hasAuth = data.some(item => {
        return item === rightCode;
      });
      return hasAuth;
    }
  };
  const hasAuth = checkAuth(authData, rightCode);
  console.log(hasAuth);

    if (hasAuth) {
        console.log(111)
      return <WrappedComponent disabled={false}/>
    } else {
        console.log('no')
      return <WrappedComponent disabled={true} />
    }
};
