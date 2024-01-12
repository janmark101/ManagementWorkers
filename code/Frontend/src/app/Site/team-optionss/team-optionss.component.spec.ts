import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamOptionssComponent } from './team-optionss.component';

describe('TeamOptionssComponent', () => {
  let component: TeamOptionssComponent;
  let fixture: ComponentFixture<TeamOptionssComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamOptionssComponent]
    });
    fixture = TestBed.createComponent(TeamOptionssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
