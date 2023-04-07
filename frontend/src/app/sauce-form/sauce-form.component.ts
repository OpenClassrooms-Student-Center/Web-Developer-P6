import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SaucesService } from '../services/sauces.service';
import { Sauce } from '../models/Sauce.model';
import { AuthService } from '../services/auth.service';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-sauce-form',
  templateUrl: './sauce-form.component.html',
  styleUrls: ['./sauce-form.component.scss']
})
export class SauceFormComponent implements OnInit {

  sauceForm!: FormGroup;
  mode!: string;
  loading!: boolean;
  sauce!: Sauce;
  errorMsg!: string;
  imagePreview!: string;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private sauces: SaucesService,
              private auth: AuthService) { }

  ngOnInit() {
    this.loading = true;
    this.route.params.pipe(
      switchMap(params => {
        if (!params['id']) {
          this.mode = 'new';
          this.initEmptyForm();
          this.loading = false;
          return EMPTY;
        } else {
          this.mode = 'edit';
          return this.sauces.getSauceById(params['id'])
        }
      }),
      tap(sauce => {
        if (sauce) {
          this.sauce = sauce;
          this.initModifyForm(sauce);
          this.loading = false;
        }
      }),
      catchError(error => this.errorMsg = JSON.stringify(error))
    ).subscribe();
  }

  initEmptyForm() {
    this.sauceForm = this.formBuilder.group({
      name: [null, Validators.required],
      manufacturer: [null, Validators.required],
      description: [null, Validators.required],
      image: [null, Validators.required],
      mainPepper: [null, Validators.required],
      heat: [1, Validators.required],
      heatValue: [{value: 1, disabled: true}]
    });
    this.sauceForm.get('heat')!.valueChanges.subscribe(
      (value) => {
        this.sauceForm.get('heatValue')!.setValue(value);
      }
    );
  }

  initModifyForm(sauce: Sauce) {
    this.sauceForm = this.formBuilder.group({
      name: [sauce.name, Validators.required],
      manufacturer: [sauce.manufacturer, Validators.required],
      description: [sauce.description, Validators.required],
      image: [sauce.imageUrl, Validators.required],
      mainPepper: [sauce.mainPepper, Validators.required],
      heat: [sauce.heat, Validators.required],
      heatValue: [{value: sauce.heat, disabled: true}]
    });
    this.sauceForm.get('heat')!.valueChanges.subscribe(
      (value) => {
        this.sauceForm.get('heatValue')!.setValue(value);
      }
    );
    this.imagePreview = this.sauce.imageUrl;
  }

  onSubmit() {
    this.loading = true;
    const newSauce = new Sauce();
    newSauce.name = this.sauceForm.get('name')!.value;
    newSauce.manufacturer = this.sauceForm.get('manufacturer')!.value;
    newSauce.description = this.sauceForm.get('description')!.value;
    newSauce.mainPepper = this.sauceForm.get('mainPepper')!.value;
    newSauce.heat = this.sauceForm.get('heat')!.value;
    newSauce.userId = this.auth.getUserId();
    if (this.mode === 'new') {
      this.sauces.createSauce(newSauce, this.sauceForm.get('image')!.value).pipe(
        tap(({ message }) => {
          console.log(message);
          this.loading = false;
          this.router.navigate(['/sauces']);
        }),
        catchError(error => {
          console.error(error);
          this.loading = false;
          this.errorMsg = error.message;
          return EMPTY;
        })
      ).subscribe();
    } else if (this.mode === 'edit') {
      this.sauces.modifySauce(this.sauce._id, newSauce, this.sauceForm.get('image')!.value).pipe(
        tap(({ message }) => {
          console.log(message);
          this.loading = false;
          this.router.navigate(['/sauces']);
        }),
        catchError(error => {
          console.error(error);
          this.loading = false;
          this.errorMsg = error.message;
          return EMPTY;
        })
      ).subscribe();
    }
  }

  onFileAdded(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.sauceForm.get('image')!.setValue(file);
    this.sauceForm.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
