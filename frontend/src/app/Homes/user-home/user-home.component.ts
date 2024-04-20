import { Component, HostListener, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class HomeComponent implements OnInit {
  private currentFocusIndex: number = 0;
  private focusInterval: any;
  private infoBoxes!: NodeListOf<HTMLElement>;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.infoBoxes = this.el.nativeElement.querySelectorAll('.info-box');
    this.startFocusInterval();
  }

  @HostListener('mouseenter', ['$event'])
  onBoxHover(event: Event) {
    clearInterval(this.focusInterval);
    this.resetFocus();
    const target = event.target as HTMLElement;
    target.classList.add('active');
  }

  @HostListener('mouseleave', ['$event'])
  onBoxLeave(event: Event) {
    const target = event.target as HTMLElement;
    target.classList.remove('active');
    this.startFocusInterval();
  }

  startFocusInterval() {
    this.focusInterval = setInterval(() => {
      this.setFocus(this.currentFocusIndex);
      this.currentFocusIndex = (this.currentFocusIndex + 1) % this.infoBoxes.length;
    }, 3000);
  }

  setFocus(index: number) {
    this.resetFocus();
    this.infoBoxes[index].classList.add('active');
  }

  resetFocus() {
    this.infoBoxes.forEach(box => box.classList.remove('active'));
  }

  ngOnDestroy() {
    if (this.focusInterval) {
      clearInterval(this.focusInterval);
    }
  }
}
