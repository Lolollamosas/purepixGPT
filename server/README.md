# PurePix Backend

Backend de Node.js/Express para integración con Mercado Pago.

## Configuración

1. Instalar dependencias:
```bash
npm install
```

2. Crear archivo `.env` basado en `.env.example` y configurar:
   - `PORT`: Puerto del servidor (default: 8787)
   - `ORIGIN`: URL del frontend (producción o dev)
   - `BACKEND_URL`: URL pública del backend (para notification_url)
   - `MP_ACCESS_TOKEN`: Token de acceso de Mercado Pago
   - `SUPABASE_URL`: URL de tu proyecto Supabase
   - `SUPABASE_SERVICE_ROLE_KEY`: Service role key de Supabase

3. Ejecutar en desarrollo:
```bash
npm run dev
```

4. Ejecutar en producción:
```bash
npm start
```

## Endpoints

- `GET /health` - Health check
- `POST /payments/create-preference` - Crear preferencia de pago
- `POST /payments/webhook` - Webhook para notificaciones de Mercado Pago

## Variables de entorno del Frontend

Configurar en el frontend:
```
VITE_BACKEND_URL=https://url-del-backend
```

En desarrollo: `http://localhost:8787`
