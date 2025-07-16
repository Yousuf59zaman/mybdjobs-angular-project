import { NgClass, NgStyle } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { RingChartComponent } from "../../../shared/components/ring-chart/ring-chart.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-right-panel',
  imports: [NgClass, NgStyle, RingChartComponent, RouterLink],
  templateUrl: './dashboard-right-panel.component.html',
  styleUrl: './dashboard-right-panel.component.scss'
})
export class DashboardRightPanelComponent {
  isVideoCvAvailable = signal(true);
  isCustomizedCvAvailable = signal(true);
  buttons = ['Bdjobs Profile', 'Video CV', 'Customized CV'];
  selectedBtn = 'Bdjobs Profile';
  profileProgression = 75;
  videoCvProgression = -100;

  profileSection = [
    {
      id: "#",
      title: 'Personal Details',
      isCompleted: true,
      url: '/edit-profile',
      queryParams: {
        tab: 'pi',
        from: 'pd'
      }
    },

    {
      id: "#",
      title: 'Professional Qualification',
      isCompleted: false,
      url: '/edit-profile',
      queryParams: {
        tab: 'ed',
        from: 'pc'
      }
    },

    {
      id: "#",
      title: 'Academic Qualification',
      isCompleted: true,
      url: '/edit-profile',
      queryParams: {
        tab: 'ed',
        from: 'ac'
      }
    },

    {
      id: "#",
      title: 'Experience',
      isCompleted: false,
      url: '/edit-profile',
      queryParams: {
        tab: 'em',
        from: 'eh'
      }
    },

    {
      id: "#",
      title: 'Reference',
      isCompleted: true,
      url: '/edit-profile',
      queryParams: {
        tab: 'em',
        from: 'ref'
      }
    },

    {
      id: "#",
      title: 'Training',
      isCompleted: true,
      url: '/edit-profile',
      queryParams: {
        tab: 'ed',
        from: 'ts'
      }
    },

    {
      id: "#",
      title: 'Specialization',
      isCompleted: true,
      url: '/edit-profile',
      queryParams: {
        tab: 'oi',
        from: 'skills'
      }
    },

    {
      id: "#",
      title: 'Photograph',
      isCompleted: true
    },

  ]

  videoCvSection = [
    {
      id: "#",
      title: 'Introduce yourself, including your education.',
      isCompleted: true
    },

    {
      id: "#",
      title: 'Talk about your experience (if any), your skills and achievements.',
      isCompleted: false
    },

    {
      id: "#",
      title: 'Your long term career objective. Where you want to be after 5 years?',
      isCompleted: false
    }
  ]




}
