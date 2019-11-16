export const environment = {
  production: true,
  backend: {
    protocol: 'http',
    host: '127.0.0.1',
    port: '4000',
    endpoints: {
      allGroup: '/group',
      oneGroup: '/group/:id'
    }
  }
};
