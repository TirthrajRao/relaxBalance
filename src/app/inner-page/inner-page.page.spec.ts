import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InnerPagePage } from './inner-page.page';

describe('InnerPagePage', () => {
  let component: InnerPagePage;
  let fixture: ComponentFixture<InnerPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InnerPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InnerPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
