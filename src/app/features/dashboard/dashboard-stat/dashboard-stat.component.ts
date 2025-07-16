import { Component, signal } from '@angular/core';
import { HalfDonutChartComponent } from "../../../shared/components/half-donut-chart/half-donut-chart.component";
import { NgClass, NgStyle } from '@angular/common';
import { SelectboxComponent } from "../../../shared/components/selectbox/selectbox.component";
import { FormControl } from '@angular/forms';
import { LineChartComponent } from "../../../shared/components/line-chart/line-chart.component";
import { DonutChartComponent } from "../../../shared/components/donut-chart/donut-chart.component";

@Component({
  selector: 'app-dashboard-stat',
  imports: [HalfDonutChartComponent, NgStyle, SelectboxComponent, LineChartComponent, DonutChartComponent],
  templateUrl: './dashboard-stat.component.html',
  styleUrl: './dashboard-stat.component.scss'
})
export class DashboardStatComponent {
  stats = ["General Stat", "Pro Stat"]
  selectedBtn = "General Stat"
  borderColor = '#1D9DDA'
  labels = [
    '01 Feb', '02 Feb', '03 Feb', '04 Feb', '05 Feb',
    '06 Feb', '07 Feb', '08 Feb', '09 Feb', '10 Feb'
  ];

  donutChartHeader = ['Profile View', 'Email CV', 'Download CV']
  selectedHeader = 'Profile View'

  invitationView = [
    {
      id: '1',
      boxColor: '#0E6596',
      title: 'Online Test',
      count: 120,
      boxShadow: '#EDF7FC',
    },
    {
      id: '2',
      boxColor: '#079455    ',
      title: 'Video Interview',
      count: 120,
      boxShadow: '#EDFCF6',
    },

    {
      id: '3',
      boxColor: '#1D9DDA',
      title: 'Video CV',
      count: 45,
      boxShadow: '#EDF7FC',
    },
    {
      id: '4',
      boxColor: '#F79009',
      title: 'Bdjobs Profile',
      count: 120,
      boxShadow: '#FCF6ED',
    }
  ]
  profileView = [
    {
      id: '1',
      boxColor: '#0E6596',
      title: 'Bdjobs Profile',
      count: 20,
      boxShadow: '#EDF7FC',
    },
    {
      id: '2',
      boxColor: '#1D9DDA',
      title: 'Video CV',
      count: 46,
      boxShadow: '#EDF7FC',
    },
    {
      id: '3',
      boxColor: '#F79009',
      title: 'Bdjobs Profile',
      count: 34,
      boxShadow: '#FCF6ED',
    }
  ]

  emailCv = [
    {
      id: '1',
      boxColor: '#0E6596',
      title: 'Bdjobs CV',
      count: 20,
      boxShadow: '#EDF7FC',
    },
    {
      id: '2',
      boxColor: '#F79009',
      title: 'Personalized CV',
      count: 32,
      boxShadow: '#FCF6ED',
    },
  ]

  downloadCv = [
    {
      id: '1',
      boxColor: '#0E6596',
      title: 'Bdjobs CV',
      count: 30,
      boxShadow: '#EDF7FC',
    },
    {
      id: '2',
      boxColor: '#F79009',
      title: 'Personalized CV',
      count: 20,
      boxShadow: '#FCF6ED',
    },
  ]

  selectBoxOptions = signal([
    {
      id: '7',
      label: 'Last 7 Days',
      value: '7'
    },
    {
      id: '3',
      label: 'Last 3 Days',
      value: '3'
    },

    {
      id: '2',
      label: 'Yesterday',
      value: '2'
    },
    {
      id: '1',
      label: 'Today',
      value: '1'
    }
  ])

  profileDonutData = this.profileView.map(item => item.count)
  emailDonutData = this.emailCv.map(item => item.count)
  downloadCvData = this.downloadCv.map(item => item.count)
  invitaionData = this.invitationView.map(item => item.count)

  ProfileLabel = this.profileView.map(item => item.title)
  emailLabel = this.emailCv.map(item => item.title)
  downloadLabel = this.downloadCv.map(item => item.title)
  invitationLabel = this.invitationView.map(item => item.title)

  data = []

  statsCards = signal([
    {
      id: '1',
      imageUrl: 'images/fav_search.svg',
      title: "Favorite Search",
      count: 350,
      upgrade: 10.2,
      borderColor: '#1D9DDA',
      bgColor: '#F5FAFC'
    },
    {
      id: '2',
      imageUrl: 'images/saved-jobs.svg',
      title: "Saved Jobs",
      count: 350,
      upgrade: 10.2,
      borderColor: '#D8CB55',
      bgColor: '#FCFBF2'
    },
    {
      id: '3',
      imageUrl: 'images/follow-emp.svg',
      title: "Favorite Search",
      count: 350,
      upgrade: -10.2,
      borderColor: '#C63C92',
      bgColor: '#F2FCFC'
    },

  ])

  proStatsCards = [
    {
      id: '1',
      title: 'See who viewed my profile',
      count: 350,
      bgColor: '#F5FAFC',
      color: '#1D9DDA',
    },

    {
      id: '2',
      title: 'Early Access Jobs',
      count: 350,
      bgColor: '#FCFBF2',
      color: '#D8CB55',
    },

    {
      id: '3',
      title: 'See who shortlisted me',
      count: 350,
      bgColor: '#F2FCFC',
      color: '#C63C92',
    },

  ]

  otherFeatures = [
    {
      id: '1',
      title: 'See Matching Percentage',
      iconImage: 'match-percent'
    },

    {
      id: '2',
      title: 'Full Career Counseling Access',
      iconImage: 'career-counsel'
    },

    {
      id: '3',
      title: 'Full Length CV',
      iconImage: 'video-cv'
    },

    {
      id: '4',
      title: 'See job details after deadline',
      iconImage: 'jobdetails'
    },

    {
      id: '5',
      title: 'See Application Insight',
      iconImage: 'app-insight'
    },

    {
      id: '6',
      title: 'Track Employer Activity on Jobs',
      iconImage: 'track-employer'
    },

  ]

  filterControl = new FormControl('7')
}
