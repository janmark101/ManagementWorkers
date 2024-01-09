import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.scss']
})
export class VerifyAccountComponent implements OnInit{

  constructor(private Auth:AuthService, private router: Router){}

  activationCode: string[] = ['', '', '', '', '', ''];

  user :any;


  moveToNextInput(index: number): void {
    if (this.activationCode[index - 1].length === 1) {
      if (index < this.activationCode.length) {
        const nextInput = document.getElementById(`activation-code-${index + 1}`) as HTMLInputElement;
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  }

  activate(): void {
    const data = {'verify_code' : this.activationCode.join('')}

    this.Auth.verifyAccount(data).subscribe((data:any) =>{
      console.log(data);
      const user = this.Auth.getUserFromLocalStorage();
      user.verified = true
      localStorage.setItem('user',JSON.stringify(user));
      this.router.navigate(['/home']);
    },(error:any)=>{
      console.log(error)
    });
  }


  ngOnInit(): void {
    
  }

}
