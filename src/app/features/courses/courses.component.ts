import { Component, OnInit } from '@angular/core';
import { ICourse } from './models/course.model';
import { FilterItemsPipe } from '../../shared/pipes/filterItems.pipe';
import { OrderByPipe } from '../../shared/pipes/orderBy.pipe';
import { CoursesService } from './services/courses.service';
@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
  providers: [FilterItemsPipe, OrderByPipe, CoursesService]
})
export class CoursesComponent implements OnInit {
  courses: ICourse[] = [];
  isCourses: boolean = false;
  coursesToShow: ICourse[] = [];

  searchStr: string = '';

  constructor(
    private filterItems: FilterItemsPipe,
    private orderBy: OrderByPipe,
    private coursesService: CoursesService
  ) {}

  ngOnInit(): void {
    this.showCourses();
  }

  showCourses(): void {
    this.courses = this.orderBy.transform(this.coursesService.getList());
    this.coursesToShow = this.filterCourses(this.searchStr);
    this.isCourses = this.courses.length > 0;
  }

  onClickLoadMore(): void {
    console.log('Load more...');
  }

  identify(index: number, course: ICourse): number {
    return course.id;
  }

  deleteCourse($event: number): void {
    this.coursesService.removeItem($event);
    this.showCourses();
  }

  searchCourses(searchString: string): void {
    this.searchStr = searchString;
    this.showCourses();
  }

  filterCourses(searchString: string): ICourse[] {
    return searchString
      ? this.filterItems.transform(this.courses, searchString)
      : [...this.courses];
  }
}
