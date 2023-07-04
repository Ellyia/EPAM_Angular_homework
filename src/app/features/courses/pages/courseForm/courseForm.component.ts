import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICourseForm } from '../../models/courseForm.model';
import { CoursesService } from '../../services/courses.service';

import { Router } from '@angular/router';
import { IBreadcrumb } from 'src/app/core/models/breadcrumb.model';

@Component({
  selector: 'app-course-form',
  templateUrl: './courseForm.component.html',
  styleUrls: ['./courseForm.component.scss']
})
export class CourseFormComponent {
  course: ICourseForm = {
    id: undefined,
    title: undefined,
    creationDate: undefined,
    duration: undefined,
    description: undefined,
    authors: undefined
  };

  breadcrumbs: IBreadcrumb[] = [{ url: '/courses', label: 'Courses' }];

  constructor(
    private router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private coursesService: CoursesService
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params) => {
      if (params.get('id')) {
        const id: number = +(params.get('id') as string);

        this.course = this.coursesService.getItemById(id);
        this.breadcrumbs.push({ label: this.course.title as string });
      } else {
        this.breadcrumbs.push({ label: 'Add course' });
      }
    });
  }

  getDuration(duration: number): void {
    this.course.duration = duration;
  }

  getDate(date: string): void {
    this.course.creationDate = date;
  }

  getAuthors(authors: string): void {
    this.course.authors = authors;
  }

  save(): void {
    if (this.course.id) {
      this.coursesService.updateItem(this.course);
    } else {
      this.coursesService.createCourse(this.course);
    }
    this.router.navigate(['/courses']);
  }

  cancel(): void {
    this.router.navigate(['/courses']);
  }
}
