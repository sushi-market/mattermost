# Кастомизации Mattermost

Этот файл фиксирует локальные изменения, которые мы накладываем поверх официальных релизных тегов Mattermost.

## Рабочий процесс форка

- Официальный репозиторий Mattermost хранится в remote `upstream`.
- Локальные ветки кастомизации создаются от официальных релизных тегов, например `custom-client-11.4.2` от `v11.4.2`.
- Каждая кастомизация оформляется отдельным небольшим коммитом, чтобы ее можно было перенести на новый тег Mattermost через `git cherry-pick`.
- Сгенерированные файлы сборки не коммитятся, если это явно не требуется процессом деплоя.

## Текущая база

- Официальный базовый тег: `v11.4.2`
- Ветка кастомизации: `custom-client-11.4.2`

## Локальная проверка в Docker

Для проверки кастомного веб-клиента используется отдельный compose-файл `docker-compose.custom-client.yml`.
Он поднимает тестовый Postgres и Mattermost Team Edition 11.4.2 с нашим собранным клиентом.

Сборка веб-клиента:

```sh
docker run --rm --platform linux/amd64 \
  -v mattermost-webapp-npm-cache-amd64:/root/.npm \
  -v "$PWD/webapp:/work" \
  -w /work node:20.11-bookworm \
  bash -lc 'git config --global url."https://github.com/".insteadOf "ssh://git@github.com/" && git config --global url."https://github.com/".insteadOf "git@github.com:" && npm ci --include=dev --no-audit && npm run build'
```

Сборка локального образа Mattermost с кастомным клиентом:

```sh
docker build --platform linux/amd64 \
  -f .docker/custom-client/Dockerfile \
  -t sushi-market/mattermost-custom-client:11.4.2-local \
  webapp/channels/dist
```

Запуск:

```sh
docker compose -f docker-compose.custom-client.yml up -d
```

После запуска веб-клиент доступен на `http://localhost:8065`.

Остановка без удаления тестовых данных:

```sh
docker compose -f docker-compose.custom-client.yml down
```

Полный сброс тестовых данных:

```sh
docker compose -f docker-compose.custom-client.yml down -v
```

## Журнал кастомизаций

| Дата | Область | Файлы | Описание |
| --- | --- | --- | --- |
| 2026-04-24 | HTML веб-приложения | `webapp/channels/src/root.html` | Установлен русский язык корневого HTML-документа через `<html lang="ru">`. |
| 2026-04-24 | Переводы веб-приложения | `webapp/channels/src/i18n/ru.json` | Переведена синяя панель запроса разрешения на браузерные уведомления. |
| 2026-04-24 | Переводы веб-приложения | `webapp/channels/src/i18n/ru.json` | Переведены пункты меню плюса в левом сайдбаре: создание и просмотр каналов, личные сообщения, группы пользователей, категории и приглашение людей. |
| 2026-04-24 | Переводы веб-приложения | `webapp/channels/src/i18n/ru.json` | Переведено меню аккаунта пользователя: статусы, профиль, выход и подменю режима «Не беспокоить». |
| 2026-04-24 | Меню веб-приложения | `webapp/channels/src/components/global_header/left_controls/product_menu/product_menu_list/product_menu_list.tsx`, `webapp/channels/src/components/mobile_sidebar_right/mobile_sidebar_right_items/mobile_sidebar_right_items.tsx` | Скрыт пункт «О DATAFOOD» в меню продуктов. |
| 2026-04-24 | Переводы веб-приложения | `webapp/channels/src/i18n/ru.json` | Переведена подсказка над полем поиска каналов в модальном окне быстрого переключения. |
| 2026-04-24 | Переводы веб-приложения | `webapp/channels/src/i18n/ru.json` | Переведены недостающие пункты меню заголовка канала: настройки канала, участники и панель закладок. |
| 2026-04-24 | Переводы веб-приложения | `webapp/channels/src/i18n/ru.json` | Переведены короткие пункты «Заглушить» и «Включить звук» в меню личных и групповых диалогов левого сайдбара. |
| 2026-04-24 | Локальная проверка | `.docker/custom-client/Dockerfile`, `docker-compose.custom-client.yml`, `CUSTOMIZATIONS.md` | Добавлен Docker-контур для проверки собранного кастомного веб-клиента на `http://localhost:8065`. |
| 2026-04-27 | Верхняя панель веб-приложения | `webapp/channels/src/components/global_header/right_controls/right_controls.tsx` | Добавлена компактная кнопка-лейбл «Скачать приложение» с белым текстом слева от значка упоминаний, открывающая `https://mattermost.datafood.tech/` в новой вкладке. |
| 2026-04-27 | Верхняя панель веб-приложения | `webapp/channels/src/components/global_header/right_controls/right_controls.tsx` | Цвет текста кнопки «Скачать приложение» принудительно закреплен белым, чтобы общий стиль ссылок Mattermost не перекрашивал его в синий. |
| 2026-04-27 | Меню и переводы веб-приложения | `webapp/channels/src/i18n/ru.json`, `webapp/channels/src/components/sidebar/sidebar_header/sidebar_team_menu.tsx`, `webapp/channels/src/components/sidebar/sidebar_header/sidebar_team_menu.test.tsx` | Переведены заголовок канала и меню команды; из меню команды скрыт пункт `Learn about teams`. |
| 2026-04-27 | Меню помощи веб-приложения | `webapp/channels/src/components/global_header/center_controls/user_guide_dropdown/user_guide_dropdown.tsx`, `webapp/channels/src/components/global_header/center_controls/user_guide_dropdown/index.ts` | В меню значка вопроса оставлен только локальный пункт «Горячие клавиши»; внешние ссылки Mattermost из этого меню скрыты. |
