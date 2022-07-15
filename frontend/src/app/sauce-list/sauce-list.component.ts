import { Component, OnInit } from '@angular/core';
import { SaucesService } from '../services/sauces.service';
import { catchError, Observable, of, tap } from 'rxjs';
import { Sauce } from '../models/Sauce.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sauce-list',
  templateUrl: './sauce-list.component.html',
  styleUrls: ['./sauce-list.component.scss']
})
export class SauceListComponent implements OnInit {

  sauces$!: Observable<Sauce[]>;
  loading!: boolean;
  errorMsg!: string;

  constructor(private sauce: SaucesService,
              private router: Router) { }

  ngOnInit() {
    this.loading = true;
    this.sauces$ = this.sauce.sauces$.pipe(
      tap(() => {
        this.loading = false;
        this.errorMsg = '';
      }),
      catchError(error => {
        this.errorMsg = JSON.stringify(error);
        this.loading = false;
        return of([]);
      })
    );
    this.sauce.getSauces();
  }

  onClickSauce(id: string) {
    this.router.navigate(['sauce', id]);
  }

}
