import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController, ToastController, LoadingController, Events } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { Storage } from '@ionic/storage';
import { BaseUI } from '../../common/baseui';
import { RestProvider } from '../../providers/rest/rest';
import { HeadfacePage } from '../headface/headface';

//@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage extends BaseUI {

  headface: string = "http://img.mukewang.com/user/57a322f00001e4ae02560256-40-40.jpg?";
  nickname: string = "加载中...";
  errorMessage: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public loadCtrl: LoadingController,
    public rest: RestProvider,
    public toastCtrl: ToastController,
    public storage: Storage,
    private event: Events,
    private keyboard: Keyboard) {
    super();
  }

  ionViewDidLoad() {
    this.keyboard.onKeyboardShow().subscribe(() => this.event.publish('hideTabs'));
    this.keyboard.onKeyboardHide().subscribe(() => this.event.publish('showTabs'));
  }

  ionViewDidEnter() {
    this.loadUserPage();
  }

  loadUserPage() {
    this.storage.get('UserId').then((val) => {
      if (val != null) {
        //加载用户数据
        var loading = super.showLoading(this.loadCtrl, "加载中...");
        this.rest.getUserInfo(val)
          .subscribe(
          userinfo => {
            this.nickname = userinfo["UserNickName"];
            this.headface = userinfo["UserHeadface"] + "?" + (new Date()).valueOf();
            loading.dismiss();
          },
          error => this.errorMessage = <any>error);
      }
    });
  }

  updateNickName() {
    var that = this;
    this.storage.get('UserId').then((val) => {
      if (val != null) {
        var loading = super.showLoading(this.loadCtrl, "修改中...");
        this.rest.updateNickName(val, this.nickname)
          .subscribe(
          f => {
            if (f["Status"] == "OK") {
              loading.dismiss();
              super.showToast(this.toastCtrl, "昵称修改成功。");
              let callBack = this.navParams.get('callBack');
              let target = this.navParams.get('target');
              console.log(target);
              callBack(target, this.nickname).then(function (result) {
                that.navCtrl.pop();
              }, function (err) {
                console.log(err);
              })
            }
            // (result) => {alert(1);
            //   this.navCtrl.pop();
            // }, (err) => {
            //   console.log(err);
            // }
            // else {
            //   loading.dismiss();
            //   super.showToast(this.toastCtrl, f["StatusContent"]);
            // }
          },
          error => this.errorMessage = <any>error);
      }
    });
  }

  logout() {
    this.storage.remove('UserId');
    this.viewCtrl.dismiss();
  }

  gotoHeadface() {
    this.navCtrl.push(HeadfacePage);
  }
}
