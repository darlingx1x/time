'use client';
import Script from "next/script";
import { useEffect, useRef } from "react";

export default function Home() {
  const widgetRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://telegram.org/js/telegram-widget.js?7";
    script.dataset.telegramLogin = "darlinxloginbot";
    script.dataset.size = "large";
    script.dataset.userpic = "false";
    script.dataset.requestAccess = "write";
    script.dataset.onauth = "onTelegramAuth(user)";
    widgetRef.current.appendChild(script);
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-6 neumorph p-6">Time Life Tracker</h1>
      <div className="neumorph p-6 flex flex-col items-center">
        <p className="mb-4 text-lg">Войдите через Telegram для начала работы:</p>
        {/* Telegram Login Widget */}
        <div ref={widgetRef} id="telegram-login-widget" />
      </div>
      <Script id="telegram-auth-client" strategy="beforeInteractive">
        {`
          window.onTelegramAuth = async function(user) {
            console.log('TG AUTH DATA:', user);
            const fullUser = { ...user };
            if (user.photo_url) fullUser.photo_url = user.photo_url;
            if (user.bio) fullUser.bio = user.bio;
            if (user.phone_number) fullUser.phone_number = user.phone_number;
            try {
              const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
              });
              let data = {};
              try {
                data = await res.json();
              } catch (e) {
                data = { error: 'Invalid JSON in response' };
              }
              console.log('AUTH RESPONSE:', res.status, data);
              if (res.ok) {
                localStorage.setItem('tgUser', JSON.stringify(fullUser));
                window.location.assign('/dashboard');
                setTimeout(() => {
                  if (window.location.pathname !== '/dashboard') {
                    window.location.replace('/dashboard');
                  }
                }, 500);
              } else {
                alert('Ошибка авторизации через Telegram: ' + (data.error || res.status));
              }
            } catch (err) {
              console.error('FETCH ERROR:', err);
              alert('Ошибка сети при авторизации через Telegram');
            }
          };
        `}
      </Script>
    </main>
  );
}
