import { Component } from '@angular/core';
import { faInbox } from '@fortawesome/free-solid-svg-icons';
import { faEnvelopeCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { faShareFromSquare } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import {Message} from "./message.model";
import {GameService} from "../shared/game.service";

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent {
  faInbox = faInbox;
  faEnvelopeCircleCheck = faEnvelopeCircleCheck;
  faSnareFromSquare = faShareFromSquare;
  faTrash = faTrash;
  displayMessages: Message[];
  gameService: GameService;

  constructor(private gameService2: GameService) {
    this.displayMessages = [];
    this.gameService = gameService2;
    this.onInboxSelect();
  }

  onInboxSelect(): void {
    this.displayMessages = this.gameService.getGame().messages.filter(this.checkForInbox);
  }

  checkForInbox(message) {
    return message.folder.valueOf() === "INBOX";
  }

  onOutboxSelect(): void {
    this.displayMessages = this.gameService.getGame().messages.filter(this.checkForOutbox);
  }

  checkForOutbox(message) {
    return message.folder.valueOf() === "OUTBOX";
  }

  onSentSelect(): void {
    this.displayMessages = this.gameService.getGame().messages.filter(this.checkForSentItems);
  }

  checkForSentItems(message) {
    return message.folder.valueOf() === "SENT ITEMS";
  }

  onTrashSelect(): void {
    this.displayMessages = this.gameService.getGame().messages.filter(this.checkForTrash);
  }

  checkForTrash(message) {
    return message.folder.valueOf() === "TRASH";
  }
}
