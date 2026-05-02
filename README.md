# FinTrack — Gestión Financiera

Frontend Angular 21 para el sistema de gestión de gastos e ingresos.

## Tecnologías
- **Angular 21** (standalone components, signals)
- **CSS puro** (sin frameworks externos)
- **Google Fonts**: Syne + DM Sans + JetBrains Mono

## Estructura del Proyecto

```
src/
├── app/
│   ├── core/
│   │   ├── models/           # Interfaces TypeScript (User, Spent, Category, etc.)
│   │   └── services/         # Servicios HTTP (CRUD genérico + específicos)
│   ├── shared/
│   │   └── components/
│   │       ├── sidebar/       # Sidebar colapsable con navegación
│   │       ├── navbar/        # Topbar con toggle de tema
│   │       ├── data-table/    # Tabla genérica con búsqueda
│   │       └── modal-form/    # Modal reutilizable para formularios
│   └── features/
│       ├── dashboard/         # Panel principal con KPIs
│       ├── spents/            # CRUD Gastos
│       ├── incomes/           # CRUD Ingresos
│       ├── categories/        # CRUD Categorías
│       ├── payments/          # CRUD Métodos de Pago
│       ├── types/             # CRUD Tipos de Ingreso
│       └── users/             # CRUD Usuarios
├── environments/
│   └── environment.ts         # URL del backend (http://localhost:8080)
└── styles.css                 # Variables CSS de tema oscuro/claro
```

## Configuración

1. Ajustar la URL del backend en `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'
};
```

2. Instalar y ejecutar:
```bash
npm install
ng serve
```

## Características
- Tema oscuro/claro con toggle, persiste en localStorage
- Sidebar colapsable a íconos
- CRUD completo para todas las entidades del UML
- Notificaciones toast en cada operación
- Búsqueda en tiempo real en todas las tablas
- Lazy loading por módulo de feature
- Signals de Angular 17+ (sin RxJS en componentes)

## Entidades
User · Spent · Income · Category · Payment · Type
