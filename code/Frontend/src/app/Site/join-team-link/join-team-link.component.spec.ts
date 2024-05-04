import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinTeamLinkComponent } from './join-team-link.component';

describe('JoinTeamLinkComponent', () => {
  let component: JoinTeamLinkComponent;
  let fixture: ComponentFixture<JoinTeamLinkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JoinTeamLinkComponent]
    });
    fixture = TestBed.createComponent(JoinTeamLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
