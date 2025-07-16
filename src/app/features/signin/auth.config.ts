import { AuthConfig } from 'angular-oauth2-oidc';

// export const authConfig: AuthConfig = {
//     issuer: 'https://accounts.google.com',
//     strictDiscoveryDocumentValidation: false,
//     clientId: '656340698751-kt8lk3hujr2grfo7rnjmddb85rmg1c2q.apps.googleusercontent.com',
//     // responseType: 'token',
//     // clientId: '3534841119-7jps5d3s9e6ges9rpc8hqiqjt5id5n33.apps.googleusercontent.com',
//     // redirectUri: window.location.origin + '/dashboard',
//     // redirectUri: window.location.origin + '/auth-callback',
//     // redirectUri: 'https://mybdjobs.bdjobs.com/mybdjobs/welcome.asp',
//     scope: 'openid profile email',
// };

export const authConfig: AuthConfig = {
    issuer: 'https://accounts.google.com',
    clientId: '656340698751-kt8lk3hujr2grfo7rnjmddb85rmg1c2q.apps.googleusercontent.com',
    // clientId: '3534841119-7jps5d3s9e6ges9rpc8hqiqjt5id5n33.apps.googleusercontent.com',
    responseType: 'code',
    redirectUri: window.location.origin + '/jobseeker-panel/signin',
    // redirectUri: window.location.origin + '/dashboard',
    scope: 'openid profile email',
    strictDiscoveryDocumentValidation: false
};