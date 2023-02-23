import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  paginatedResult: PaginatedResult<Member[]> = new PaginatedResult<Member[]>;

  constructor(private http: HttpClient) { }

  getMembers(page?: number, itemsPerPage?: number) {
    let params = new HttpParams();

    if(page && itemsPerPage) {
      params = params.append('pageNumber', page); // Adds query string key pageNumber
      params = params.append('pageSize', itemsPerPage);
    }

    // This is getting the whole Http response with headers
    return this.http.get<Member[]>(this.baseUrl + 'users', { observe: 'response', params}).pipe(
      map(response => {
        if(response.body) {
          this.paginatedResult.result = response.body;
        }

        const pagination = response.headers.get('Pagination');
        if(pagination) {
          this.paginatedResult.pagination = JSON.parse(pagination);
        }

        return this.paginatedResult;
      })
    );
    // This is not getting the headers
    // if(this.members.length > 0) return of(this.members); // If there is already members, no need to go fetch from API. Gets it from this service
    // return this.http.get<Member[]>(this.baseUrl + 'users').pipe(
      // map(members => {
      //   this.members = members;
      //   return members;
      // })
    // );
  }

  getMember(username: string) {
    const member = this.members.find(x => x.userName === username);
    if(member) return of(member);
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = {...this.members[index], ...member}
      })
    );
  }

  // Update has second param, usually indicating what is being updated
  setMainPhoto(photoId: Number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  // Delete does not have second param
  deletePhoto(photoId: Number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }

  // Gets auth token to be passed up when getting members
  // Moved this logic to jwt.interceptor
  // getHttpOptions() {
  //   const userString = localStorage.getItem('user');
  //   if(!userString) return;
  //   const user = JSON.parse(userString);
  //   return {
  //     headers: new HttpHeaders({
  //       Authorization: 'Bearer ' + user.token
  //     })
  //   }
  // }
}
