import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
//import {Http, ResponseContentType} from '@angular/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  downloadFile(val: any): Observable<any>{
		return this.http.get(val);
  } 
}
