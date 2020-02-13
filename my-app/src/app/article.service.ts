import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Article } from './article';
import { map } from "rxjs/operators"; 

@Injectable()
export class ArticleService {
    //URL for CRUD operations
	//articleUrl = "http://localhost:3000/articles";
	articleUrl = "http://localhost:3000/users";
	
	//articleUrl = "https://jsonplaceholder.typicode.com/posts";
	//Create constructor to get Http instance
	constructor(private http:Http, private httpCl: HttpClient) { 
	}
	//Fetch all articles
    getAllArticles(): Observable<Article[]> {
		
        this.httpCl.get(this.articleUrl).subscribe((data:any) => {
			console.log("get articles call");
			console.log(data);
		});
		return this.http.get(this.articleUrl)
		    		.pipe(map((this.extractData)));
    }
	//Create article
    createArticle(article: Article):Observable<number> {
		console.log("create article step 1");
	    let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: cpHeaders });
        return this.http.post(this.articleUrl, article, options)
			   .pipe(map(success => success.status));
               
    }
	//Fetch article by id
    getArticleById(articleId: string): Observable<Article> {
		let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: cpHeaders });
		console.log(this.articleUrl +"/"+ articleId);
		return this.http.get(this.articleUrl +"/"+ articleId)
			   .pipe(map(this.extractData));
    }	
	//Update article
    updateArticle(article: Article):Observable<number> {
		console.log("service update call ")
	    let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: cpHeaders });
        return this.http.put(this.articleUrl +"/"+ article.id, article, options)
               .pipe(map(success => success.status));
               
    }
    //Delete article	
    deleteArticleById(articleId: string): Observable<number> {
		let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: cpHeaders });
		return this.http.get(this.articleUrl +"/delete/"+ articleId)
			   .pipe(map(success => success.status));
			   
	}	
	private extractData(res: Response) {
	    let body = res.json();
        return body;
    }
    private handleError (error: Response | any) {
		console.error(error.message || error);
		return observableThrowError(error.status);
    }
}