import { Component, ElementRef, Renderer, ViewChild } from '@angular/core';
import { Events, Tabs } from 'ionic-angular';
import { HomePage } from '../home/home';
import { DiscoveryPage } from '../discovery/discovery';
import { ChatPage } from '../chat/chat';
import { NotificationPage } from '../notification/notification';
import { MorePage } from '../more/more';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  @ViewChild('myTabs') tabRef: Tabs;
  mb: any;
  tabHome = HomePage;
  tabDiscovery = DiscoveryPage;
  tabChat = ChatPage;
  tabNotification = NotificationPage;
  tabMore = MorePage;

  constructor(private elementRef: ElementRef, private renderer: Renderer, private event: Events) {

  }

  ionViewDidLoad() {
    let tabs = this.queryElement(this.elementRef.nativeElement, '.tabbar');
    this.event.subscribe('hideTabs', () => {
      this.renderer.setElementStyle(tabs, 'display', 'none');
      let SelectTab = this.tabRef.getSelected()._elementRef.nativeElement;
      let content = this.queryElement(SelectTab, '.scroll-content');
      this.mb = content.style['margin-bottom'];
      this.renderer.setElementStyle(content, 'margin-bottom', '0')
    });
    this.event.subscribe('showTabs', () => {
      this.renderer.setElementStyle(tabs, 'display', '');
      let SelectTab = this.tabRef.getSelected()._elementRef.nativeElement;
      let content = this.queryElement(SelectTab, '.scroll-content');
      this.renderer.setElementStyle(content, 'margin-bottom', this.mb)
    })
  }
  queryElement(elem: HTMLElement, q: string): HTMLElement {
    return <HTMLElement>elem.querySelector(q);
  }
}
