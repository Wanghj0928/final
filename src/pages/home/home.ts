import { Component } from '@angular/core';
import { NavController, ModalController, Tabs, LoadingController, Events } from 'ionic-angular';
import { Keyboard } from '@ionic-native/Keyboard'
import { QuestionPage } from "../question/question";
import { BaseUI } from "../../common/baseui";
import { RestProvider } from '../../providers/rest/rest';
import { DetailsPage } from '../details/details';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage extends BaseUI {

  feeds: string[];
  errorMessage: any;

  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public rest: RestProvider,
    public event: Events,
    public keyboard: Keyboard) {
    super();
  }

  ionViewDidLoad() {
    this.keyboard.onKeyboardShow().subscribe(() => this.event.publish('hideTabs'));
    this.keyboard.onKeyboardHide().subscribe(() => this.event.publish('showTabs'));
    this.getFeeds();
  }

  gotoQuestion() {
    var modal = this.modalCtrl.create(QuestionPage);
    modal.present();
  }

  gotoChat() {
    this.selectTab(2);
  }

  /**
   * 选定指定的 tab
   * 
   * @param {number} index 
   * @memberof HomePage
   */
  selectTab(index: number) {
    var t: Tabs = this.navCtrl.parent;
    t.select(index);
  }

  getFeeds() {
    var loading = super.showLoading(this.loadingCtrl, "加载中...");
    this.rest.getFeeds()
      .subscribe(
      f => {
        this.feeds = f;
        loading.dismiss();
      },
      error => this.errorMessage = <any>error);
  }

  gotoDetails(questionId) {
    this.navCtrl.push(DetailsPage, { id: questionId });
  }
}