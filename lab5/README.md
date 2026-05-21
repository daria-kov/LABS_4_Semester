
# Лабораторная работа №5 — AJAX-запросы к API

## Содержание

1. [Описание](#описание)
2. [Стек технологий](#стек-технологий)
3. [Структура проекта](#структура-проекта)
4. [Архитектура приложения](#архитектура-приложения)
5. [API бэкенда](#api-бэкенда)
6. [Запуск проекта](#запуск-проекта)
7. [Демонстрация асинхронности](#демонстрация-асинхронности)

---

## Описание

Веб-приложение «Расчёт траекторий» — SPA (Single Page Application) с тёмным космическим интерфейсом. Приложение отображает список траекторий перелёта к Луне, полученных с бэкенда через AJAX-запросы (XMLHttpRequest), и позволяет просматривать детальную страницу каждой траектории с интерактивным 3D-просмотрщиком модели.

Основная цель лабораторной работы — организация взаимодействия клиентской части с REST API через слой `modules/ajax.js` и `modules/trajectoryUrls.js`.

---

## Стек технологий

**Фронтенд:**
- Vanilla JavaScript (ES Modules)
- Bootstrap 5 (тёмная тема)
- Three.js — 3D-рендеринг моделей (GLTFLoader + DRACOLoader + OrbitControls)

**Бэкенд:**
- Node.js + Express 5
- Данные хранятся в JSON-файле (`src/data/trajectories.json`)
- Nodemon — для горячей перезагрузки при разработке

---

## Структура проекта

```
├── components/
│   ├── back-button/        # Кнопка «Назад»
│   ├── trajectory/         # Компонент детальной страницы траектории (3D + телеметрия)
│   └── trajectory-card/    # Карточка траектории для главной страницы
├── example-express/        # Бэкенд на Express
│   └── src/
│       ├── controllers/    # trajectoriesController.js — обработчики запросов
│       ├── data/           # trajectories.json — данные
│       ├── routes/         # trajectories.js — маршруты
│       └── services/       # trajectoriesService.js — бизнес-логика
├── img/                    # Изображения (астронавт, ракета, спутник)
├── models/                 # 3D-модели .glb (Moon, RocketShip, ISS)
├── modules/
│   ├── ajax.js             # Класс Ajax: обёртка над XMLHttpRequest (GET/POST/PATCH/DELETE)
│   └── trajectoryUrls.js   # Класс TrajectoryUrls: URL-адреса эндпоинтов API
├── pages/
│   ├── main/               # Главная страница — список траекторий + карусель
│   └── trajectory/         # Страница конкретной траектории
├── index.html
├── main.js                 # Точка входа
└── style.css
```

---

## Архитектура приложения

Приложение построено по компонентному принципу без фреймворков.

### Слой работы с API

**`modules/trajectoryUrls.js`** — хранит базовый URL и генерирует адреса эндпоинтов:

```js
trajectoryUrls.getTrajectories()         // GET /trajectories
trajectoryUrls.getTrajectoryById(id)     // GET /trajectories/:id
trajectoryUrls.createTrajectory()        // POST /trajectories
trajectoryUrls.updateTrajectoryById(id)  // PATCH /trajectories/:id
trajectoryUrls.removeTrajectoryById(id)  // DELETE /trajectories/:id
```

**`modules/ajax.js`** — класс `Ajax`, обёртка над `XMLHttpRequest`. Методы принимают URL и callback `(data, status)`:

```js
ajax.get(url, callback)
ajax.post(url, data, callback)
ajax.patch(url, data, callback)
ajax.delete(url, callback)
```

### Страницы

- **`pages/main`** — получает список траекторий через `ajax.get`, отображает их в карусели Bootstrap. Поддерживает фильтрацию по названию через поисковое поле.
- **`pages/trajectory`** — получает одну траекторию по ID через `ajax.get`, рендерит детальный компонент с 3D-просмотрщиком и интерактивным пультом телеметрии.

### Компонент траектории

`components/trajectory/index.js` содержит:
- Рендеринг 3D-модели через **Three.js** (GLTFLoader + OrbitControls) в канвас-контейнере.
- **Интерактивный пульт телеметрии** — вычисляет операции над массивами (сумма квадратов, удаление элементов, инверсия).
- **Async-демо** — демонстрация работы с `Promise`: два поля сохраняются асинхронно с задержкой, кнопка «Σ await» дожидается обоих через `Promise.all` и складывает результаты.

---

## API бэкенда

Базовый URL: `http://localhost:3000`

CORS настроен на сервере — разрешены все origins и методы `GET, POST, PATCH, DELETE, OPTIONS`.

| Метод  | Путь                  | Описание                          |
|--------|-----------------------|-----------------------------------|
| GET    | `/trajectories`       | Получить список всех траекторий   |
| GET    | `/trajectories/:id`   | Получить траекторию по ID         |
| POST   | `/trajectories`       | Создать новую траекторию          |
| PATCH  | `/trajectories/:id`   | Обновить траекторию по ID         |
| DELETE | `/trajectories/:id`   | Удалить траекторию по ID          |

Данные хранятся в `example-express/src/data/trajectories.json`. Каждая траектория содержит поля: `id`, `title`, `text`, `src`, `badge`, `badgeClass`, `impulse`, `time`, `model`.

---

## Запуск проекта

Проект состоит из двух независимых частей: бэкенда и фронтенда. Их нужно запускать одновременно в двух отдельных терминалах.

### 1. Запуск бэкенда

```bash
cd example-express
npm install
npm run dev
```

Сервер запустится по адресу `http://localhost:3000`. В терминале появится:

```
Сервер запущен по адресу http://localhost:3000
```

Для разовой проверки без автоперезагрузки:

```bash
npm run start
```

### 2. Запуск фронтенда

Перейдите в корень проекта и установите зависимости (Bootstrap):

```bash
cd ..   # из example-express вернуться в корень
npm install
```

Затем откройте `index.html` через плагин **Live Server** в VS Code:
- Правая кнопка мыши на `index.html` → **Open with Live Server**
- Или нажмите кнопку **Go Live** в правом нижнем углу VS Code

Фронтенд откроется по адресу `http://127.0.0.1:5501` (порт может отличаться).

### 3. Настройка CORS (обязательно)

Поскольку бэкенд (`localhost:3000`) и фронтенд (`127.0.0.1:5501`) находятся на разных портах, для корректной работы POST/PATCH запросов с `Content-Type: application/json` установите расширение браузера [CORS Unblock](https://chromewebstore.google.com/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino) и включите в его настройках:

- **Overwrite 4xx status codes with 200**
- **Access-Control-Request-Headers**

После этого нажмите **Start** (или **Restart**) в расширении.

> Простые GET-запросы работают без расширения, так как CORS на сервере уже настроен (`Access-Control-Allow-Origin: *`). Расширение нужно только для preflight OPTIONS-запросов при POST/PATCH.

---

## Демонстрация асинхронности

### Скрипт для консоли браузера

```js
function timestamp() {
    const t = new Date();
    return t.toLocaleTimeString('ru-RU') + '.' + String(t.getMilliseconds()).padStart(3, '0');
}

const results = {};
let completed = 0;

function onLoaded(name, value) {
    results[name] = value;
    completed++;
    if (completed === 2) {
        console.log(`[${timestamp()}] = СУММА: ${results['A']} + ${results['B']} = ${results['A'] + results['B']}`);
    }
}

console.log(`[${timestamp()}] Отправляем оба XHR-запроса одновременно`);

// Запрос A — сервер ответит через 10 секунд
const xhrA = new XMLHttpRequest();
xhrA.open('GET', 'http://localhost:3000/trajectories/1?delay=10000');
xhrA.onreadystatechange = function () {
    if (xhrA.readyState === 4) {
        console.log(`[${timestamp()}] ✓ A получено (статус ${xhrA.status}), число = 7`);
        onLoaded('A', 7);
    }
};
xhrA.send();
console.log(`[${timestamp()}] → XHR A отправлен (задержка 10000 мс)`);

// Запрос B — сервер ответит сразу
const xhrB = new XMLHttpRequest();
xhrB.open('GET', 'http://localhost:3000/trajectories/2');
xhrB.onreadystatechange = function () {
    if (xhrB.readyState === 4) {
        console.log(`[${timestamp()}] ✓ B получено (статус ${xhrB.status}), число = 3`);
        onLoaded('B', 3);
    }
};
xhrB.send();
console.log(`[${timestamp()}] → XHR B отправлен (без задержки)`);

console.log(`[${timestamp()}] Оба запроса в полёте — JS не заблокирован`);
```

**Ожидаемый вывод в консоли:**

```
[12:00:00.000] Отправляем оба XHR-запроса одновременно
[12:00:00.001] → XHR A отправлен (задержка 10000 мс)
[12:00:00.002] → XHR B отправлен (без задержки)
[12:00:00.002] Оба запроса в полёте — JS не заблокирован
[12:00:00.015] ✓ B получено (статус 200), число = 3   ← onreadystatechange сработал сразу
[12:00:10.016] ✓ A получено (статус 200), число = 7   ← onreadystatechange сработал через 10 сек
[12:00:10.016] = СУММА: 7 + 3 = 10
```

Ключевой момент: строки `→ XHR отправлен` и `Оба запроса в полёте` печатаются **до** ответов сервера — `.send()` не блокирует выполнение кода. `onreadystatechange` вызывается браузером автоматически, когда приходит ответ.

---

### Асинхронность во вкладке Network (DevTools)

Откройте DevTools (`F12`) → вкладка **Network**, затем откройте приложение и перейдите на страницу какой-либо траектории.

На что обратить внимание:

| Колонка       | Что показывает                                                                                      |
|---------------|-----------------------------------------------------------------------------------------------------|
| **Name**      | Имя запроса: `trajectories`, `trajectories/1` и т.д.                                               |
| **Status**    | `200` — ответ получен успешно                                                                       |
| **Waterfall** | Горизонтальные полоски — время жизни каждого запроса. Если полоски **идут параллельно** (перекрываются по времени) — запросы асинхронные. Если выстроены в цепочку — синхронные. |
| **Time**      | Время выполнения запроса в миллисекундах                                                            |

Именно в **Waterfall** видно, что браузер не ждёт завершения одного запроса перед отправкой следующего: полоски для JS-модулей, `.glb`-моделей и AJAX-запросов к API идут параллельно.
