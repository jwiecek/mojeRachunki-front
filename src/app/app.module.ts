import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { MaterialModule } from './material/material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BillCreateComponent } from './bill/bill-create/bill-create.component';
import { BillListComponent } from './bill/bill-list/bill-list.component';
import { MatBottomSheetRef } from '@angular/material';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TagComponent } from './tag/tag/tag.component';
import { ToolbarComponent } from './bill/toolbar/toolbar.component';
import { ChangeViewDialogComponent } from './bill/dialogs/change-view-dialog/change-view-dialog.component';
import { FilterDialogComponent } from './bill/dialogs/filter-dialog/filter-dialog.component';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule } from '@angular/material-moment-adapter';
import { BillPhotoDialogComponent } from './bill/dialogs/bill-photo-dialog/bill-photo-dialog.component';
import pl from '@angular/common/locales/pl';
import { registerLocaleData } from '@angular/common';
import { AuthInterceptor } from './auth/auth-interceptor';
import { AuthGuard } from './auth/auth.guard';
import { HeaderComponent } from './common/header/header.component';
import { BillSearchComponent } from './bill/bill-search/bill-search.component';
import { FilterBillComponent } from './bill/filter-bill/filter-bill.component';
import { SharedModule } from './common/shared.module';
import { AuthModule } from './auth/auth.module';
import { BillModule } from './bill/bill.module';

registerLocaleData(pl);

@NgModule({
  declarations: [
    AppComponent,
    TagComponent,

    BillCreateComponent,
    BillListComponent,
    ToolbarComponent,
    ChangeViewDialogComponent,
    FilterDialogComponent,
    BillPhotoDialogComponent,
    HeaderComponent,
    BillSearchComponent,
    FilterBillComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AuthModule,
    // BillModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    MatMomentDateModule
  ],
  providers: [
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: LOCALE_ID, useValue: 'pl' },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthGuard,
    { provide: MatBottomSheetRef, useValue: {} }
  ],
  entryComponents: [ChangeViewDialogComponent, FilterDialogComponent, BillPhotoDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
