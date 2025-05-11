import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthScopeInterceptor implements HttpInterceptor {
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    // Only intercept requests to the token endpoint
    if (req.url.includes('/connect/token')) {
      
      // Check if this is a form-urlencoded request with a scope parameter
      if (req.body && typeof req.body === 'string' && req.body.includes('scope=')) {
        
        // Get the request body as a string
        let body = req.body as string;
        
        // Replace the scope parameter with our simplified scope - without coordinateapp_api
        body = body.replace(
          /scope=([^&]*)/g, 
          'scope=profile%20email%20roles'
        );
        
        // Clone the request with the modified body
        const modifiedReq = req.clone({
          body: body
        });
        
        console.log('Modified auth request scope:', body);
        
        return next.handle(modifiedReq);
      }
    }
    
    // For all other requests, proceed unchanged
    return next.handle(req);
  }
}