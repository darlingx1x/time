const { Plugin, Notice, PluginSettingTab, Setting } = require('obsidian');

class NextJsSyncSettingTab extends PluginSettingTab {
	constructor(app, plugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display() {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Настройки Next.js Sync' });

		new Setting(containerEl)
			.setName('Включить синхронизацию')
			.setDesc('Активировать автоматическую синхронизацию с сайтом')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enabled)
				.onChange(async (value) => {
					this.plugin.settings.enabled = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('URL сайта')
			.setDesc('Полный URL вашего Next.js сайта (например: https://mysite.com)')
			.addText(text => text
				.setPlaceholder('https://mysite.com')
				.setValue(this.plugin.settings.websiteUrl)
				.onChange(async (value) => {
					this.plugin.settings.websiteUrl = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('API токен')
			.setDesc('Токен для авторизации API запросов')
			.addText(text => text
				.setPlaceholder('your-secret-token')
				.setValue(this.plugin.settings.apiToken)
				.onChange(async (value) => {
					this.plugin.settings.apiToken = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Папка для синхронизации')
			.setDesc('Путь к папке с заметками для синхронизации')
			.addText(text => text
				.setPlaceholder('Articles')
				.setValue(this.plugin.settings.folderPath)
				.onChange(async (value) => {
					this.plugin.settings.folderPath = value;
					await this.plugin.saveSettings();
				}));

		containerEl.createEl('h3', { text: 'Информация' });

		const infoEl = containerEl.createEl('div', { cls: 'setting-item-description' });
		infoEl.innerHTML = `
			<p><strong>Как использовать:</strong></p>
			<ol>
				<li>Создайте папку для статей в вашем vault</li>
				<li>Укажите путь к этой папке в настройках</li>
				<li>Добавьте URL вашего сайта и API токен</li>
				<li>Включите синхронизацию</li>
				<li>Создавайте заметки с frontmatter для метаданных</li>
			</ol>
			
			<p><strong>Пример frontmatter:</strong></p>
			<pre>---
title: Моя статья
slug: my-article
tags: [программирование, nextjs]
description: Описание статьи
published: true
---</pre>
		`;
	}
}

class NextJsSyncPlugin extends Plugin {
	async onload() {
		new Notice('Next.js Sync плагин активирован!');
		console.log('Next.js Sync плагин активирован!');
		this.settings = {
			enabled: false,
			websiteUrl: '',
			apiToken: '',
			folderPath: '',
			syncOnSave: true,
			syncOnClose: false,
			syncInterval: 5,
			autoPull: false,
		};

		await this.loadSettings();
		
		// Команды
		this.addCommands();

		// События файлов
		this.registerEvent(
			this.app.vault.on('create', (file) => {
				if (this.shouldSyncFile(file)) {
					this.syncFile(file);
				}
			})
		);

		this.registerEvent(
			this.app.vault.on('modify', (file) => {
				if (this.shouldSyncFile(file)) {
					this.syncFile(file);
				}
			})
		);

		this.registerEvent(
			this.app.vault.on('delete', (file) => {
				if (this.shouldSyncFile(file)) {
					this.deleteFile(file);
				}
			})
		);

		// Настройки
		this.addSettingTab(new NextJsSyncSettingTab(this.app, this));

		console.log('Плагин Next.js Sync загружен');
	}

	onunload() {
		console.log('Плагин Next.js Sync выгружен');
	}

	async loadSettings() {
		this.settings = Object.assign({}, this.settings, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	addCommands() {
		this.addCommand({
			id: 'sync-current-file',
			name: 'Синхронизировать текущий файл',
			editorCallback: (editor, view) => {
				const file = view.file;
				if (file && this.shouldSyncFile(file)) {
					this.syncFile(file);
				}
			}
		});

		this.addCommand({
			id: 'sync-all-files',
			name: 'Синхронизировать все файлы',
			callback: () => {
				this.syncAllFiles();
			}
		});

		this.addCommand({
			id: 'show-sync-status',
			name: 'Показать статус синхронизации',
			callback: () => {
				this.showStatus();
			}
		});
	}

	shouldSyncFile(file) {
		if (!this.settings.enabled || !this.settings.folderPath) {
			return false;
		}

		// Проверяем, что это файл, а не папка
		if (file.children) {
			return false;
		}

		return file.path.startsWith(this.settings.folderPath);
	}

	async syncFile(file) {
		if (!this.settings.enabled || !this.settings.websiteUrl || !this.settings.apiToken) {
			return;
		}

		// Дополнительная проверка, что это файл, а не папка
		if (file.children) {
			console.log(`Пропускаю папку: ${file.path}`);
			return;
		}

		try {
			const fullContent = await this.app.vault.read(file);
			const frontmatter = this.parseFrontmatter(fullContent);
			const content = this.extractContent(fullContent); // Извлекаем содержимое без frontmatter
			const slug = this.extractSlug(file, frontmatter);
			const title = frontmatter.title || file.basename;

			const noteData = {
				slug,
				title,
				content,
				frontmatter,
				updatedAt: new Date().toISOString()
			};

			const response = await fetch(`${this.settings.websiteUrl}/api/upload-note`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${this.settings.apiToken}`
				},
				body: JSON.stringify(noteData)
			});

			if (response.ok) {
				console.log(`✅ Синхронизирована заметка: ${title}`);
				new Notice(`Синхронизирована заметка: ${title}`);
			} else {
				const error = await response.text();
				console.log(`❌ Ошибка синхронизации: ${error}`);
				new Notice(`Ошибка синхронизации: ${error}`);
			}
		} catch (error) {
			console.log(`❌ Ошибка синхронизации: ${error}`);
			new Notice(`Ошибка синхронизации: ${error}`);
		}
	}

	async deleteFile(file) {
		if (!this.settings.enabled || !this.settings.websiteUrl || !this.settings.apiToken) {
			return;
		}

		try {
			const slug = this.extractSlug(file, {});
			
			const response = await fetch(`${this.settings.websiteUrl}/api/delete-note?slug=${slug}`, {
				method: 'DELETE',
				headers: {
					'Authorization': `Bearer ${this.settings.apiToken}`
				}
			});

			if (response.ok) {
				console.log(`🗑️ Удалена заметка: ${file.basename}`);
				new Notice(`Удалена заметка: ${file.basename}`);
			} else {
				const error = await response.text();
				console.log(`❌ Ошибка удаления: ${error}`);
				new Notice(`Ошибка удаления: ${error}`);
			}
		} catch (error) {
			console.log(`❌ Ошибка удаления: ${error}`);
			new Notice(`Ошибка удаления: ${error}`);
		}
	}

	async syncAllFiles() {
		if (!this.settings.enabled || !this.settings.folderPath) {
			new Notice('Синхронизация отключена или не указана папка');
			return;
		}

		const files = this.app.vault.getMarkdownFiles().filter(file => 
			file.path.startsWith(this.settings.folderPath) && !file.children
		);

		console.log(`🔄 Начинаю синхронизацию ${files.length} файлов...`);
		new Notice(`Синхронизация ${files.length} файлов...`);

		let successCount = 0;
		let errorCount = 0;

		for (const file of files) {
			try {
				await this.syncFile(file);
				successCount++;
			} catch (error) {
				errorCount++;
				console.log(`❌ Ошибка синхронизации ${file.basename}: ${error}`);
			}
		}

		console.log(`✅ Синхронизация завершена: ${successCount} успешно, ${errorCount} ошибок`);
		new Notice(`Синхронизация завершена: ${successCount} успешно, ${errorCount} ошибок`);
	}

	showStatus() {
		const status = this.settings.enabled ? '✅ Включена' : '❌ Отключена';
		const folder = this.settings.folderPath || 'Не указана';
		const url = this.settings.websiteUrl || 'Не указан';
		
		new Notice(`Статус синхронизации:\n${status}\nПапка: ${folder}\nURL: ${url}`);
	}

	parseFrontmatter(content) {
		const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
		const match = content.match(frontmatterRegex);
		
		if (!match) {
			return {};
		}

		const frontmatterText = match[1];
		const frontmatter = {};

		const lines = frontmatterText.split('\n');
		for (const line of lines) {
			const colonIndex = line.indexOf(':');
			if (colonIndex > 0) {
				const key = line.substring(0, colonIndex).trim();
				let value = line.substring(colonIndex + 1).trim();
				
				// Убираем кавычки
				if ((value.startsWith('"') && value.endsWith('"')) || 
					(value.startsWith("'") && value.endsWith("'"))) {
					value = value.slice(1, -1);
				}
				
				// Обрабатываем массивы
				if (value.startsWith('[') && value.endsWith(']')) {
					value = value.slice(1, -1).split(',').map(item => item.trim());
				}
				// Обрабатываем boolean значения
				else if (value === 'true') {
					value = true;
				}
				else if (value === 'false') {
					value = false;
				}
				
				frontmatter[key] = value;
			}
		}

		return frontmatter;
	}

	extractContent(fullContent) {
		const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
		const match = fullContent.match(frontmatterRegex);
		if (match) {
			return fullContent.substring(match[0].length).trim();
		}
		return fullContent.trim();
	}

	extractSlug(file, frontmatter) {
		if (frontmatter.slug) {
			return frontmatter.slug;
		}

		return file.basename
			.toLowerCase()
			.replace(/[^a-z0-9а-яё\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-')
			.replace(/^-|-$/g, '');
	}
}

module.exports = NextJsSyncPlugin; 