# 🔧 Решение проблемы CORS для Obsidian

## 🚨 Проблема

```
Access to fetch at 'https://time-36a7.onrender.com/api/upload-note' from origin 'app://obsidian.md' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## ✅ Решение

### 1. Проверьте переменные окружения на Render.com

В панели управления Render.com убедитесь, что настроены:

```bash
OBSIDIAN_API_TOKEN=your_secret_obsidian_token_here
GITHUB_TOKEN=your_github_token_here
GITHUB_REPO=your_username/your_repo_name
NEXT_PUBLIC_GITHUB_REPO_PATH=your_username/your_repo_name
```

### 2. Перезапустите приложение на Render.com

После наших изменений в коде:

1. Зайдите в панель управления Render.com
2. Найдите ваше приложение `time-36a7`
3. Нажмите "Manual Deploy" → "Deploy latest commit"
4. Дождитесь завершения деплоя

### 3. Проверьте CORS настройки

После деплоя протестируйте:

```bash
# Тест GET запроса
curl https://time-36a7.onrender.com/api/test-cors

# Тест OPTIONS запроса (preflight)
curl -X OPTIONS https://time-36a7.onrender.com/api/test-cors \
  -H "Origin: app://obsidian.md" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type,Authorization" \
  -v
```

### 4. Настройте плагин Obsidian

В настройках плагина Obsidian укажите:

- **URL сайта**: `https://time-36a7.onrender.com`
- **API токен**: Значение из `OBSIDIAN_API_TOKEN` на Render.com
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

1. **Переменные окружения на Render.com**: Убедитесь, что `OBSIDIAN_API_TOKEN` настроен
2. **Деплой завершен**: Статус приложения должен быть "Live"
3. **URL в плагине**: Проверьте правильность URL в настройках плагина
4. **API токен**: Убедитесь, что токен в плагине совпадает с `OBSIDIAN_API_TOKEN`

### Логи Render.com

Проверьте логи в панели управления Render.com на наличие ошибок.

## 🎉 Ожидаемый результат

После исправления:

1. ✅ Preflight OPTIONS запросы будут обрабатываться корректно
2. ✅ CORS заголовки будут присутствовать во всех ответах
3. ✅ Плагин Obsidian сможет отправлять запросы к API
4. ✅ Синхронизация заметок будет работать автоматически

## 📞 Поддержка

Если проблема не решается:

1. Проверьте логи в панели управления Render.com
2. Проверьте консоль разработчика в Obsidian
3. Убедитесь, что деплой прошел успешно
4. Проверьте, что переменные окружения доступны приложению

## 📝 Примечание

Локальный файл `.env.local` нужен только для разработки на `localhost:3000`. Для продакшена на Render.com достаточно переменных окружения в панели управления. 