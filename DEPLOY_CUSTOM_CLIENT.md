# Деплой кастомного веб-клиента Mattermost без Docker

Эта инструкция применяется для прод-сервера, где Mattermost установлен как обычный сервис.
Серверная версия должна совпадать с базой кастомизации: `11.4.2`.

Мы не заменяем бинарник сервера, конфиг, базу данных и `/opt/mattermost/data`.
Меняется только папка веб-клиента: `/opt/mattermost/client`.

## Артефакт

Текущая продовая сборка:

```text
/Users/deniszakharenko/Documents/projects/mattermost-release-artifacts/mattermost-client-11.4.2-custom.4.tar.gz
/Users/deniszakharenko/Documents/projects/mattermost-release-artifacts/mattermost-client-11.4.2-custom.4.tar.gz.sha256
```

Архив собран из `webapp/channels/dist`.

## Копирование на прод

Выполнить локально, заменив `user@prod` на доступ к серверу:

```sh
scp /Users/deniszakharenko/Documents/projects/mattermost-release-artifacts/mattermost-client-11.4.2-custom.4.tar.gz user@prod:/tmp/
scp /Users/deniszakharenko/Documents/projects/mattermost-release-artifacts/mattermost-client-11.4.2-custom.4.tar.gz.sha256 user@prod:/tmp/
```

## Установка на проде

Выполнить на прод-сервере:

```sh
export MM_DIR=/opt/mattermost
export RELEASE=mattermost-client-11.4.2-custom.4.tar.gz

sudo "$MM_DIR/bin/mattermost" version

cd /tmp
sha256sum -c "$RELEASE.sha256"

sudo tar -C "$MM_DIR" -czf "$MM_DIR/client.backup-$(date +%Y%m%d-%H%M%S).tar.gz" client

sudo systemctl stop mattermost

sudo rm -rf "$MM_DIR/client"
sudo mkdir -p "$MM_DIR/client"
sudo tar -xzf "/tmp/$RELEASE" -C "$MM_DIR/client"
sudo chown -R mattermost:mattermost "$MM_DIR/client"

sudo systemctl start mattermost
sudo systemctl status mattermost --no-pager
```

Если Mattermost установлен не в `/opt/mattermost`, заменить `MM_DIR` на фактический путь.

## Проверка

Проверить, что сервер отдает новый HTML:

```sh
curl -sS https://YOUR_MATTERMOST_DOMAIN | grep '<html lang="ru"'
```

Проверить, что сервис без ошибок:

```sh
sudo journalctl -u mattermost -n 100 --no-pager
```

После деплоя в браузере лучше сделать hard reload или открыть Mattermost в приватном окне, чтобы исключить старый кеш статики.

## Откат

Найти последний backup:

```sh
ls -lh /opt/mattermost/client.backup-*.tar.gz
```

Вернуть старый клиент:

```sh
export MM_DIR=/opt/mattermost
export BACKUP=/opt/mattermost/client.backup-YYYYMMDD-HHMMSS.tar.gz

sudo systemctl stop mattermost

sudo rm -rf "$MM_DIR/client"
sudo tar -xzf "$BACKUP" -C "$MM_DIR"
sudo chown -R mattermost:mattermost "$MM_DIR/client"

sudo systemctl start mattermost
sudo systemctl status mattermost --no-pager
```

## Новая сборка после следующих правок

Сначала пересобрать веб-клиент:

```sh
docker run --rm --platform linux/amd64 \
  -v mattermost-webapp-npm-cache-amd64:/root/.npm \
  -v "$PWD/webapp:/work" \
  -w /work node:20.11-bookworm \
  bash -lc 'git config --global url."https://github.com/".insteadOf "ssh://git@github.com/" && git config --global url."https://github.com/".insteadOf "git@github.com:" && npm ci --include=dev --no-audit && npm run build'
```

Потом упаковать новый артефакт:

```sh
mkdir -p /Users/deniszakharenko/Documents/projects/mattermost-release-artifacts
tar -C webapp/channels/dist -czf /Users/deniszakharenko/Documents/projects/mattermost-release-artifacts/mattermost-client-11.4.2-custom.N.tar.gz .
cd /Users/deniszakharenko/Documents/projects/mattermost-release-artifacts
shasum -a 256 mattermost-client-11.4.2-custom.N.tar.gz > mattermost-client-11.4.2-custom.N.tar.gz.sha256
```
