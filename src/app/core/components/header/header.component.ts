import { Component } from '@angular/core';
import { IUser } from '../../models/user.model';
import { USER } from '../../../assets/static/mock-user';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [AuthService]
})
export class HeaderComponent {
  user: IUser = USER;
  title = 'Video course';

  isAuth = (): boolean => {
    return this.authServise.isAuthenticated();
  };

  constructor(private authServise: AuthService) {}

  logout(): void {
    this.authServise.logout();
  }
}
