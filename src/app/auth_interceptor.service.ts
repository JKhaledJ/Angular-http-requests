import { HttpInterceptor, HttpRequest, HttpHandler, HttpEventType } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export class AuthInterceptorService implements HttpInterceptor{
    intercept(req:HttpRequest<any>, next:HttpHandler){
        const modifiedReq=req.clone({headers:req.headers.append('auth','xyz')});
        console.log("request is on its way. "+req.url);
        return next.handle(modifiedReq).pipe(tap(
            event=>{
                console.log(event);
                if(event.type===HttpEventType.Response){
                    console.log("Response arrived, its body is: ");
                    console.log(event.body);
                }
            }
        ));
    }
}