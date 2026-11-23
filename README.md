# PapaTicket

Sistema de venda de inscrições para corridas de rua.

- `Back-End/`: API em Laravel 13 com Sanctum e SQLite
- `Front-End/`: React com Vite, React Router, Axios e Tailwind CSS

## Requisitos

- PHP 8.3 ou superior, com as extensões `pdo_sqlite` e `sqlite3` habilitadas no `php.ini`
- Composer
- Node.js 20 ou superior

## Back-End

```bash
cd Back-End
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan serve
```

A API fica em `http://localhost:8000/api`.

## Front-End

```bash
cd Front-End
npm install
cp .env.example .env
npm run dev
```

Acesse `http://localhost:5173`. Se a API rodar em outra porta, ajuste `VITE_API_URL` no `.env`.

## Usuários de teste

Todos usam a senha `password`.

| Perfil | E-mail |
|---|---|
| Organizador | admin@papaticket.test |
| Corredor | ana@papaticket.test |
| Corredor | bruno@papaticket.test |
| Corredor | carla@papaticket.test |
| Corredor | diego@papaticket.test |

## Rotas da API

| Método | Rota | Acesso |
|---|---|---|
| POST | /api/register | público |
| POST | /api/login | público |
| GET | /api/races?name=&date_from=&date_to=&km_min=&km_max= | público |
| GET | /api/races/{id} | público |
| GET | /api/me | autenticado |
| POST | /api/logout | autenticado |
| GET, POST | /api/registrations | corredor |
| DELETE | /api/registrations/{id} | corredor (cancela) |
| GET, POST | /api/admin/races | organizador |
| GET, PUT, DELETE | /api/admin/races/{id} | organizador |
| GET | /api/admin/races/{id}/registrations | organizador |
| GET, PUT | /api/admin/profile | organizador |

As rotas autenticadas exigem o cabeçalho `Authorization: Bearer {token}`.
