import { Component,Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs';
import { SiteService } from 'src/app/Services/site.service';

@Component({
  selector: 'app-unique-code',
  templateUrl: './unique-code.component.html',
  styleUrls: ['./unique-code.component.scss']
})
export class UniqueCodeComponent implements OnInit {

  code = '';

  constructor(
    private dialogRef: MatDialogRef<UniqueCodeComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,private Service : SiteService
  ) {}

  ngOnInit(): void {
     this.code = this.data.code;
  }

  regenerate(){
    this.Service.RegenerateUniqueCode(this.data.teamId).pipe(take(1)).subscribe((data:any) =>{
          this.code = data.code;
          
        },(error:any) =>{
          console.log(error);
    });
  }

  onCancel(){
    this.dialogRef.close();
  }
}
