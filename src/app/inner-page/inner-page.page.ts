import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform, IonRange } from '@ionic/angular';
import { Howl, Howler } from 'howler';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-inner-page',
  templateUrl: './inner-page.page.html',
  styleUrls: ['./inner-page.page.scss'],
})
export class InnerPagePage implements OnInit {
  musicPath: any;
  type: any;
  sound: any;
  playlist = [];
  activeTrack = null;
  player: any;
  isPlaying = false;
  totalTimePlayed: any = "00:00"
  @ViewChild('range', { static: false }) range: IonRange;
  progress = 0;
  duration: any = "00:00";
  language: string;
  constructor(
    public loadingController: LoadingController,
    private route: ActivatedRoute,
    public platform: Platform,
  ) {
    this.checkForType();
    // route.queryParams.subscribe(params => {
    //   if (params.type === 'music') {
    //     // this.musicPath = params.name
    //     this.musicPath = `assets/music/${params.name}`;
    //     this.start();
    //   }
    // })
  }

  ionViewWillLeave() {
    if (this.type == 'music') {
      this.player.stop();
    }
  }

  ionViewWillEnter() {
    this.language = localStorage.getItem('language');
  }
  ngOnInit() {
  }

  //check for type if music/text
  checkForType() {
    this.type = this.route.snapshot.params.type;

    if (this.type == 'music') {
      this.musicPath = this.route.snapshot.params.name
      this.musicPath = 'assets/music/' + this.musicPath;
      this.start();
    }
  }

  //creating audio object and playing audio file 
  async start() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Loading audio. Please wait...'
    });
    await loading.present();

    if (this.player) {
      this.player.stop();
    }
    this.player = new Howl({
      src: [this.musicPath],
      html5: true,
      onplay: async () => {
        await loading.dismiss();
        this.isPlaying = true;
        this.duration = await this.display(this.player.duration());
        this.activeTrack = this.musicPath;
        this.updateProgress();
      },
      onend: () => {
        this.player.stop();
        this.isPlaying = false;
      }
    });

    this.player.play();
  }

  //function for play & pause 
  togglePlayer(pause) {
    this.isPlaying = !pause;
    if (pause) {
      this.player.pause();
    } else {
      this.player.play();
    }
  }

  //for adding some seconds to current value
  seek(value) {
    let newValue = +value;
    let duration = this.player.duration();
    this.player.seek(duration * (newValue / 100));
  }

  //updating progress bar for audio file
  async updateProgress() {
    let seek = this.player.seek();
    this.totalTimePlayed = await this.display(Math.floor(seek));
    this.progress = (seek / this.player.duration()) * 100 || 0;
    setTimeout(() => {
      this.updateProgress();
    }, 1000);
  }

  //moving backward or forward
  move(type, progress) {
    let newValue = +progress;
    let duration = this.player.duration();
    if (type == 'forward') {
      let currentTime = duration * (newValue / 100);
      this.player.seek(currentTime + 15);
    } else if (type == 'backward') {
      let currentTime = duration * (newValue / 100);
      this.player.seek(currentTime - 15);
    }
  }

  //making displayable format for audio timer
  display(seconds) {
    const format = val => `0${Math.floor(val)}`.slice(-2)
    // const hours = seconds / 3600
    const minutes = (seconds % 3600) / 60

    return [minutes, seconds % 60].map(format).join(':')
  }
}
