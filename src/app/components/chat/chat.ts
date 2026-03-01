import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  computed,
  signal,
  afterNextRender,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';

export type Status = 'online' | 'away' | 'busy' | 'offline';

export interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  status: Status;
  role: string;
  unread: number;
}

export interface ChatMessage {
  id: string;
  contactId: string;
  from: 'me' | 'them';
  text: string;
  time: Date;
}

const AUTO_REPLIES: Record<string, string[]> = {
  alice: [
    'Sure, sounds good! 😊',
    'Let me check on that.',
    "Great idea! I'll get back to you soon.",
    'Thanks for the update!',
    'On it! Give me a few minutes.',
  ],
  bob: [
    'Roger that.',
    "I'll look into it.",
    'Can we schedule a call later?',
    'Got it, thanks!',
    'Working on it now.',
  ],
  carol: [
    'Hello! How can I help?',
    "I'll forward this to the team.",
    'Noted, thanks!',
    'Let me verify and get back to you.',
    'Thanks for letting me know.',
  ],
  david: [
    '👍',
    'On my way!',
    "Send me the file when you're ready.",
    'Will do!',
    'Sounds like a plan.',
  ],
  eve: [
    "I'm a bit busy right now, but I'll reply soon.",
    'Can this wait until after the stand-up?',
    'Noted!',
    "I'll ping you later.",
    'Busy right now — talk soon.',
  ],
};

const INITIAL_MESSAGES: ChatMessage[] = [
  // alice
  { id: 'm1', contactId: 'alice', from: 'them', text: 'Hey! Did you get a chance to review the PR?', time: new Date(Date.now() - 30 * 60_000) },
  { id: 'm2', contactId: 'alice', from: 'me', text: 'Yes, left a few comments. Mostly minor stuff.', time: new Date(Date.now() - 28 * 60_000) },
  { id: 'm3', contactId: 'alice', from: 'them', text: "Perfect, I'll address them now. Thanks! 🙌", time: new Date(Date.now() - 27 * 60_000) },
  // bob
  { id: 'm4', contactId: 'bob', from: 'them', text: 'Morning! The staging server seems slow today.', time: new Date(Date.now() - 120 * 60_000) },
  { id: 'm5', contactId: 'bob', from: 'me', text: 'I noticed that too. Let me restart the service.', time: new Date(Date.now() - 118 * 60_000) },
  { id: 'm6', contactId: 'bob', from: 'them', text: "Let me know once it's back up.", time: new Date(Date.now() - 117 * 60_000) },
  // carol
  { id: 'm7', contactId: 'carol', from: 'them', text: 'Hi, can you share the latest design specs?', time: new Date(Date.now() - 240 * 60_000) },
  { id: 'm8', contactId: 'carol', from: 'me', text: "Sure, I'll drop the Figma link here.", time: new Date(Date.now() - 238 * 60_000) },
  // david
  { id: 'm9', contactId: 'david', from: 'me', text: 'David, are you joining the 2pm call?', time: new Date(Date.now() - 45 * 60_000) },
  { id: 'm10', contactId: 'david', from: 'them', text: "Yes! I'll be there 👍", time: new Date(Date.now() - 44 * 60_000) },
  // eve
  { id: 'm11', contactId: 'eve', from: 'them', text: "Quick question — what's the sprint deadline?", time: new Date(Date.now() - 360 * 60_000) },
  { id: 'm12', contactId: 'eve', from: 'me', text: "End of Friday. Let's sync tomorrow morning?", time: new Date(Date.now() - 355 * 60_000) },
];

@Component({
  selector: 'app-chat',
  imports: [FormsModule, MatButtonModule, MatIconModule, MatTooltipModule, DatePipe],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Chat {
  @ViewChild('messageList') messageListRef!: ElementRef<HTMLElement>;

  contacts = signal<ChatContact[]>([
    { id: 'alice', name: 'Alice Johnson',   avatar: '', status: 'online',  role: 'Frontend Lead',   unread: 1 },
    { id: 'bob',   name: 'Bob Smith',       avatar: '', status: 'away',    role: 'Backend Dev',     unread: 0 },
    { id: 'carol', name: 'Carol Williams',  avatar: '', status: 'offline', role: 'UI/UX Designer',  unread: 0 },
    { id: 'david', name: 'David Lee',       avatar: '', status: 'online',  role: 'DevOps Engineer', unread: 0 },
    { id: 'eve',   name: 'Eve Martin',      avatar: '', status: 'busy',    role: 'QA Engineer',     unread: 2 },
  ]);

  messages = signal<ChatMessage[]>(INITIAL_MESSAGES);
  selectedContactId = signal<string>('alice');
  inputText = signal('');
  isTyping = signal(false);

  readonly selectedContact = computed(() =>
    this.contacts().find((c) => c.id === this.selectedContactId()) ?? null,
  );

  readonly currentMessages = computed(() =>
    this.messages().filter((m) => m.contactId === this.selectedContactId()),
  );

  constructor() {
    afterNextRender(() => this.scrollToBottom());
  }

  selectContact(id: string): void {
    this.selectedContactId.set(id);
    // Clear unread
    this.contacts.update((cs) =>
      cs.map((c) => (c.id === id ? { ...c, unread: 0 } : c)),
    );
    setTimeout(() => this.scrollToBottom(), 50);
  }

  send(): void {
    const text = this.inputText().trim();
    if (!text) return;
    const contactId = this.selectedContactId();

    const msg: ChatMessage = {
      id: 'msg-' + Date.now(),
      contactId,
      from: 'me',
      text,
      time: new Date(),
    };
    this.messages.update((ms) => [...ms, msg]);
    this.inputText.set('');
    setTimeout(() => this.scrollToBottom(), 30);

    // Simulate typing indicator + auto-reply
    const contact = this.selectedContact();
    if (contact && contact.status !== 'offline') {
      const delay = 800 + Math.random() * 1200;
      this.isTyping.set(true);
      setTimeout(() => {
        this.isTyping.set(false);
        const replies = AUTO_REPLIES[contactId] ?? ['👍'];
        const reply = replies[Math.floor(Math.random() * replies.length)];
        this.messages.update((ms) => [
          ...ms,
          {
            id: 'msg-' + Date.now(),
            contactId,
            from: 'them',
            text: reply,
            time: new Date(),
          },
        ]);
        setTimeout(() => this.scrollToBottom(), 30);
      }, delay);
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  initials(name: string): string {
    return name
      .split(' ')
      .map((p) => p[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  avatarColor(id: string): string {
    const colors = ['#4f46e5', '#0891b2', '#059669', '#d97706', '#dc2626', '#7c3aed', '#db2777'];
    let hash = 0;
    for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffff;
    return colors[hash % colors.length];
  }

  totalUnread = computed(() => this.contacts().reduce((s, c) => s + c.unread, 0));

  private scrollToBottom(): void {
    const el = this.messageListRef?.nativeElement;
    if (el) el.scrollTop = el.scrollHeight;
  }
}
