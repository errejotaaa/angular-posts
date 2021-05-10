import { ServerPost } from './server-post.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiURL + '/posts';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];

  private postsUpdated$ = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: ServerPost[]; maxPosts: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map((postsData) => {
          return {
            posts: postsData.posts.map((post) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator,
              };
            }),
            maxPosts: postsData.maxPosts,
          };
        })
      )
      .subscribe((postsData) => {
        console.log(postsData);
        this.posts = postsData.posts;
        this.postsUpdated$.next({
          posts: [...this.posts],
          postCount: postsData.maxPosts,
        });
      });
  }

  getPost(id: string) {
    return this.http.get<ServerPost>(`${BACKEND_URL}/${id}`);
  }

  getPostsUpdateListener() {
    return this.postsUpdated$.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http
      .post<{ message: string; post: Post }>(BACKEND_URL, postData)
      .subscribe((resData) => {
        this.router.navigate(['/']);
      });
  }

  deletePost(id: string) {
    return this.http.delete<{ message: string }>(`${BACKEND_URL}/${id}`);
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null,
      };
    }
    this.http.put(`${BACKEND_URL}/${id}`, postData).subscribe((response) => {
      this.router.navigate(['/']);
    });
  }
}
