import { Component, signal } from '@angular/core';
import { ProgressBarComponent } from "../../../shared/components/progress-bar/progress-bar.component";
import { DashboardRightPanelComponent } from "../dashboard-right-panel/dashboard-right-panel.component";
import { InvitationBoardComponent } from "../invitation-board/invitation-board.component";
import { DashboardStatComponent } from "../dashboard-stat/dashboard-stat.component";

@Component({
  selector: 'app-dashboard',
  imports: [ProgressBarComponent,
    DashboardRightPanelComponent,
    InvitationBoardComponent,
    DashboardStatComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  isPro = signal(true)
}
