import { NgModule, Injectable } from '@angular/core';
import { RouterModule, DefaultUrlSerializer, UrlSerializer, UrlTree } from '@angular/router';
import { routes } from './app.routes';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth-guard.service';
import { Utilities } from './services/utilities';

@Injectable()
export class LowerCaseUrlSerializer extends DefaultUrlSerializer {
  parse(url: string): UrlTree {
    const possibleSeparators = /[?;#]/;
    const indexOfSeparator = url.search(possibleSeparators);
    let processedUrl: string;

    if (indexOfSeparator > -1) {
      const separator = url.charAt(indexOfSeparator);
      const urlParts = Utilities.splitInTwo(url, separator);
      urlParts.firstPart = urlParts.firstPart.toLowerCase();
      processedUrl = urlParts.firstPart + separator + urlParts.secondPart;
    } else {
      processedUrl = url.toLowerCase();
    }
    return super.parse(processedUrl);
  }
}

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    AuthService,
    AuthGuard,
    { provide: UrlSerializer, useClass: LowerCaseUrlSerializer }]
})
export class AppRoutingModule { }
