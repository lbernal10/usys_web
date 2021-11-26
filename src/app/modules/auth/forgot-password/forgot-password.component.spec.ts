import {
  waitForAsync,
  ComponentFixture,
  TestBed,
  getTestBed,
} from '@angular/core/testing';

import { ForgotPasswordComponent } from './forgot-password.component';
import { Routes } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { Observable, of } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

const fakeAuth = {
  email: 'admin@demo.com',
  password: 'demo',
};

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let injector;
  let authService: AuthService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule],
      declarations: [ForgotPasswordComponent],
      providers: [],
    }).compileComponents();

    injector = getTestBed();
    authService = injector.get(AuthService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
