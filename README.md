# Backend для мобильного приложения "Острова.65"

<img src="https://leader-id.storage.yandexcloud.net/upload/377252/71c5c4a1-2d43-4531-ad18-9c027589b1f4.jpg" alt="Острова.65" width="100%">

## Описание
Этот backend-сервис создан для поддержки модулей мобильного приложения "Острова.65". Он предоставляет API для получения данных, связанных с горнолыжным курортом, включая информацию о трассах, городах, тарифах и погоде.

## Технологии
- **Платформа:** Node.js
- **Фреймворк:** Express.js, WebSocket(WS)

## Доступные API
API доступно по публичной ссылке: [https://welcome.netcloud.dev](https://welcome.netcloud.dev).

### 1. **Горный воздух**
#### Получение списка трасс
- **URL:** `GET https://welcome.netcloud.dev/api/v1/gv/tracks`
- **Описание:** Возвращает список трасс для первого города.
- **Пример ответа:**
  ```json
  [
    {
    "number": "2",
    "difficulty_in_num": "1",
    "difficulty_name": "Простая",
    "name": "Запад низ",
    "length": " 1450 м",
    "height": " 190 м",
    "time": " 09:00 — 22:00",
    "status": "opened",
    "status_text": " открыта"
    }
  ]
  ```

#### Получение трасс конкретного города
- **URL:** `GET https://welcome.netcloud.dev/api/v1/gv/tracks/:cityId`
- **Описание:** Возвращает список трасс для указанного города.
- **Параметры:**
  - `cityId` — ID города.
- **Пример запроса:** `GET /api/v1/gv/tracks/1`
- **Пример ответа:**
  ```json
  [
    {
    "number": "2",
    "difficulty_in_num": "1",
    "difficulty_name": "Простая",
    "name": "Запад низ",
    "length": " 1450 м",
    "height": " 190 м",
    "time": " 09:00 — 22:00",
    "status": "opened",
    "status_text": " открыта"
    },
    {
    "number": "10",
    "difficulty_in_num": "3",
    "difficulty_name": "Сложная",
    "name": "Запад верх",
    "length": " 1100 м",
    "height": " 300 м",
    "time": " 09:00 — 18:00",
    "status": "closed",
    "status_text": " Откроется через 14 часов 40 минут "
    },
  ]
  ```

#### Получение списка городов
- **URL:** `GET https://welcome.netcloud.dev/api/v1/gv/cities`
- **Описание:** Возвращает список доступных городов.
- **Пример ответа:**
  ```json
  [
    {
    "id": 1,
    "name": " г. Большевик  (Запад)"
    },
    {
    "id": 2,
    "name": " Юг-Восток"
    },
    {
    "id": 3,
    "name": " Север"
    },
    {
    "id": 4,
    "name": " г. Красная "
    }
  ]
  ```

#### Получение тарифов
- **URL:** `GET https://welcome.netcloud.dev/api/v1/gv/tarifs`
- **Описание:** Возвращает информацию о тарифах, включая стоимость ски-пассов и проката оборудования.
- **Пример ответа:**
  ```json
  [
    {
      "name": "Разовые подъемы",
      "price_by_card": "Тариф/руб.",
      "price_by_sakh_card": "КартаСахалинца  "
      },
      {
      "name": "КД \"Запад низ\"/\"Запад верх\"/ \"Север\"",
      "price_by_card": "200 ₽",
      "price_by_sakh_card": "180 ₽  "
      }
  ]
  ```

#### Получение данных о погоде
- **URL:** `GET https://welcome.netcloud.dev/api/v1/gv/weather`
- **Описание:** Возвращает актуальный прогноз погоды для курорта.
- **Пример ответа:**
  ```json
  {
   "now": 1734765701,
  "now_dt": "2024-12-21T07:21:41.527368Z",
  "info": {},
  "fact": {},
  "forecasts": []
  }
  ```

## Установка и запуск
1. **Клонируйте репозиторий:**
   ```bash
   git clone https://github.com/W3bWave/island65-back-end.git APIServer
   cd APIServer
   ```

2. **Установите зависимости:**
   ```bash
   npm install
   ```

3. **Запустите сервер:**
   ```bash
   npm start
   ```
   Сервер будет доступен по адресу `http://localhost:80`.

## Структура проекта
- `/routes` — Маршруты для API.
- `/index.js` — Сервер.

## Автор
Команда разработки "Острова.65" WebWave Creations.
