## Лабораторная работа №2.
# Инструкция по установке
Шаг 1: Установка Node.js и npm
Перейдите на официальный сайт Node.js.

Скачайте и установите последнюю стабильную версию Node.js

Шаг 2: Установка Expo CLI
Откройте терминал (или командную строку).

Установите Expo CLI глобально с помощью npm:

npm install -g expo-cli

Шаг 3: Создание нового проекта
В терминале выполните команду для создания нового проекта:

expo init MyNewProject

Выберите шаблон проекта (например, "blank" для пустого проекта).

Перейдите в папку проекта:

cd MyNewProject

Шаг 4: Установка Expo Go на устройство
Скачайте приложение Expo Go из магазина приложений:

Для iOS: App Store

Для Android: Google Play

Убедитесь, что ваше устройство и компьютер находятся в одной сети Wi-Fi.

Шаг 5: Запуск проекта
В терминале запустите проект:

npm start

или

expo start

Откроется веб-интерфейс Expo Dev Tools с QR-кодом.

Откройте приложение Expo Go на вашем устройстве и отсканируйте QR-код с помощью камеры.

Шаг 6: Разработка и тестирование
После сканирования QR-кода ваш проект запустится в приложении Expo Go.

## Отчет по работе.
# Схема базы данных
Приложение использует SQLite для хранения данных. Схема состоит из двух таблиц:

Таблица markers:
id	TEXT (PK)	Уникальный идентификатор
latitude	REAL	Широта местоположения
longitude	REAL	Долгота местоположения
created_at	DATETIME	Дата создания (автоматически)

Таблица marker_images:
id	TEXT (PK)	Уникальный идентификатор
marker_id	TEXT (FK)	Ссылка на маркер
uri	TEXT	Путь к изображению
created_at	DATETIME	Дата создания (автоматически)

Связи:
Один маркер → много изображений
Каскадное удаление: при удалении маркера удаляются все связанные изображения

# Обработка ошибок
Подход к обработке ошибок на уровне БД:
- Все операции обернуты в try/catch
- Ошибки логируются в консоль
Подход к обработке ошибок на уровне контекста:
- Хранение последней ошибки в состоянии
- Предоставление ошибки через контекст
Подход к обработке ошибок на уровне UI:
- Отображение пользовательских сообщений
- Индикаторы состояний загрузки/ошибки

# Дополнительные возможности
- Долгое нажатие на карту для создания нового маркера
- Галерея изображений для каждого маркера
- Каскадное удаление маркеров с изображениями
- Автоматическое обновление данных при возврате на экран
- Генерация UUID для всех новых записей
