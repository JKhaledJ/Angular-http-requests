import { HttpClient, HttpHeaders, HttpParams, HttpEventType } from '@angular/common/http';
import { myPost } from './myPost.model';
import { Injectable } from '@angular/core';
import {map, catchError, tap} from 'rxjs/operators'
import { Subject, throwError } from 'rxjs';

@Injectable({
    providedIn:'root'
})
export class PostService{
    constructor(private http: HttpClient){}

    serviceError=new Subject<string>();

    createAndStorePost(title: string, content: string){
        const postData:myPost={title:title,content:content}
        const mypost= this.http.post<{name:string}>('https://httprequestproject.firebaseio.com/posts.json'
        ,postData,   
        {
          observe:'response'
        });
        mypost.subscribe(
          responseData=>{
           console.log(responseData);
          },
          error=>{
            this.serviceError.next(error.statusText);
          }
        )
    }
    fetchPost(){
      let myParams=new HttpParams();
      myParams=myParams.append('print','pretty');
      myParams=myParams.append('custom','key');
       return this.http.get<{[key:string]:myPost}>('https://httprequestproject.firebaseio.com/posts.json',
        {
          headers:new HttpHeaders({'my-Custom-Header':'hello'}),
          params: myParams,
          observe:'body',
          responseType:'json'
        }
       )
        .pipe(map(responseData=>{
              const arrayPost:myPost[]=[];
              for(const key in responseData){
                if(responseData.hasOwnProperty){
                  arrayPost.push({...responseData[key],id: key}) //...responseData[] is spread operator, it takes a copy of the  array.
                }
              }
              return arrayPost;
          }
        ),
        catchError(errorRes=>{
          return throwError(errorRes);
        })
        )
    }

    DeletePost(){
      // let key='';
      // this.fetchPost().subscribe(response=>{
      //   key= response[0].id;
      // });
      // console.log(key);
      return this.http.delete('https://httprequestproject.firebaseio.com/posts.json',
      {
        observe:'events',
        responseType:'json'
      }).pipe(tap(
        event=>{
          console.log(event);
          if(event.type===HttpEventType.Sent){
            console.log("sent "+event.type);
          }
          if(event.type===HttpEventType.Response){
            console.log("response "+event.type);
          }
        }
      ));
    }
}