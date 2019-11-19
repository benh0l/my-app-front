export const environment = {
  production: true,
  backend: {
    protocol: 'http',
    host: '127.0.0.1',
    port: '4000',
    endpoints: {
      allGroup: '/group',
      oneGroup: '/group/:id',
      addUserGroup: '/group/addUser/:id',
      deleteUserGroup: '/group/deleteUser/:id',
      allLesson: '/lesson',
      oneLesson: '/lesson/:id',
      allUser: '/user',
      oneUser: '/user/:id',
      allTest: '/test',
      oneTest: '/test/:id',
      allGrade: '/grade',
      oneGrade: '/grade/:id'
    }
  }
};
