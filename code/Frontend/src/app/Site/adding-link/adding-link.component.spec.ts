import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddingLinkComponent } from './adding-link.component';

describe('AddingLinkComponent', () => {
  let component: AddingLinkComponent;
  let fixture: ComponentFixture<AddingLinkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddingLinkComponent]
    });
    fixture = TestBed.createComponent(AddingLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
