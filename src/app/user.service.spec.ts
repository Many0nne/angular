import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'; // Utilisez HttpClientTestingModule
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '123' }),
            snapshot: { paramMap: { get: () => '123' } },
          },
        },
      ],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch users with the correct headers', () => {
    const mockUsers = [{ name: 'John Doe', email: 'john@example.com' }];
    const token = 'mockToken';
    localStorage.setItem('token', token);

    service.getUsers().subscribe((users) => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/users');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush(mockUsers);
  });

  it('should create a user', () => {
    const mockUser = { name: 'Jane Doe', email: 'jane@example.com', password: 'password123' };
    const mockResponse = { id: '123', ...mockUser };

    service.createUser(mockUser).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/users');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.body).toEqual(mockUser);
    req.flush(mockResponse);
  });

  it('should log in a user and store the token', () => {
    const mockUser = { email: 'john@example.com', password: 'password123' };
    const mockResponse = { token: 'mockToken', user: { name: 'John Doe' } };

    service.login(mockUser).subscribe((response) => {
      expect(response).toEqual(mockResponse);
      expect(localStorage.getItem('token')).toBe(mockResponse.token);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/users/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUser);
    req.flush(mockResponse);
  });

  it('should log out a user and remove the token', () => {
    localStorage.setItem('token', 'mockToken');

    service.logout();

    expect(localStorage.getItem('token')).toBeNull();

    const req = httpMock.expectOne('http://localhost:3000/api/users/logout');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should fetch the user profile', () => {
    const mockProfile = { name: 'John Doe', email: 'john@example.com' };
    const token = 'mockToken';
    localStorage.setItem('token', token);

    service.getUserProfile().subscribe((profile) => {
      expect(profile).toEqual(mockProfile);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/users/me');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush(mockProfile);
  });

  it('should check if an email exists', () => {
    const email = 'john@example.com';
    const mockResponse = { exists: true };

    service.checkEmailExists(email).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/users/check-email?email=${email}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});