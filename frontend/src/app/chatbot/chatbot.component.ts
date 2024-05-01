import { Component, ElementRef, ViewChild, AfterViewChecked, NgZone } from '@angular/core';
import { ApiService } from '../api.service';

declare var webkitSpeechRecognition: any;

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})

export class ChatbotComponent implements AfterViewChecked {
  chatboxVisible: boolean = false;
  messages: { sender: 'user' | 'bot', content: string }[] = [];
  userInput: string = '';
  recognition: any;
  isListening: boolean = false;

  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  constructor(private apiService: ApiService, private ngZone: NgZone) {
    this.setupSpeechRecognition();
  }


  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  speak(text: string) {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  }

  setupSpeechRecognition() {
    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log('Recognised:', transcript);
      this.ngZone.run(() => {
        this.userInput = transcript;
        this.sendMessage();
      });
    };

    // Handlers for start, error, and end of recognition
    this.recognition.onstart = () => { this.isListening = true; };
    this.recognition.onerror = (event: any) => { console.error('Speech recognition error', event); };
    this.recognition.onend = () => { this.isListening = false; };
  }
  

  toggleListening(): void {
    if (this.isListening) {
      this.recognition.stop();
      this.isListening = false; // Update the state immediately
    } else {
      this.recognition.start();
      this.isListening = true; // Update the state immediately
      this.userInput = ''; // Clear the input to ready it for new input
    }
  }


  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  toggleChatbox(): void {
    this.chatboxVisible = !this.chatboxVisible;
    if (this.chatboxVisible) {
      this.messages.push({ sender: 'bot', content: 'Hi! How can I help you today?' });
    }
  }

  sendMessage(): void {
    if (this.userInput.trim()) {
      this.messages.push({ sender: 'user', content: this.userInput });
      this.apiService.sendMessageToChatbot(this.userInput).subscribe({
        next: (response) => {
          if (response && response.response) {
            this.messages.push({ sender: 'bot', content: response.response });
            this.userInput = ''; // Clear input after message is sent
            // Check if the response is the final feedback thank you message
            if (response.response.includes("Thank you for your feedback")) {
              setTimeout(() => this.toggleChatbox(), 2000); // Closes the chatbox after 2 seconds
            }
          } else {
            console.error('Invalid response format:', response);
          }
        },
        error: (err) => console.error('Error sending message to chatbot:', err)
      });
    }
  }
  


}