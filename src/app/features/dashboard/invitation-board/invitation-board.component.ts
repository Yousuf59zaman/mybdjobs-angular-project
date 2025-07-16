import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-invitation-board',
  imports: [CommonModule],
  templateUrl: './invitation-board.component.html',
  styleUrl: './invitation-board.component.scss',
  animations: [
    trigger('cardFadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(-20px)' })),
      ]),
    ]),
  ],
})
export class InvitationBoardComponent {
  invitationCard = signal([
    {
      id: '1',
      title: "Online Test",
      imageUrl: 'images/online-test.svg',
      count: 2
    },

    {
      id: '2',
      title: "Video Interview",
      imageUrl: 'images/video-interview.svg',
      count: 0
    },

    {
      id: '3',
      title: "General Interview",
      imageUrl: 'images/general-interview.svg',
      count: 0
    },

    {
      id: '4',
      title: "Personality Test by Voice",
      imageUrl: 'images/personality-test.svg',
      count: 0
    }


  ])

  ngOnInit(): void {
    // Auto-slide every 4 seconds
    // this.intervalId = setInterval(() => {
    //   this.next();
    // }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  inviationCarousel = signal([
    {
      id: 1,
      companyName: 'Khiyo',

    }

  ])

  cards = [
    {
      title: 'Khiyo',
      description:
        'You have been invited by The Great Company to participate in the “Khiyo” online assessment. This test is designed to evaluate your skills.',
      image: 'images/online-test.svg',
    },
    {
      title: 'Video Interview',
      description:
        'Complete your video interview at your convenience. This step helps the company assess your communication skills.',
      image: 'images/video-interview.svg',
    },
    {
      title: 'General Interview',
      description:
        'You are scheduled for a general interview round. Be prepared to discuss your experience, skills, and interest in the role.',
      image: 'images/general-interview.svg',
    },
    {
      title: 'Personality Test',
      description:
        'Take this personality test to help The Great Company understand your work style, strengths, and how you collaborate in a team.',
      image: 'images/personality-test.svg',
    },
  ];


  activeIndex = signal(0);
  private intervalId: any;
  next() {
    this.activeIndex.update(i => (i + 1) % this.cards.length);
  }

  prev() {
    this.activeIndex.update(i => (i - 1 + this.cards.length) % this.cards.length);
  }

  goTo(index: number) {
    this.activeIndex.set(index);
  }

}
