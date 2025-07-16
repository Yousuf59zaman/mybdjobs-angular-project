import { Component, inject, Input, OnInit, OnDestroy, NgZone, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { ModalService } from '../../../core/services/modal/modal.service';
import { CommonModule } from '@angular/common';
import { VideoCvDeleteWarningModalComponent } from '../video-cv-delete-warning-modal/video-cv-delete-warning-modal.component';
import { VideoCvRerecordWarningModalComponent } from '../video-cv-rerecord-warning-modal/video-cv-rerecord-warning-modal.component';

@Component({
  selector: 'app-video-cv-modal',
  imports:[CommonModule,VideoCvDeleteWarningModalComponent,VideoCvRerecordWarningModalComponent],
  templateUrl: './video-cv-modal.component.html',
  styleUrl: './video-cv-modal.component.scss'
})
export class VideoCvModalComponent implements OnInit, OnDestroy {
  isChecked = false;
  showError = false;
  @Input() saveDraft!: () => void;
  @Input() discardChanges!: () => void;
  @Output() close = new EventEmitter<string | void>();
  private modalService = inject(ModalService);
  playbackStarted = false;
  showDeleteConfirm = false;

  
private cdr = inject(ChangeDetectorRef);
  selectedLang = 'en';
  elapsedTime = 0;
  recordingTimer: any;
 maxRecordingTime = 30000;
  isRecordingPaused = false;

  @Input() questionText: string = 'Talk about your experience (if any), your skills and achievements.';
  @Input() questionNumber: number = 1;

  micOnIcon = 'images/microphone-01.svg';
  micOffIcon = 'images/MuteButton.svg';
  cameraOnIcon = 'images/video-recorder.svg';
  cameraOffIcon = 'images/VideoOffButton.svg';
  recordIcon = 'images/start-recording-camera-icon.svg';
  stopIcon = 'images/stop.svg'; 
  isRecording = false;
  isMicMuted = false;
  isCameraOff = false;
  mediaStream: MediaStream | null = null;
  mediaRecorder: MediaRecorder | null = null;
  recordedChunks: Blob[] = [];
  videoUrl: string | null = null;
  private ngZone = inject(NgZone);
  showRerecordConfirm = false;
  saveButtonClicked = false;


  async ngOnInit() {
    await this.setupCamera();
  }

  ngOnDestroy() {
    this.stopMedia();
     if (this.recordingTimer) {
    clearInterval(this.recordingTimer);
  }
  }

  async setupCamera() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      const videoElement = document.querySelector('video');
      if (videoElement) {
        videoElement.srcObject = this.mediaStream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  }

  toggleRecording() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }

hasStartedRecording = false;
private recordingStartTime: number = 0;
private pausedTime: number = 0;
private timerInterval: any;

startRecording() {
  this.isRecording = true;
  this.isRecordingPaused = false;
  this.recordingStartTime = Date.now() - this.pausedTime;
  this.pausedTime = 0;

  if (this.timerInterval) {
    clearInterval(this.timerInterval);
  }

  this.timerInterval = setInterval(() => {
    this.ngZone.run(() => {
      this.elapsedTime = Date.now() - this.recordingStartTime;
      this.cdr.detectChanges();

      if (this.elapsedTime >= this.maxRecordingTime) {
        this.stopRecording();
      }
    });
  }, 200);

  if (!this.mediaStream) return;
  this.recordedChunks = [];
  this.mediaRecorder = new MediaRecorder(this.mediaStream);

  this.mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      this.recordedChunks.push(event.data);
    }
  };

  this.mediaRecorder.onstop = () => {
    const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
    this.videoUrl = URL.createObjectURL(blob);
  };

  this.mediaRecorder.start();
}


formatRemainingTime(ms: number): string {
  const remainingMs = this.maxRecordingTime - ms;
  const totalSeconds = Math.max(Math.floor(remainingMs / 1000), 0);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}


get disableRecordingButton(): boolean {
  return this.isRecording
    ? this.elapsedTime >= this.maxRecordingTime || (this.isMicMuted && this.isCameraOff)
    : this.isMicMuted && this.isCameraOff;
}


get recordingButtonText(): string {
  if (this.isRecording) {
    if (this.elapsedTime >= this.maxRecordingTime) return 'Time Up';
    if (this.isMicMuted && this.isCameraOff) return 'Mic & Camera Off';
    return 'Stop Recording';
  } else {
    return this.isMicMuted && this.isCameraOff ? 'Mic & Camera Off' : 'Start Recording';
  }
}


recordedBlobs: Blob[] = [];



