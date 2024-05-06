import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private users: { [key: string]: string } = {}; 
  private loggedIn: boolean = false;

  constructor() {}

  login(username: string, password: string): boolean {
    if (this.users[username] && this.users[username] === password) {
      this.loggedIn = true;
      return true;
    } else {
      return false;
    }
  }

  signup(username: string, password: string): void {
    if (!this.users[username]) {
      this.users[username] = password;
      console.log('User signed up:', username);
    } else {
      console.log('User already exists:', username);
    }
  }

  logout(): void {
    this.loggedIn = false;
  }

  isLoggedIn(): boolean {
    return this.loggedIn || true;
  }
}
