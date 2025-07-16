import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { LocalstorageService } from "../essentials/localstorage.service";
import { catchError, finalize, map, Observable, switchMap, throwError } from "rxjs";
import { Cookies } from "../../../shared/enums/app.enums";
import { CookieService } from "../cookie/cookie.service";



@Injectable()
export class AuthInterceptor implements HttpInterceptor{
    private cookieService = inject(CookieService);
    private localStorage = inject(LocalstorageService);
    private http = inject(HttpClient);

    private refreshApiUrl = 'https://gateway.bdjobs.com/bdjobs-auth-dev/api/Login/GetAuthTokenByRefreshToken'

    private isRefreshing = false
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log(`[HTTP] ${req.method} → ${req.url}`);
        // const Token = this.localStorage.getItem("Token");
        // const refToken = this.localStorage.getItem("refToken");
        const Token = this.cookieService.getCookie(Cookies.AUTH);
        const refToken = this.cookieService.getCookie(Cookies.REFTOKEN);
       
         const authReq = this.addToken(req, Token);
        
        
        if(Token){
            console.log(`Interceptor Access Token, ${Token}, Interceptor Ref Token, ${refToken}`);
        }

        
        return next.handle(authReq).pipe(
            catchError(err => {
                if(err.status === 401 && !this.isRefreshing) {
                    this.isRefreshing = true;
                    return this.refreshToken().pipe(
                        switchMap( newToken => {
                            console.log("refreshToken", newToken);
                            const newReq = this.addToken(req, newToken);
                            return next.handle(newReq);
                        }),
                        finalize(() => this.isRefreshing = false)
                    )
                }
                return throwError(() => err);
            })
        );
    }

   
    private addToken(req: HttpRequest<any>, token: string | null){
        return token ? req.clone({setHeaders: {Authorization: `Bearer ${token}`}}) : req;
    }

    private refreshToken():Observable<string>{
        // const refresh = this.localStorage.getItem("refToken");
        const refresh = this.cookieService.getCookie(Cookies.REFTOKEN);
        return this.http.get<any>(`${this.refreshApiUrl}?refreshToken=${refresh}`).pipe(
            map((res: any) => {
                const newAuthToken = res.event.eventData[0].value.token;
                const newRefreshToken = res.event.eventData[0].value.refreshToken;

            // ✅ Store both new tokens in cookies
                this.cookieService.setCookie(Cookies.AUTH, newAuthToken,1);
                this.cookieService.setCookie(Cookies.REFTOKEN, newRefreshToken,1);
                // this.localStorage.setItem("Token", res.token);
                // this.localStorage.setItem("refToken", res.refreshToken);
                return res.event.eventData[0].value.token;
            })
        );
    }
    

}