pauseRecording() {
  if (this.mediaRecorder?.state === 'recording') {
    this.mediaRecorder.pause();
    clearInterval(this.timerInterval);
    this.pausedTime = this.elapsedTime;
    this.isRecordingPaused = true;
  } else if (this.mediaRecorder?.state === 'paused') {
    this.mediaRecorder.resume();
    this.isRecordingPaused = false;
    this.recordingStartTime = Date.now() - this.pausedTime;
    this.timerInterval = setInterval(() => {
      this.ngZone.run(() => {
        this.elapsedTime = Date.now() - this.recordingStartTime;
        this.cdr.detectChanges();

        if (this.elapsedTime >= this.maxRecordingTime) {
          this.stopRecording();
        }
      });
    }, 200);
  }
}

formatElapsedTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}



saveRecording(): void {
  if (this.recordedBlobs?.length) {
    const blob = new Blob(this.recordedBlobs, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grabacion_${Date.now()}.webm`;
    a.click();
    URL.revokeObjectURL(url);
    console.log('Recording saved');
  }
}

 


onSaveButtonClick() {
  this.stopRecording();
  this.saveButtonClicked = true;
  setTimeout(() => {
    this.saveRecording();
    this.saveButtonClicked = false;
  }, 300);
}

stopRecording(): Promise<string | null> {
  return new Promise((resolve) => {
     if (this.recordingTimer) {
    clearInterval(this.recordingTimer);
    this.recordingTimer = null;
  }

    if (this.mediaRecorder && this.isRecording) {
    this.mediaRecorder.stop();
    this.isRecording = false;
    this.hasStartedRecording = false;
  }
  else {
      resolve(null);
    }
     this.elapsedTime = 0;
  });
  
}



  toggleMic() {
    if (!this.mediaStream) return;
    
    this.isMicMuted = !this.isMicMuted;
    this.mediaStream.getAudioTracks().forEach(track => {
      track.enabled = !this.isMicMuted;
    });
  }

  toggleCamera() {
    if (!this.mediaStream) return;
    
    this.isCameraOff = !this.isCameraOff;
    this.mediaStream.getVideoTracks().forEach(track => {
      track.enabled = !this.isCameraOff;
    });
  }

  

  stopMedia() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
    }
    if (this.videoUrl) {
      URL.revokeObjectURL(this.videoUrl);
    }
  }


  onCheckboxChange(event: Event) {
    this.isChecked = (event.target as HTMLInputElement).checked;
    this.showError = !this.isChecked;
  }

  oncloseModal() {
    if (this.discardChanges) {
      this.discardChanges();
    }
    this.modalService.closeModal();
  }

  onSave() {
    if (this.saveDraft) {
      this.saveDraft(); 
    }
    this.modalService.closeModal();
  }

  playRecordedVideo() {
  const videoElement = document.querySelector('video[src]') as HTMLVideoElement;
  if (videoElement) {
    this.playbackStarted = true;
    videoElement.play();
  }
}


reRecordVideo(): void {
  this.showRerecordConfirm = true;
}

confirmRerecord(): void {
  this.showRerecordConfirm = false;
  this.stopRecording();

  if (this.videoUrl) {
    URL.revokeObjectURL(this.videoUrl);
    this.videoUrl = null;
  }

  this.playbackStarted = false;
  this.isRecording = false;
  this.elapsedTime = 0;
  this.recordedChunks = [];
  this.stopMedia();

  this.setupCamera().then(() => {
    this.cdr.detectChanges();
  });
}

closeRerecordWarning(): void {
  this.showRerecordConfirm = false;
}



async saveAndExit(): Promise<void> {
  if (this.isRecording) {
    const finalVideoUrl = await this.stopRecording();
    if (finalVideoUrl) {
      this.close.emit(finalVideoUrl);
      this.modalService.closeModal();
    }
  } else if (this.videoUrl) {
    this.close.emit(this.videoUrl);
    this.modalService.closeModal();
  } else {
    alert('Please record a video before saving');
  }
}



deleteVideo(): void {
    this.showDeleteConfirm = true;
  }

  showDeleteWarningModal = false;

  openWarningModal() {
    this.showDeleteWarningModal = true;
  }

handleOkClick(): void {
  if (this.videoUrl) {
    URL.revokeObjectURL(this.videoUrl);
    this.videoUrl = null;
  }
  this.showDeleteConfirm = false;
  this.closeModal(); 
}

closeWarningModal(): void {
  this.showDeleteConfirm = false;  
}



 closeModal(): void {
    this.close.emit();
  }
  
  
}