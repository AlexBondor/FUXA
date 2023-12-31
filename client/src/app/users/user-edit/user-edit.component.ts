import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User, UserGroups } from '../../_models/user';
import { SelOptionsComponent } from '../../gui-helpers/sel-options/sel-options.component';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
    selector: 'app-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
    formGroup: UntypedFormGroup;
    selectedGroups = [];
    groups = UserGroups.Groups;
    showPassword: boolean;

    @ViewChild(SelOptionsComponent, { static: false }) seloptions: SelOptionsComponent;

    constructor(public dialogRef: MatDialogRef<UserEditComponent>,
        private fb: UntypedFormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: UserEditData) {
        this.selectedGroups = UserGroups.ValueToGroups(this.data.user.groups);
    }

    ngOnInit() {
        this.formGroup = this.fb.group({
            username: [this.data.user?.username, [Validators.required, this.isValidUserName()]],
            fullname: [this.data.user?.fullname],
            password: []
        });
        if (this.data.current?.username) {
            this.formGroup.get('username').disable();
        }
        this.formGroup.updateValueAndValidity();
    }

    onCancelClick(): void {
        this.dialogRef.close();
    }

    onOkClick(): void {
        if (this.seloptions) {
            this.data.user.groups = UserGroups.GroupsToValue(this.seloptions.selected);
        }
        this.data.user.username = this.formGroup.controls.username.value;
        this.data.user.fullname = this.formGroup.controls.fullname.value || '';
        this.data.user.password = this.formGroup.controls.password.value;
        this.dialogRef.close(this.data.user);
    }

    isValidUserName(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (control.value && this.isValid(control.value)) {
                return null;
            } else {
                return { UserNameNotValid: true };
            }
        };
    }

    isValid(name): boolean {
        if (this.data.current?.username) {
            return true;
        } else if (name) {
            return this.data.users.find(uname => uname === name && uname !== this.data.user?.username) ? false : true;
        }
        return false;
    }

    isAdmin(): boolean {
        if (this.data.user && this.data.user.username === 'admin') {
            return true;
        } else {
            return false;
        }
    }

    keyDownStopPropagation(event) {
        event.stopPropagation();
    }
}

export interface UserEditData {
    user: User;
    current: User;
    users: string[];
}
