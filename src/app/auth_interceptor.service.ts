import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export class AuthInterceptorService implements HttpInterceptor{
    intercept(req:HttpRequest<any>, next:HttpHandler){
        const modifiedReq=req.clone({headers:req.headers.append('auth','xyz')});    
        return next.handle(modifiedReq);
    }
}