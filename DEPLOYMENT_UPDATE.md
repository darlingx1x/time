# 🚀 Обновление деплоя на Render.com

## 📋 Что нужно сделать

### 1. Проверьте переменные окружения на Render.com

В панели управления Render.com убедитесь, что настроены:

```bash
OBSIDIAN_API_TOKEN=your_secret_obsidian_token_here
GITHUB_TOKEN=your_github_token_here
GITHUB_REPO=your_username/your_repo_name
NEXT_PUBLIC_GITHUB_REPO_PATH=your_username/your_repo_name
```

### 2. Перезапустите приложение

После наших изменений в коде:

1. Зайдите в панель управления Render.com
2. Найдите ваше приложение `time-36a7`
3. Нажмите "Manual Deploy" → "Deploy latest commit"
4. Дождитесь завершения деплоя

### 3. Проверьте CORS

После деплоя протестируйте CORS:

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

В настройках плагина укажите:
- **URL сайта**: `https://time-36a7.onrender.com`
- **API токен**: Значение из `OBSIDIAN_API_TOKEN` на Render.com
- **Папка для синхронизации**: `Articles`

## 🎯 Ожидаемый результат

После обновления:
- ✅ CORS ошибки исчезнут
- ✅ Плагин Obsidian сможет синхронизировать заметки
- ✅ Preflight запросы будут обрабатываться корректно

## 🔍 Если проблема остается

1. **Проверьте логи Render.com** - в панели управления есть вкладка "Logs"
2. **Убедитесь, что деплой прошел успешно** - статус должен быть "Live"
3. **Проверьте переменные окружения** - они должны быть доступны приложению
4. **Тестируйте через curl** - убедитесь, что API отвечает корректно

## 📝 Примечание

Локальный файл `.env.local` нужен только если вы хотите тестировать плагин на `localhost:3000` во время разработки. Для продакшена достаточно переменных на Render.com. 