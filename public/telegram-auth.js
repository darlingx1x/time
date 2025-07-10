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
      document.cookie = `telegram_id=${user.id}; path=/; max-age=2592000`;
      window.open('/dashboard', '_self');
    } else {
      alert('Ошибка авторизации через Telegram: ' + (data.error || res.status));
    }
  } catch (err) {
    console.error('FETCH ERROR:', err);
    alert('Ошибка сети при авторизации через Telegram');
  }
};
