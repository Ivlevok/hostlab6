ПРАКТИЧЕСКАЯ №6. HOSTLAB — ТРИ ТИПА ХОСТИНГА
=================================================

СОДЕРЖАНИЕ
 docs/ — GitHub Pages, статический фронтенд (API с Render)
 render/ + render.yaml — Render PaaS, Node.js + PostgreSQL
 shared/ — InfinityFree Shared, PHP + MySQL
 shared-db.sql — SQL для установки таблицы в MySQL

ВАЖНО: Используйте только учебные данные. Не добавляйте пароли в GitHub.
Бесплатная БД Render ограничена 30 днями. Экспортируйте данные до истечения срока.

1. GITHUB: СОЗДАТЬ РЕПОЗИТОРИЙ
  https://github.com/new
  Name: hostlab6
  Visibility: Public
  Загрузите в корень репозитория ВСЁ содержимое этой распакованной папки,
  включая папки docs, render, shared и файл render.yaml.
  Нажмите Commit changes.

2. RENDER (PAAS + БД)
  https://dashboard.render.com/
  New > Blueprint > Connect GitHub repo hostlab6 > Apply.
  Проверьте, что оба ресурса имеют план Free:
    hostlab6-web (Web Service) и hostlab6-db (Postgres).
  Откройте адрес https://hostlab6-web-...onrender.com/
  Нажмите «Проверить соединение» — должно быть БД: РАБОТАЕТ, 1 запись.
  Сохраните адрес Render. Проверяйте реальное имя и план перед подтверждением.

3. GITHUB PAGES (STATIC)
  GitHub repo > Settings > Pages > Build and deployment:
    Source: Deploy from a branch; Branch: main; Folder: /docs; Save.
  Адрес будет вида https://ВАШ-ЛОГИН.github.io/hostlab6/
  В docs/config.js замените CHANGE-RENDER-URL на точное поддоменное имя
  из адреса Render, БЕЗ https://, БЕЗ .onrender.com и БЕЗ /api/status.
  Пример: для https://hostlab6-web-xxxx.onrender.com/ укажите
    api: 'https://hostlab6-web-xxxx.onrender.com/api/status'
  Дождитесь публикации, откройте ссылку и проверьте соединение.
  Здесь база данных НЕ НА GitHub Pages: статический клиент обращается к Render.

4. INFINITYFREE (SHARED + БД)
  https://www.infinityfree.com/
  Зарегистрируйте аккаунт, создайте free hosting и выберите бесплатный поддомен.
  Через Control Panel > MySQL Databases создайте БД. Скопируйте HOST,
  DB NAME, USERNAME и пароль (не публикуйте их).
  В phpMyAdmin выберите созданную БД и импортируйте shared-db.sql.
  На своей машине сделайте локальную копию файла:
    shared/private/db-config.example.php -> shared/private/db-config.php
  Подставьте данные от хостинга в db-config.php.
  В File Manager на InfinityFree откройте папку htdocs и загрузите в неё
  содержимое каталога shared/ (index.html, app.js, styles.css, config.js,
  api.php, old.html, .htaccess, private/ с db-config.php и .htaccess).
  Убедитесь, что в public GitHub не лежит файл с реальным паролем БД.
  Откройте https://ВАШ-ПОДДОМЕН/ и нажмите «Проверить соединение».
  Должно быть БД: РАБОТАЕТ, 1 запись. Запишите публичный HTTPS-адрес.

5. SSL И РЕДИРЕКТЫ
  Проверьте каждую страницу по HTTPS (замочек / https:// в адресной строке).
  В Render /old -> HTTP 301 на /. В shared/.htaccess /old -> HTTP 301 на /.
  В GitHub Pages /old.html — клиентское перенаправление на главную,
  НЕ серверный HTTP 301 (ограничение статического хостинга).
  Проверьте HTTP -> HTTPS: на Render и GitHub Pages управляет платформа,
  на InfinityFree правило .htaccess при наличии поддержки сервера.

6. МОНИТОРИНГ И BACKUP
  Мониторинг: https://uptimerobot.com/ — добавьте 3 HTTP(S) monitor на
  публичные URL. Проверьте их результаты, сохраните скриншот.
  Backup кода: репозиторий GitHub + скачанный ZIP.
  Backup InfinityFree MySQL: phpMyAdmin > Export > Quick > SQL.
  Backup Render PostgreSQL: pg_dump при наличии внешнего подключения;
  бесплатный Render PostgreSQL НЕ даёт постоянной гарантии хранения данных.
  Скриншот: список мониторов и подтверждения сделанных экспортов.

7. СКРИНШОТЫ (ТОЛЬКО КЛЮЧЕВЫЕ)
  1) GitHub: файлы репозитория + Pages URL.
  2) Render: Web Service + Postgres, страница приложения с БД: РАБОТАЕТ.
  3) InfinityFree: имя БД, File Manager, сайт с БД: РАБОТАЕТ.
  4) HTTPS и перенаправление, мониторинг, резервные копии.

В общий отчёт добавить классификацию Shared/VPS/PaaS/Static/Cloud,
сравнение стоимости, управления, скорости, масштабируемости,
безопасности, удобства поддержки и рекомендации по типам проектов.

Не выдавайте VirtualBox localhost за публичный VPS и не утверждайте,
что статический GitHub Pages имеет собственную БД.
