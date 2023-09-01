import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { ICourseForm } from '../../models/course-form.model';
import { CoursesService } from '../../services/courses.service';
import { IBreadcrumb } from 'src/app/core/models/breadcrumb.model';
import { EMPTY, of } from 'rxjs';
import { ICourse } from '../../models/course.model';
import { switchMap, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/state/app.state';
import {
  AddCourse,
  EditCourse,
  ResetCourses
} from 'src/app/store/actions/courses.actions';

import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { IAuthor } from '../../models/author.model';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  courseForm = new FormGroup({
    id: new FormControl<number | null>(null, Validators.required),
    name: new FormControl<string | null>(null, Validators.required),
    date: new FormControl<string | null>('', Validators.required),
    length: new FormControl<number | null>(null, Validators.required),
    description: new FormControl<string | null>(null, Validators.required),
    authors: new FormArray([])
  });

  authorsList: IAuthor[] = [];
  authorsOfCourse: any = [];

  breadcrumbs: IBreadcrumb[] = [{ url: '/courses', label: 'Courses' }];

  constructor(
    private router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private coursesService: CoursesService,
    private store: Store<IAppState>
  ) {
    super();
  }

  ngOnInit() {
    this.subs = this.activatedRoute.paramMap
      .pipe(
        switchMap((params) => {
          if (params.get('id')) {
            const id: number = +(params.get('id') as string);

            return this.coursesService.getItemById(id);
          } else {
            this.breadcrumbs.push({ label: 'Add course' });

            this.store.dispatch(ResetCourses());

            return EMPTY;
          }
        })
      )
      .subscribe((course: ICourse) => {
        console.log(course);

        this.courseForm.patchValue({
          id: course.id,
          name: course.name,
          length: course.length,
          description: course.description,
          date: course.date
        });

        this.setAuthors(course.authors);
        this.authorsOfCourse = course.authors;

        this.breadcrumbs.push({ label: this.courseForm.value.name as string });

        this.store.dispatch(ResetCourses());
      });

    this.subs = this.activatedRoute.paramMap
      .pipe(
        switchMap(() => {
          return this.coursesService.getAuthors();
        })
      )
      .subscribe((authors: IAuthor[]) => {
        console.log(authors);

        this.authorsList = authors;
      });
  }

  getAuthorsOFCourse(authors: any): void {
    console.log('authors', authors);

    // this.setAuthors(authors);

    // this.authorsList = authors;
    this.courseForm.value.authors = authors; // у якому вигляді має передаватись масив авторів iз authors-input.component? як у ICourse.authors
  }

  save(): void {
    const coursePayload = {
      id: this.courseForm.value.id,
      name: this.courseForm.value.name,
      date: this.courseForm.value.date,
      length: this.courseForm.value.length,
      description: this.courseForm.value.description,
      authors: this.courseForm.value.authors
    };

    if (coursePayload.id) {
      this.store.dispatch(EditCourse({ course: coursePayload }));
    } else {
      this.store.dispatch(AddCourse({ course: coursePayload }));
    }

    this.reset();
  }

  cancel(): void {
    this.reset();
  }

  reset(): void {
    this.store.dispatch(ResetCourses());
    this.router.navigate(['/courses']);
  }

  setAuthors(authors: any[]): void {
    const authorsArray = this.courseForm.get('authors') as FormArray;
    authors.forEach((author) => {
      authorsArray.push(
        new FormGroup({
          id: new FormControl<number>(author.id),
          name: new FormControl<string>(author.name),
          lastName: new FormControl<string>(author.lastName)
        })
      );
    });
  }
}
