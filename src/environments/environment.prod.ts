export const environment = {
  production: true,
  backend: {
    protocol: 'http',
    host: '127.0.0.1',
    port: '4000',
    endpoints: {
      allGroup: '/group',
      oneGroup: '/group/:id',
      allLesson: '/lesson',
      oneLesson: '/lesson/:id',
      allUser: '/user',
      oneUser: '/user',
      allTest: '/test',
      oneTest: '/test/:id'
    }
  }
};
