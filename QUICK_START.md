# 🚀 Быстрый старт: Интеграция Obsidian ↔ Next.js

## ⚡ За 5 минут

### 1. Настройте переменные окружения
Создайте файл `.env.local`:
```bash
GITHUB_TOKEN=your_github_token_here
GITHUB_REPO=your_username/your_repo_name
OBSIDIAN_API_TOKEN=your_secret_obsidian_token_here
NEXT_PUBLIC_GITHUB_REPO_PATH=your_username/your_repo_name
```

### 2. Запустите сайт
```bash
npm install
npm run dev
```

### 3. Установите плагин Obsidian
1. Скопируйте папку `obsidian-plugin` в:
   ```
   {vault}/.obsidian/plugins/nextjs-sync/
   ```
2. Включите плагин в настройках Obsidian
3. Настройте URL сайта и API токен

### 4. Создайте тестовую заметку
1. Создайте папку `Articles` в Obsidian
2. Создайте файл с frontmatter:
```markdown
---
title: Тестовая заметка
slug: test-article
tags: [тест]
published: true
---

# Тестовая заметка

Это тестовая заметка для проверки интеграции.
```
3. Сохраните файл - он автоматически синхронизируется!

## 🌐 Проверьте результат
- Список статей: `http://localhost:3000/articles`
- Отдельная статья: `http://localhost:3000/articles/test-article`

## 📱 Команды плагина
- `Синхронизировать текущий файл`
- `Синхронизировать все файлы`
- `Показать статус синхронизации`

## 🎉 Готово!
Теперь ваши заметки из Obsidian автоматически синхронизируются с сайтом!

---

**📚 Подробная документация**: `README_OBSIDIAN_INTEGRATION.md`
**🧪 Тестирование**: `TESTING_GUIDE.md` 