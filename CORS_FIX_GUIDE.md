# 🔧 Решение проблемы CORS для Obsidian

## 🚨 Проблема

```
Access to fetch at 'https://time-36a7.onrender.com/api/upload-note' from origin 'app://obsidian.md' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## ✅ Решение

### 1. Создайте файл `.env.local`

Создайте файл `.env.local` в корне проекта со следующим содержимым:

```bash
# GitHub API для хранения данных
GITHUB_TOKEN=your_github_token_here
GITHUB_REPO=your_username/your_repo_name

# Obsidian API токен для авторизации
OBSIDIAN_API_TOKEN=your_secret_obsidian_token_here

# Публичные переменные
NEXT_PUBLIC_GITHUB_REPO_PATH=your_username/your_repo_name
```

**Важно:** Замените `your_secret_obsidian_token_here` на реальный токен, который вы будете использовать в плагине Obsidian.

### 2. Перезапустите сервер

```bash
npm run dev
```

### 3. Проверьте CORS настройки

Откройте в браузере: `http://localhost:3000/api/test-cors`

Должен вернуться JSON ответ.

### 4. Настройте плагин Obsidian

В настройках плагина Obsidian укажите:

- **URL сайта**: `http://localhost:3000` (для разработки) или `https://time-36a7.onrender.com` (для продакшена)
- **API токен**: То же значение, что указано в `OBSIDIAN_API_TOKEN`
- **Папка для синхронизации**: `Articles`

### 5. Тестирование

Создайте тестовую заметку в Obsidian:

```markdown
---
title: Тестовая заметка
slug: test-article
tags: [тест]
published: true
---

# Тестовая заметка

Это тестовая заметка для проверки CORS.
```

Сохраните файл и проверьте консоль Obsidian на наличие ошибок.

## 🔍 Что было исправлено

### 1. Middleware обновлен
- Добавлена правильная обработка preflight OPTIONS запросов
- CORS заголовки теперь добавляются ко всем API запросам

### 2. Next.js конфигурация
- Добавлены глобальные CORS заголовки в `next.config.js`
- Улучшена обработка заголовков для API routes

### 3. API endpoints упрощены
- Убрана дублирующая CORS логика из отдельных endpoints
- Используется единая система обработки CORS через middleware

### 4. Создан тестовый endpoint
- `/api/test-cors` для проверки CORS настроек

## 🐛 Если проблема остается

### Проверьте:

1. **Переменные окружения**: Убедитесь, что `.env.local` создан и содержит правильные значения
2. **Сервер запущен**: Перезапустите `npm run dev`
3. **URL в плагине**: Проверьте правильность URL в настройках плагина
4. **API токен**: Убедитесь, что токен в плагине совпадает с `OBSIDIAN_API_TOKEN`

### Тестирование через curl:

```bash
# Тест GET запроса
curl http://localhost:3000/api/test-cors

# Тест POST запроса
curl -X POST http://localhost:3000/api/test-cors \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'

# Тест OPTIONS запроса (preflight)
curl -X OPTIONS http://localhost:3000/api/test-cors \
  -H "Origin: app://obsidian.md" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type,Authorization" \
  -v
```

### Логи сервера

Проверьте консоль, где запущен `npm run dev`, на наличие ошибок.

## 🎉 Ожидаемый результат

После исправления:

1. ✅ Preflight OPTIONS запросы будут обрабатываться корректно
2. ✅ CORS заголовки будут присутствовать во всех ответах
3. ✅ Плагин Obsidian сможет отправлять запросы к API
4. ✅ Синхронизация заметок будет работать автоматически

## 📞 Поддержка

Если проблема не решается:

1. Проверьте логи сервера Next.js
2. Проверьте консоль разработчика в Obsidian
3. Убедитесь, что все файлы сохранены и сервер перезапущен
4. Проверьте, что переменные окружения загружены правильно 