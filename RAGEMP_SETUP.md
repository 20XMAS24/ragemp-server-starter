# RAGE MP Integration Setup

## Правильная установка в RAGE MP сервер

### Структура проекта:

```
D:\newservertest\
├── ragemp-server.exe
├── conf.json
├── packages/
│   └── gamemode/           ← Сюда копировать
│       ├── index.js
│       └── package.json
├── client_packages/
└── database/               ← Автоматически создастся
    ├── data.json
    └── jobs.json
```

## Шаги установки:

### 1. Скомпилируйте TypeScript

```bash
cd ragemp-server-starter
npm install
npm run build
```

Это создаст папку `dist/` с скомпилированным JavaScript.

### 2. Скопируйте файлы в RAGE MP сервер

```bash
# Из папки ragemp-server-starter скопируйте:

# Packages
копировать: packages/gamemode/
в: D:\newservertest\packages\gamemode\

# Compiled code
копировать: dist/
в: D:\newservertest\dist\

# Source (опционально, для разработки)
копировать: src/
в: D:\newservertest\src\

# Node modules
копировать: node_modules/
в: D:\newservertest\node_modules\
```

### 3. Структура должна быть:

```
D:\newservertest\
├── ragemp-server.exe
├── packages/
│   └── gamemode/
│       ├── index.js          ← Entry point
│       └── package.json
├── dist/                      ← Compiled TS
│   ├── index.js
│   ├── database/
│   ├── services/
│   ├── types/
│   └── ragemp/
│       └── index.js           ← RAGE MP integration
├── node_modules/              ← Dependencies
└── database/                  ← Auto-created
```

### 4. Запустите RAGE MP сервер

```bash
cd D:\newservertest
.\ragemp-server.exe
```

Вы должны увидеть:

```
[INFO] Loading NodeJS packages...
[GameMode] Loading TypeScript gamemode...
[Server] GameMode started!
[Server] Database initialized
[Server] Available jobs: police,taxi,miner
[Server] All events and commands registered!
[GameMode] TypeScript gamemode loaded successfully!
[DONE] Server packages have been started.
```

## Команды в игре:

### Основные:
- `/help` - Список команд
- `/stats` - Ваша статистика
- `/jobs` - Список работ

### Работа:
- `/hire <job_id>` - Устроиться на работу (taxi, miner, police)
- `/fire` - Уволиться
- `/duty` - Начать/закончить смену

### Деньги:
- `/givemoney <player> <amount>` - Передать деньги
- `/deposit <amount>` - Положить в банк
- `/withdraw <amount>` - Снять с банка

### Полиция:
- `/makecop [player]` - Нанять в полицию
- `/salary` - Получить зарплату

## Тестирование:

1. Запустите сервер
2. Зайдите в игру
3. Появится логин (пока через консоль)
4. Используйте команды:

```
/stats          # Посмотреть статистику
/jobs           # Список работ
/hire taxi      # Устроиться таксистом
/duty           # Начать смену
/deposit 1000   # Положить 1000$ в банк
```

## Разработка:

### Изменение кода:

1. Редактируйте файлы в `src/`
2. Скомпилируйте: `npm run build`
3. Перезапустите RAGE MP сервер

Или используйте watch mode:

```bash
npm run watch  # В одном терминале
# Перезапускайте сервер после изменений
```

## Добавление новых механик:

### 1. Создайте сервис:

```typescript
// src/services/myService.ts
export class MyService {
  static myFunction() {
    // logic
  }
}
```

### 2. Добавьте команду:

```typescript
// src/ragemp/index.ts
mp.events.addCommand('mycommand', (player: any) => {
  // use MyService
});
```

### 3. Скомпилируйте и перезапустите

## Troubleshooting:

### "Necessary resources folder does not exist"
- Это нормально, можно игнорировать

### Gamemode не загружается:
1. Проверьте путь: `packages/gamemode/index.js` существует
2. Проверьте что `dist/` папка есть
3. Проверьте `node_modules/` установлены

### Ошибки при компиляции:
```bash
npm install          # Переустановить зависимости
npm run build        # Пересобрать
```

### База данных не сохраняется:
- Проверьте права на запись в папку `database/`
- База создаётся автоматически при первом запуске

## Client-Side интеграция:

Для CEF интерфейсов нужно добавить клиентские скрипты:

```
client_packages/
└── index.js          ← Client scripts
```

Пример:

```javascript
// client_packages/index.js
mp.events.add('client:showLogin', () => {
  // Show CEF browser with login
  mp.gui.cursor.visible = true;
});

mp.events.add('client:auth:success', (sessionData) => {
  console.log('Logged in:', sessionData);
  mp.gui.cursor.visible = false;
});
```

## Production советы:

1. **Безопасность:**
   - Хешируйте пароли (bcrypt)
   - Валидируйте все входные данные
   - Добавьте anti-cheat

2. **Производительность:**
   - Используйте SQLite/MySQL для больших серверов
   - Кешируйте часто используемые данные
   - Оптимизируйте database операции

3. **Бэкапы:**
   - Регулярно сохраняйте `database/`
   - Используйте Git для версионирования

---

**Готово! Сервер должен работать.** 🚀

Если есть вопросы - проверьте логи RAGE MP сервера.
