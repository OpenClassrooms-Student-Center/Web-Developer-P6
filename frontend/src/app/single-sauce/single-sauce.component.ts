import { Component, OnInit } from '@angular/core';
import { Sauce } from '../models/Sauce.model';
import { SaucesService } from '../services/sauces.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, EMPTY, map, Observable, of, switchMap, take, tap } from 'rxjs';

@Component({
  selector: 'app-single-sauce',
  templateUrl: './single-sauce.component.html',
  styleUrls: ['./single-sauce.component.scss']
})
export class SingleSauceComponent implements OnInit {

  loading!: boolean;
  sauce$!: Observable<Sauce>;
  userId!: string;
  likePending!: boolean;
  liked!: boolean;
  disliked!: boolean;
  errorMessage!: string;

  constructor(private sauces: SaucesService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.userId = this.auth.getUserId();
    this.loading = true;
    this.userId = this.auth.getUserId();
    this.sauce$ = this.route.params.pipe(
      map(params => params['id']),
      switchMap(id => this.sauces.getSauceById(id)),
      tap(sauce => {
        this.loading = false;
        if (sauce.usersLiked.find(user => user === this.userId)) {
          this.liked = true;
        } else if (sauce.usersDisliked.find(user => user === this.userId)) {
          this.disliked = true;
        }
      })
    );
  }

  onLike() {
    if (this.disliked) {
      return;
    }
    this.likePending = true;
    this.sauce$.pipe(
      take(1),
      switchMap((sauce: Sauce) => this.sauces.likeSauce(sauce._id, !this.liked).pipe(
        tap(liked => {
          this.likePending = false;
          this.liked = liked;
        }),
        map(liked => ({ ...sauce, likes: liked ? sauce.likes + 1 : sauce.likes - 1 })),
        tap(sauce => this.sauce$ = of(sauce))
      )),
    ).subscribe();
  }

  onDislike() {
    if (this.liked) {
      return;
    }
    this.likePending = true;
    this.sauce$.pipe(
      take(1),
      switchMap((sauce: Sauce) => this.sauces.dislikeSauce(sauce._id, !this.disliked).pipe(
        tap(disliked => {
          this.likePending = false;
          this.disliked = disliked;
        }),
        map(disliked => ({ ...sauce, dislikes: disliked ? sauce.dislikes + 1 : sauce.dislikes - 1 })),
        tap(sauce => this.sauce$ = of(sauce))
      )),
    ).subscribe();
  }

  onBack() {
    this.router.navigate(['/sauces']);
  }

  onModify() {
    this.sauce$.pipe(
      take(1),
      tap(sauce => this.router.navigate(['/modify-sauce', sauce._id]))
    ).subscribe();
  }

  onDelete() {
    this.loading = true;
    this.sauce$.pipe(
      take(1),
      switchMap(sauce => this.sauces.deleteSauce(sauce._id)),
      tap(message => {
        console.log(message);
        this.loading = false;
        this.router.navigate(['/sauces']);
      }),
      catchError(error => {
        this.loading = false;
        this.errorMessage = error.message;
        console.error(error);
        return EMPTY;
      })
    ).subscribe();
  }
}
