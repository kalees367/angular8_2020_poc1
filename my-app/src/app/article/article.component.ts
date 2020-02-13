import { Component, ViewChild,OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ArticleService } from '../article.service';
import { Article } from '../article';
import {ActivatedRoute} from '@angular/router';
@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

  name: string;
  position: number;
  weight: number;
  symbol: string;

  id:number;
  title:string;
  category:string;
  MyDataSource = new MatTableDataSource();
  
  displayedColumns: string[] = ['id', 'title', 'category','action'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;  
  //Component properties
 // allArticles: Article[];
  allArticles: Article[];
  statusCode: number;
  requestProcessing = false;
  articleIdToUpdate = null;
  processValidation = false;
  
  //Create form
  articleForm = new FormGroup({
      title: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required)	   
  });
  //Create constructor to get service instance
  constructor(private articleService: ArticleService,route:ActivatedRoute) {
    route.params.subscribe(val => {
      // put the code from `ngOnInit` here
      this.getAllArticles();
    });
  }
  //Create ngOnInit() and and load articles
   ngOnInit(): void {
    this.getAllArticles();
  }   
  //Fetch all articles
  getAllArticles() {
    console.log("inside component ts a");
    //console.log(data);
       this.articleService.getAllArticles()
     .subscribe(
               (data) => {
                 this.allArticles = data['results'];
                 this.MyDataSource.data = data['results'];
                 this.MyDataSource.paginator = this.paginator;
                },
               errorCode =>  {
                 return this.statusCode = errorCode;
               });   
  }
  //Handle create and update article
  onArticleFormSubmit() {
    console.log("submit clicked");
   this.processValidation = true;   
   if (this.articleForm.invalid) {
        return; //Validation failed, exit from method.
   }   
  //  //Form is valid, now perform create or update
     this.preProcessConfigurations();
   let article = this.articleForm.value;
   article.id = 1;
   //console.log(article);
   if (this.articleIdToUpdate === null) {  
   
  //    //Generate article id then create article
       this.articleService.getAllArticles()
      .subscribe(articles => {
  //     //Create article
         this.articleService.createArticle(article)
       .subscribe(successCode => {
         this.statusCode = successCode;
         this.getAllArticles();	
         this.backToCreateArticle();
        },
        errorCode => this.statusCode = errorCode
        );
    });		
   } else {  
        //Handle update article
       article.id = this.articleIdToUpdate; 
       console.log("before update call");
     this.articleService.updateArticle(article)
       .subscribe(successCode => {
               this.statusCode = successCode;
           this.getAllArticles();	
         this.backToCreateArticle();
         },
           errorCode => this.statusCode = errorCode);	  
   }
  }
  // //Load article by id to edit
  loadArticleToEdit(articleId: string) {
     this.preProcessConfigurations();
     this.articleService.getArticleById(articleId)
       .subscribe(article => {
         console.log("loaded for edit");
         console.log(article['data'].title);
               this.articleIdToUpdate = article['data'].id;   
               this.articleForm.setValue({ title: article['data'].title, category: article['data'].category });
         this.processValidation = true;
         this.requestProcessing = false;   
           },
           errorCode =>  this.statusCode = errorCode);   
  }
  // //Delete article
  deleteArticle(articleId: string) {
     this.preProcessConfigurations();
     this.articleService.deleteArticleById(articleId)
       .subscribe(successCode => {
        console.log("loaded for delete");
               //this.statusCode = successCode;
         //Expecting success code 204 from server
         this.statusCode = 204;
           this.getAllArticles();	
           this.backToCreateArticle();
         },
           errorCode => this.statusCode = errorCode);    
  }
  //Perform preliminary processing configurations
  preProcessConfigurations() {
     this.statusCode = null;
   this.requestProcessing = true;   
  }
  //Go back from update to create
  backToCreateArticle() {
     this.articleIdToUpdate = null;
     this.articleForm.reset();	  
   this.processValidation = false;
  }


}
