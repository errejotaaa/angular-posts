import { Subscription } from 'rxjs';
import { AuthService } from './../auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authSubscription: Subscription;
  userIsAuthernticated = false;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userIsAuthernticated = this.authService.getIsAuth();
    this.authSubscription = this.authService
      .getAuthStatusListener()
      .subscribe((res) => {
        this.userIsAuthernticated = res;
      });
  }

  onLogout() {
    this.authService.logout();
  }
  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }
}
