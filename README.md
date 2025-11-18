# Publipack - Wheel of Fortune Landing

Интерактивный лендинг с колесом фортуны и формой сбора лидов.

## 🚀 Быстрый старт

### 1. Установка

```bash
npm install
```

### 2. Настройка интеграции (5 минут)

**⭐ Рекомендуется (Production-ready):** [PIPEDREAM_QUICK_START.md](./PIPEDREAM_QUICK_START.md)

**Кратко (через Pipedream):**
1. Создайте Google таблицу с заголовками: `Full Name`, `Phone`, `Email`, `Sponsor`, `Reward`, `Campaign ID`, `Timestamp`
2. Зарегистрируйтесь на [pipedream.com](https://pipedream.com) (бесплатно)
3. Создайте Workflow: HTTP Webhook → Google Sheets
4. Скопируйте Webhook URL
5. Создайте `.env`:

```bash
VITE_PIPEDREAM_WEBHOOK=https://eoXXXXXXXX.m.pipedream.net
VITE_CAMPAIGN_ID=publipack_wheel_2025
```

**⚠️ Альтернативы (не рекомендуется):**
- [QUICK_START.md](./QUICK_START.md) — SheetDB напрямую (URL виден в браузере, только для тестирования)
- [GOOGLE_APPS_SCRIPT_SETUP.md](./GOOGLE_APPS_SCRIPT_SETUP.md) — Google Apps Script (проблемы с CORS)

### 3. Запуск

```bash
npm run dev
```

Откройте [http://localhost:5173](http://localhost:5173)

---

## 📚 Документация

### Интеграции (в порядке приоритета)

1. **[PIPEDREAM_QUICK_START.md](./PIPEDREAM_QUICK_START.md)** — ⭐ **Рекомендуется** (5 минут, production-ready, zero CORS)
2. **[PIPEDREAM_SETUP.md](./PIPEDREAM_SETUP.md)** — Подробная документация по Pipedream с advanced фичами
3. **[FAST_SOLUTIONS.md](./FAST_SOLUTIONS.md)** — Сравнение всех решений
4. **[QUICK_START.md](./QUICK_START.md)** — SheetDB напрямую (только для тестирования)
5. **[GOOGLE_APPS_SCRIPT_SETUP.md](./GOOGLE_APPS_SCRIPT_SETUP.md)** — Google Apps Script (не рекомендуется из-за CORS)

### Остальное

- **[DEBUG_FORM.md](./DEBUG_FORM.md)** — Отладка формы отправки
- **[ENV_SETUP.md](./ENV_SETUP.md)** — Подробно про environment variables
- **[GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md)** — Подробная документация по Google Sheets

---

## 🎯 Возможности

- ✅ Колесо фортуны с анимацией
- ✅ Слот-машина для дополнительного шанса
- ✅ Форма сбора контактов
- ✅ Автоматическое сохранение в Google Sheets
- ✅ Адаптивный дизайн (mobile-first)
- ✅ Бесплатная интеграция

---

## 🛠 Технологии

- **React 19** + **TypeScript**
- **Vite** — быстрая сборка
- **Tailwind CSS** — стилизация
- **Lottie** — анимации
- **Google Sheets** — хранение данных (через SheetDB)

---

## 📦 Структура проекта

```
src/
├── components/        # Экраны приложения
├── hooks/             # Кастомные хуки
├── shared/            # Переиспользуемые компоненты
│   ├── api/          # API клиенты (Google Sheets, Airtable)
│   ├── ui/           # UI компоненты
│   └── lib/          # Утилиты
└── providers/         # React провайдеры
```

---

## 🔧 Доступные команды

```bash
# Разработка
npm run dev

# Сборка для продакшена
npm run build

# Превью продакшен-сборки
npm run preview

# Линтинг
npm run lint
```

---

## 🌐 Деплой

### Netlify

1. Подключите репозиторий к Netlify
2. Добавьте environment variables в настройках:
   - `VITE_PIPEDREAM_WEBHOOK`
   - `VITE_CAMPAIGN_ID`
3. Deploy!

### Vercel

1. Импортируйте проект в Vercel
2. Добавьте environment variables
3. Deploy!

---

## 📊 Работа с данными

### Просмотр лидов

Откройте вашу Google таблицу — все данные там в реальном времени.

### Экспорт

В Google Sheets: **Файл** → **Скачать** → **CSV/Excel**

### Фильтрация по кампаниям

Используйте встроенные фильтры Google Sheets по колонке `Campaign ID`.

---

## 🔒 Безопасность

✅ **Рекомендуется**: Использовать Pipedream Webhook — production-ready решение без проблем с CORS.

**Преимущества**:
- ✅ Webhook URL не раскрывает структуру Google Sheets
- ✅ Бесплатно 100,000 запросов/месяц
- ✅ Zero CORS issues
- ✅ Real-time логирование в Pipedream Inspector
- ✅ 99.9% uptime SLA
- ✅ Настройка за 5 минут

**Инструкция**: [PIPEDREAM_QUICK_START.md](./PIPEDREAM_QUICK_START.md)

⚠️ **Прямой SheetDB** (через `VITE_SHEETDB_API_URL`) — только для тестирования. URL будет виден в браузере.

---

## 💡 FAQ

**Q: Какую интеграцию выбрать?**  
A: **Pipedream** — production-ready, без CORS проблем, 100k бесплатных запросов/месяц.

**Q: Сколько стоит?**  
A: Полностью бесплатно. Pipedream Free tier: 100,000 запросов/месяц — более чем достаточно.

**Q: Как разделить данные разных кампаний?**  
A: Меняйте `VITE_CAMPAIGN_ID` для каждой кампании, затем фильтруйте в таблице.

**Q: Почему Google Apps Script не работает?**  
A: Google Apps Script имеет проблемы с CORS. Используйте **Pipedream** — работает из коробки.

**Q: Можно ли использовать Airtable?**  
A: Да, но у Airtable ограничение 1,000 строк на бесплатном тарифе. Pipedream + Google Sheets — unlimited.

---

## 📞 Troubleshooting

**Данные не сохраняются:**
1. Проверьте консоль браузера (F12)
2. Убедитесь, что `.env` создан
3. Проверьте права доступа к Google таблице

**TypeScript ошибки:**
```bash
# Перезапустите TypeScript server в VSCode
Cmd+Shift+P → "TypeScript: Restart TS Server"
```

**Environment variables не работают:**
```bash
# Перезапустите dev-сервер
npm run dev
```

---

## 📝 License

MIT

---

## 🎉 Готово к использованию!

1. ✅ Форма работает
2. ✅ Google Sheets интегрирован
3. ✅ Бесплатно навсегда
4. ✅ Готово к деплою

**Следующие шаги:**
- Настройте Slack/Email уведомления в Pipedream ([PIPEDREAM_SETUP.md](./PIPEDREAM_SETUP.md))
- Добавьте Google Analytics
- Задеплойте на Netlify/Vercel
