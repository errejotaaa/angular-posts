import { AuthService } from './../../auth/auth.service';
import { PostsService } from './../posts.service';
import { Post } from './../post.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postSubscription: Subscription;
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userId: string;
  private authStatusSub: Subscription;
  isUserAuthenticated = false;
  constructor(
    private postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postSubscription = this.postsService
      .getPostsUpdateListener()
      .subscribe((posts) => {
        this.isLoading = false;
        this.totalPosts = posts.postCount;
        this.posts = posts.posts;
      });
    this.isUserAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((res) => {
        this.isUserAuthenticated = res;
        this.userId = this.authService.getUserId();
      });
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId).subscribe(
      (resData) => {
        this.isLoading = true;
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    console.log(pageData);
  }
  ngOnDestroy(): void {
    this.postSubscription.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
