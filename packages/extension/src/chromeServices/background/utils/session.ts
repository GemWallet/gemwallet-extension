import { closeOffscreen, createOffscreen } from './offscreen';

const SESSION_LENGTH_MINUTES = 30;
const MILLISECONDS_IN_MINUTE = 60 * 1000;

export class Session {
  private static instance: Session | null = null;
  private password: string | null = null;
  private timeoutId: NodeJS.Timeout | null = null;

  private constructor() {}

  public static getInstance(): Session {
    if (!Session.instance) {
      Session.instance = new Session();
    }
    return Session.instance;
  }

  private isSessionActive(): boolean {
    return this.timeoutId !== null;
  }

  public startSession(password: string): void {
    this.endSession();

    this.password = password;
    createOffscreen();
    this.timeoutId = setTimeout(() => {
      this.endSession();
    }, SESSION_LENGTH_MINUTES * MILLISECONDS_IN_MINUTE);
  }

  public endSession(): void {
    this.password = null;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
      closeOffscreen();
    }
  }

  public getPassword(): string | null {
    if (!this.isSessionActive()) {
      this.endSession();
    }
    return this.password;
  }
}
