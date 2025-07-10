import Script from "next/script";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-6 neumorph p-6">Time Life Tracker</h1>
      <div className="neumorph p-6 flex flex-col items-center">
        <p className="mb-4 text-lg">Войдите через Telegram для начала работы:</p>
        {/* Telegram Login Widget */}
        <div id="telegram-login-widget">
          <Script
            src="https://telegram.org/js/telegram-widget.js?7"
            strategy="afterInteractive"
            data-telegram-login="@darlinxloginbot"
            data-size="large"
            data-onauth="onTelegramAuth(user)"
            data-request-access="write"
          />
        </div>
      </div>
      <Script id="telegram-auth-client" strategy="afterInteractive">
        {`
          window.onTelegramAuth = async function(user) {
            const fullUser = { ...user };
            if (user.photo_url) fullUser.photo_url = user.photo_url;
            if (user.bio) fullUser.bio = user.bio;
            if (user.phone_number) fullUser.phone_number = user.phone_number;
            const res = await fetch('/api/auth', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(user)
            });
            if (res.ok) {
              localStorage.setItem('tgUser', JSON.stringify(fullUser));
              window.location.href = '/dashboard';
            } else {
              alert('Ошибка авторизации через Telegram');
            }
          };
        `}
      </Script>
    </main>
  );
}
