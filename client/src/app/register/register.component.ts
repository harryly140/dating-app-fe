import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{
  // @Input() usersFromHomeComponent: any; // Parent to Child
  @Output() cancelRegister = new EventEmitter(); // Child to Parent
  model: any = {};
  registerForm: FormGroup = new FormGroup({}); // Declaring reactive forms

  constructor(private accountService: AccountService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  // Initiailizing reactive forms
  initializeForm() {
    this.registerForm = new FormGroup({
      username: new FormControl(),
      password: new FormControl(),
      confirmPassword: new FormControl()
    })
  }

  register() {
    console.log(this.registerForm?.value);

    // Not Reactive Form template; old code
    // this.accountService.register(this.model).subscribe({
    //   next: () => {
    //     this.cancel();
    //   },
    //   error: error => {
    //     this.toastr.error(error.error)
    //   }
    // });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }

}
