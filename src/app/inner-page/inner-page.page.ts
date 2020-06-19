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
  totalTimePlayed: any
  @ViewChild('range', { static: false }) range: IonRange;
  progress: any;
  duration: any;
  constructor(
    public loadingController: LoadingController,
    private route: ActivatedRoute,
    public platform: Platform,
  ) {
    this.checkForType();
  }

  ionViewWillLeave() {
    this.player.stop();
  }

  ngOnInit() {
  }

  checkForType() {
    this.type = this.route.snapshot.params.type;

    if (this.type == 'music') {
      this.musicPath = this.route.snapshot.params.name
      this.musicPath = '../../assets/music/' + this.musicPath;
      this.start();
    }
  }

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
      onplay: async () => {
        await loading.dismiss();
        console.log('ON PLAY')
        this.isPlaying = true;
        this.duration = await this.display(this.player.duration());
        console.log("DURATION",this.duration)
        this.activeTrack = this.musicPath;
        this.updateProgress();
      },
      onend: () => {
        console.log('ON END');
        this.player.stop();
        this.isPlaying = false;
      }
    });

    this.player.play();
  }

  togglePlayer(pause) {
    this.isPlaying = !pause;
    if (pause) {
      this.player.pause();
    } else {
      this.player.play();
    }
  }

  seek(value) {
    console.log('sdsd',value)
    let newValue = +value;
    let duration = this.player.duration();
    this.player.seek(duration * (newValue / 100));
  }

  async updateProgress() {
    let seek = this.player.seek();
    this.totalTimePlayed = await this.display(Math.floor(seek));
    // console.log("TIME PLAYED",totalTimePassed)
    this.progress = (seek / this.player.duration()) * 100 || 0;
    setTimeout(() => {
      this.updateProgress();
    }, 1000);
  }

  move(type,progress) {
    console.log(type)
    let newValue = +progress;
    let duration = this.player.duration();
    if (type == 'forward') {
      let currentTime = duration * (newValue / 100);
      this.player.seek(currentTime + 15);
      console.log("CURRENT TIME", currentTime);
      console.log("FORWARDED TIME", currentTime + 15);
    } else if (type == 'backward') {
      let currentTime = duration * (newValue / 100);
      this.player.seek(currentTime - 15);
      console.log("CURRENT TIME", currentTime);
      console.log("BACKWARDED TIME", currentTime - 15);
    }
  }

  display (seconds) {
    const format = val => `0${Math.floor(val)}`.slice(-2)
    // const hours = seconds / 3600
    const minutes = (seconds % 3600) / 60
  
    return [minutes, seconds % 60].map(format).join(':')
  }
}
