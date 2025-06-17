# Dynamic JWT Authentication with Syncfusion DataManager

## Overview

This document provides multiple solutions for handling dynamic JWT authentication with Syncfusion DataManager in Angular applications. The main challenge is that DataManager headers are set once during initialization, but JWT tokens can expire or be refreshed during the application lifecycle.

## Solutions

### 1. Custom Adaptor (Recommended)

**Best for:** Applications that want automatic token handling with minimal code changes.

**Implementation:**
```typescript
// In your component
private initializeDataManager(): void {
  this.dataManager = new DataManager({
    url: `${baseUrl}/api/YourEndpoint/UrlDatasource`,
    adaptor: this.dynamicAuthAdaptor,
    crossDomain: true
    // No headers needed - adaptor handles them
  });
}
```

**Pros:**
- Automatic token injection for every request
- Handles token refresh transparently
- No manual header updates needed
- Works with token expiration

**Cons:**
- Requires creating a custom adaptor
- Slightly more complex setup

### 2. DataManager Auth Service

**Best for:** Applications with multiple DataManager instances that need centralized token management.

**Implementation:**
```typescript
// In your component
ngOnInit() {
  this.dataManager = this.dataManagerAuthService.createDataManager({
    endpoint: '/api/YourEndpoint/UrlDatasource',
    componentName: 'your-component'
  });
  
  // Subscribe to token refresh events
  this.dataManagerAuthService.getTokenRefreshEvent()
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      // Token refreshed, grid will automatically use new token
    });
}
```

**Pros:**
- Centralized token management
- Automatic updates across all registered DataManagers
- Event-driven token refresh
- Easy to manage multiple instances

**Cons:**
- Requires service registration/unregistration
- More complex for simple use cases

### 3. Simple Helper Service

**Best for:** Simple applications or quick implementations.

**Implementation:**
```typescript
// In your component
ngOnInit() {
  this.dataManager = this.dataManagerHelper.createDataManager('/api/YourEndpoint/UrlDatasource');
}

// Call when you need to refresh token
refreshToken() {
  this.dataManagerHelper.refreshDataManagerTokenIfNeeded(this.dataManager);
  this.grid.refresh();
}
```

**Pros:**
- Simple to implement
- Easy to understand
- Minimal dependencies

**Cons:**
- Manual token refresh calls needed
- No automatic token handling

### 4. HTTP Interceptor

**Best for:** Applications that want to handle token refresh at the HTTP level for all requests.

**Implementation:**
```typescript
// In your app.module.ts or main.ts
providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthTokenInterceptor,
    multi: true
  }
]
```

**Pros:**
- Handles all HTTP requests automatically
- Transparent token refresh
- Works with any HTTP client usage

**Cons:**
- May interfere with non-API requests
- Global scope might be too broad

## Implementation Guide

### Step 1: Choose Your Approach

For most applications, we recommend the **Custom Adaptor** approach as it provides the best balance of automatic handling and simplicity.

### Step 2: Update Your Components

Replace your existing DataManager initialization:

**Before:**
```typescript
this.dataManager = new DataManager({
  url: `${baseUrl}/api/WorkOrder/UrlDatasource`,
  adaptor: new UrlAdaptor(),
  crossDomain: true,
  headers: [
    { 'Authorization': `Bearer ${this.authService.accessToken}` },
    { 'Content-Type': 'application/json' }
  ]
});
```

**After (Custom Adaptor):**
```typescript
this.dataManager = new DataManager({
  url: `${baseUrl}/api/WorkOrder/UrlDatasource`,
  adaptor: this.dynamicAuthAdaptor,
  crossDomain: true
});
```

### Step 3: Handle Token Refresh Events

Subscribe to authentication events to refresh your grid when tokens change:

```typescript
private setupSubscriptions(): void {
  this.authService.getLoginStatusEvent()
    .pipe(takeUntil(this.destroy$))
    .subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.refreshData();
      }
    });
}
```

### Step 4: Add Error Handling

Handle authentication errors gracefully:

```typescript
// In your custom adaptor
public processResponse(data: any, ds?: DataManager): any {
  if (data && data.error && data.error.status === 401) {
    console.warn('Authentication failed, redirecting to login');
    this.authService.reLogin();
    return { result: [], count: 0 };
  }
  return super.processResponse(data, ds);
}
```

## Token Refresh Strategies

### 1. Proactive Refresh

Refresh tokens before they expire:

```typescript
// Check token expiry every 5 minutes
timer(0, 5 * 60 * 1000).subscribe(() => {
  if (this.authService.isTokenExpiringSoon()) {
    this.authService.refreshLogin().subscribe();
  }
});
```

### 2. Reactive Refresh

Refresh tokens when requests fail with 401:

```typescript
// In HTTP interceptor
catchError(error => {
  if (error.status === 401) {
    return this.handleTokenRefresh(req, next);
  }
  return throwError(error);
})
```

### 3. Manual Refresh

Allow users to manually refresh:

```typescript
// In component
refreshToken() {
  this.authService.refreshLogin().subscribe(() => {
    this.grid.refresh();
  });
}
```

## Best Practices

1. **Use Custom Adaptor for New Applications**: It provides the cleanest separation of concerns.

2. **Implement Token Expiry Checking**: Don't wait for 401 errors - check token expiry proactively.

3. **Handle Refresh Failures**: Always have a fallback to redirect to login when refresh fails.

4. **Test Token Expiry Scenarios**: Ensure your implementation works when tokens expire during grid operations.

5. **Consider Token Storage**: Store tokens securely and ensure they persist across browser sessions if needed.

6. **Log Authentication Events**: Add logging to help debug authentication issues.

## Troubleshooting

### Common Issues

1. **Headers Not Updating**: Ensure you're updating the `dataSource.headers` property, not creating new headers.

2. **Token Refresh Loops**: Implement proper refresh state management to prevent infinite refresh loops.

3. **Grid Not Refreshing**: Call `grid.refresh()` after token updates to reload data.

4. **CORS Issues**: Ensure your backend properly handles CORS for authenticated requests.

### Debug Tips

1. **Check Network Tab**: Verify that requests include the correct Authorization header.

2. **Log Token Changes**: Add console logging to track token refresh events.

3. **Test with Expired Tokens**: Manually test with expired tokens to ensure proper handling.

## Example Implementation

See `workorders-enhanced.component.ts` for a complete example showing multiple approaches in a single component.

## Migration Guide

To migrate existing components:

1. Replace `UrlAdaptor` with `DynamicAuthAdaptor`
2. Remove static headers from DataManager configuration
3. Add token refresh event subscriptions
4. Update error handling to manage auth failures
5. Test thoroughly with token expiry scenarios

This approach ensures your Syncfusion DataManager always has valid JWT tokens for authentication, providing a smooth user experience even when tokens expire or are refreshed.