import { Component,Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs';
import { SiteService } from 'src/app/Services/site.service';

@Component({
  selector: 'app-adding-link',
  templateUrl: './adding-link.component.html',
  styleUrls: ['./adding-link.component.scss']
})
export class AddingLinkComponent {

  link : String = ''

  constructor(
    private dialogRef: MatDialogRef<AddingLinkComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,private Service : SiteService
  ) {}

  ngOnInit(): void {
     
  }

  regenerate(){
    this.Service.AddingLink(this.data.teamId).pipe(take(1)).subscribe((data:any) =>{
          console.log(data);
          this.link = `http://localhost:4200/join/${data.link}`
          
        },(error:any) =>{
          console.log(error);
    });
  }

  onCancel(){
    this.dialogRef.close();
  }

}
