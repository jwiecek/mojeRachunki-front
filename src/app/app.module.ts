import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BillCreateComponent } from './bill/bill-create/bill-create.component';
import { BillListComponent } from './bill/bill-list/bill-list.component';
import {
  MatAutocompleteModule,
  MatBottomSheetModule,
  MatBottomSheetRef,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatProgressBarModule,
  MatRadioModule,
  MatSliderModule,
  MatToolbarModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TagComponent } from './tag/tag/tag.component';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ChangeViewDialogComponent } from './bill/dialogs/change-view-dialog/change-view-dialog.component';
import { FilterDialogComponent } from './bill/dialogs/filter-dialog/filter-dialog.component';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule } from '@angular/material-moment-adapter';
import { BillPhotoDialogComponent } from './bill/dialogs/bill-photo-dialog/bill-photo-dialog.component';
import pl from '@angular/common/locales/pl';
import { registerLocaleData } from '@angular/common';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { AuthGuard } from './auth/auth.guard';
import { HeaderComponent } from './header/header.component';
import { BillSearchComponent } from './common/bill-search/bill-search.component';
import { FilterBillComponent } from './common/filter-bill/filter-bill.component';
registerLocaleData(pl);

@NgModule({
  declarations: [
    AppComponent,
    BillCreateComponent,
    BillListComponent,
    TagComponent,
    ToolbarComponent,
    ChangeViewDialogComponent,
    FilterDialogComponent,
    BillPhotoDialogComponent,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    BillSearchComponent,
    FilterBillComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatToolbarModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    FlexLayoutModule,
    MatAutocompleteModule,
    FormsModule,
    MatProgressBarModule,
    MatSliderModule,
    MatDialogModule,
    MatCheckboxModule,
    MatDividerModule,
    MatListModule,
    MatRadioModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatBottomSheetModule,
    MatExpansionModule,
    MatSliderModule,
    MatMenuModule
  ],
  providers: [
    // { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: LOCALE_ID, useValue: 'pl' },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthGuard,
    { provide: MatBottomSheetRef, useValue: {} }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ChangeViewDialogComponent, FilterDialogComponent, BillPhotoDialogComponent]
})
export class AppModule {}
