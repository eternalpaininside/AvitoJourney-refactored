# Карта проекта

## Структура

- `index.html` - корневой редирект на `pages/index.html`.
- `pages/` - все HTML-страницы проекта.
- `css/` - все стили.
- `js/` - вся логика проекта.
- `data/` - JSON-данные для карточек, баннеров и страницы товара.
- `images/` - изображения и аватары.

## Страницы

- `pages/index.html` - главная страница: баннеры, карточки, поиск.
- `pages/product.html` - детальная страница услуги.
- `pages/seller.html` - страница продавца.
- `pages/user.html` - профиль пользователя и избранное.
- `pages/login.html` - вход и регистрация.
- `pages/chat.html` - чат.

## JS

- `js/app.js` - точка входа. Определяет страницу и запускает нужный модуль.
- `js/components/layout.js` - вставляет общую шапку и футер.
- `js/components/headerComponent.js` - HTML-шаблон шапки.
- `js/components/footerComponent.js` - HTML-шаблон футера.
- `js/components/header.js` - логика шапки и ссылки профиля.

### Логика страниц

- `js/pages/home.js` - баннеры, карточки, поиск, кнопка "наверх".
- `js/pages/product.js` - загрузка `data/product.json`, галерея, бронирование, отзывы.
- `js/pages/seller.js` - карточки продавца и кнопки связи.
- `js/pages/user.js` - вкладки профиля и избранное.
- `js/pages/login.js` - вход и регистрация.
- `js/pages/chat.js` - диалоги и отправка сообщений.

### Хранилище и утилиты

- `js/storage/auth.js` - состояние авторизации в `localStorage`.
- `js/storage/favorites.js` - избранное в `localStorage`.
- `js/utils/images.js` - безопасная вставка изображений и локальный fallback.

## Данные

- `data/products.json` - все карточки на главной и в избранном.
- `data/product.json` - данные для страницы товара.
- `data/banners.json` - баннеры главной страницы.

## Где чинить баги

- Сломалась верстка - `css/main.css` или `css/auth.css`.
- Не загружаются карточки - `data/products.json` или `js/pages/home.js`.
- Не работает баннер - `data/banners.json` или `js/pages/home.js`.
- Не правильно работает профиль - `js/components/header.js` или `js/storage/auth.js`.
- Не работает избранное - `js/storage/favorites.js` или `js/pages/user.js`.
- Не открывается товар - `pages/product.html` или `js/pages/product.js`.
- Не работает чат - `pages/chat.html` или `js/pages/chat.js`.
