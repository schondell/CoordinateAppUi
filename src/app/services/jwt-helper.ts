


// 



/**
 * Helper class to decode and find JWT expiration.
 */
import { Injectable } from '@angular/core';


@Injectable()
export class JwtHelper {

  public urlBase64Decode(str: string): string {
    try {
      console.log('Decoding JWT token...');
      let output = str.replace(/-/g, '+').replace(/_/g, '/');
      switch (output.length % 4) {
        case 0: { break; }
        case 2: { output += '=='; break; }
        case 3: { output += '='; break; }
        default: {
          console.error('Illegal base64url string length!');
          throw new Error('Illegal base64url string!');
        }
      }
      return this.b64DecodeUnicode(output);
    } catch (e) {
      console.error('Error in urlBase64Decode:', e);
      // Return empty string instead of throwing to prevent app crash
      return '';
    }
  }

  // https://developer.mozilla.org/en/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem
  private b64DecodeUnicode(str: any) {
    try {
      return decodeURIComponent(Array.prototype.map.call(atob(str), (c: any) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    } catch (e) {
      console.error('Error in b64DecodeUnicode:', e);
      // Return empty string instead of throwing
      return '';
    }
  }

  public decodeToken(token: string): any {
    try {
      if (!token) {
        console.warn('Token is null or undefined');
        return {};
      }
      
      console.log('Decoding token...');
      const parts = token.split('.');

      if (parts.length !== 3) {
        console.warn('JWT token does not have 3 parts');
        return {};
      }

      const decoded = this.urlBase64Decode(parts[1]);
      if (!decoded) {
        console.warn('Token could not be decoded');
        return {};
      }

      return JSON.parse(decoded);
    } catch (e) {
      console.error('Error decoding token:', e);
      // Return empty object instead of throwing
      return {};
    }
  }

  public getTokenExpirationDate(token: string): Date {
    try {
      if (!token) {
        return null;
      }
      
      const decoded = this.decodeToken(token);

      if (!decoded.hasOwnProperty('exp')) {
        return null;
      }

      const date = new Date(0); // The 0 here is the key, which sets the date to the epoch
      date.setUTCSeconds(decoded.exp);

      return date;
    } catch (e) {
      console.error('Error getting token expiration date:', e);
      return null;
    }
  }

  public isTokenExpired(token: string, offsetSeconds?: number): boolean {
    try {
      if (!token) {
        return true;
      }
      
      const date = this.getTokenExpirationDate(token);
      offsetSeconds = offsetSeconds || 0;

      if (date == null) {
        return false;
      }

      // Token expired?
      return !(date.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)));
    } catch (e) {
      console.error('Error checking token expiration:', e);
      return true;
    }
  }

  public validateTokenIssuer(token: string, expectedIssuer: string): boolean {
    if (!token || !expectedIssuer) {
      return false;
    }

    try {
      const decoded = this.decodeToken(token);
      // Check if the token has an issuer claim
      if (!decoded.hasOwnProperty('iss')) {
        // If no issuer claim, assume it's valid to maintain compatibility
        console.warn('Token does not have an issuer claim, assuming valid');
        return true;
      }

      // Compare the token's issuer with the expected issuer
      // Support both formats with and without trailing slash
      const tokenIssuer = decoded.iss.endsWith('/') ? decoded.iss.slice(0, -1) : decoded.iss;
      const expectedIssuerNormalized = expectedIssuer.endsWith('/') ? expectedIssuer.slice(0, -1) : expectedIssuer;
      
      return tokenIssuer === expectedIssuerNormalized;
    } catch (error) {
      console.error('Error validating token issuer:', error);
      return false;
    }
  }
}
