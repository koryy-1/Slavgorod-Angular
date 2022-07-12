import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user-model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';

@Component({
  selector: 'app-users-edit',
  templateUrl: './users-edit.component.html',
  styleUrls: ['./users-edit.component.css']
})
export class UsersEditComponent implements OnInit {
  user: User = {
    id: 0,
    login: null,
    password: null,
    firstName: null,
    lastName: null,
    patronymic: null,
    role: 'user',
    isActive: false,
  }
  users: User[] = []

  roles = ['admin', 'operator', 'user']

  // warningMessage = ''

  validateForm!: FormGroup

  captchaTooltipIcon: NzFormTooltipIcon = {
    type: 'info-circle',
    theme: 'twotone'
  }


  constructor(private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      login: [null, [Validators.required]],
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      patronymic: [null, [Validators.required]],
    });

  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  checkData(): boolean {
    if (this.validateForm.valid) {
      // console.log('submit', this.validateForm.value);
      return true
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty()
          control.updateValueAndValidity({ onlySelf: true })
        }
      })
      return false
    }

    // if (this.user?.login && this.user.login !== ""
    // && this.user.password && this.user.password !== ""
    // && this.user.firstName && this.user.firstName !== ""
    // && this.user.lastName && this.user.lastName !== ""
    // && this.user.patronymic && this.user.patronymic !== ""
    // && this.user.role && this.user.role !== "") {
    //   return true
    // }
    // else {
    //   this.warningMessage = 'some fields are not filled'
    //   // console.log(this.user);
      
    //   return false
    // }
  }

  saveUser() {
    if (this.checkData()) {
      this.users = JSON.parse(localStorage.getItem('Users') as string)
      if (this.users?.length != 0 && this.users[this.users.length - 1].hasOwnProperty('id'))
        this.user.id = this.users[this.users.length - 1].id + 1
      else
        this.user.id = 0

      this.users.push(this.user)
      localStorage.setItem('Users', JSON.stringify(this.users))
      this.router.navigate(['/users'])
    }
  }

}
