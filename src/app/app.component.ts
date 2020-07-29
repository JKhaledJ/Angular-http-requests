import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { myPost } from './myPost.model';
import { PostService } from './posts.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  loadedPosts: myPost[] = [];
  isFetching = false;
  error = null;
  private sub: Subscription;
  constructor(private http: HttpClient, private postServiec: PostService) { }

  ngOnInit() {
   this.sub = this.postServiec.serviceError.subscribe(
      error=>{
        this.error=error;
      }
    )
    this.onFetchPosts();
  }

  onCreatePost(postData: myPost) {
    // Send Http request
    this.postServiec.createAndStorePost(postData.title, postData.content);
  }

  onFetchPosts() {
    this.isFetching = true;
    this.postServiec.fetchPost().subscribe(response => {
      this.isFetching = false;
      this.loadedPosts = response;
    },
      error => {
        this.isFetching=false;
        this.error = error.error.error + ". " + error.statusText + " person.";
        console.log(error);
      });
  }

  onClearPosts() {
    this.postServiec.DeletePost().subscribe(
      () => {
        this.loadedPosts = [];
      }
    );
  }
  onHandleError(){
    this.error=null;
  }
  ngOnDestroy(){
    this.sub.unsubscribe();
  }
}
