export const environment = {
  production: true,
  baseUrl: 'https://coordinatewebapp.azurewebsites.net', // Change this to the address of your backend API if different from frontend address
  loginUrl: '/login',
  googleClientId: null,
  facebookClientId: null,
  tokenUrl: 'https://coordinatewebapp.azurewebsites.net', // Base URL without /connect/token - this is added in the endpoint factory
  microsoftClientId: null
};
