import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@src/environments/environment';
import {
  createClient,
  type AuthChangeEvent,
  type AuthSession,
  type Session,
  type SupabaseClient,
  type User,
} from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly supabase: SupabaseClient = createClient(
    environment.supabaseUrl,
    environment.supabaseKey,
  );

  private router = inject(Router);

  private _session: AuthSession | null = null;

  client(): SupabaseClient {
    return this.supabase;
  }

  /** Get the current session or null if no session.
   * Note: this does not auto-update, use onAuthStateChange() to listen for changes.
   */
  async getSession(): Promise<AuthSession | null> {
    try {
      const { data } = await this.supabase.auth.getSession();
      this._session = data.session ?? null;

      return this._session;
    } catch (e) {
      return null;
    }
  }

  /**
   * Sign up a new user using email + password.
   * Returns the session (if any) and any error from Supabase.
   */
  async signUp(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });
    this._session = (data?.session as AuthSession) ?? null;
    return { session: this._session, error };
  }

  /**
   * Sign in an existing user using email + password.
   */
  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    this._session = (data?.session as AuthSession) ?? null;
    return { session: this._session, error };
  }

  /**
   * Sign out the current user.
   */
  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (!error) {
      this.router.navigate(['/auth/login']);

      this._session = null;
    }
    return { error };
  }

  /**
   * Return the current user (if signed in) or null.
   */
  getUser() {
    return (this._session as unknown as { user?: User })?.user ?? null;
  }

  /**
   * Subscribe to auth state changes. Returns the subscription which can be
   * unsubscribed if needed: const sub = service.onAuthStateChange(cb); sub.data.subscription.unsubscribe();
   */
  onAuthStateChange(
    cb: (event: AuthChangeEvent, session: Session | null) => void,
  ) {
    return this.supabase.auth.onAuthStateChange((event, session) => {
      this._session = session ?? null;
      try {
        cb(event, session ?? null);
      } catch (e) {}
    });
  }
}
