// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  appName: 'Stud\'Eyes',
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
