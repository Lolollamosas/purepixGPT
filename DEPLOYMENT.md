# PurePix - Guía de Despliegue a Producción

## ✅ Checklist Pre-Producción

### 1. Unificación Cliente Supabase ✅
- [x] Todos los archivos importan desde `@/lib/supabase`
- [x] `src/integrations/supabase/client.ts` solo reexporta
- [x] Sin claves hardcodeadas en código
- [x] Variables de entorno validadas en `src/lib/supabase.ts`

### 2. Backend Mercado Pago ✅
- [x] Carpeta `server/` creada con Express
- [x] Endpoints implementados:
  - `GET /health` - Health check
  - `POST /payments/create-preference` - Crear preferencia
  - `POST /payments/webhook` - Webhook de MP
- [x] Tablas en Supabase:
  - `payments` - Registro de pagos
  - `payments_events` - Eventos de webhook
- [x] RLS habilitado en ambas tablas

### 3. Cámara Estricta ✅
- [x] Componente `StrictCameraCapture.tsx` creado
- [x] `ImageUploader.tsx` modificado:
  - Detecta disponibilidad de cámara
  - Muestra cámara en vivo en móviles
  - Bloquea subida desde galería
  - Mensaje en desktop sin cámara
- [x] Integrado con `CreatePost.tsx`

### 4. Storage Policies ✅
- [x] Bucket `post-images` configurado
- [x] Políticas RLS implementadas:
  - Lectura pública
  - Subida solo usuarios autenticados
  - Borrado solo por dueño

### 5. Variables de Entorno

#### Frontend (.env)
```env
# Supabase
VITE_SUPABASE_URL=https://cdvcgpcyjdvaoilzibdk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Backend API
VITE_BACKEND_URL=https://<URL-BACKEND-PRODUCCION>

# Blockchain (Polygon)
VITE_CHAIN_ID=80002                           # Amoy testnet (137 para mainnet)
VITE_RPC_URL=https://rpc-amoy.polygon.technology/
VITE_NFT_CONTRACT_ADDRESS=0x...               # Dirección del contrato NFT
VITE_MARKETPLACE_CONTRACT_ADDRESS=0x...       # Dirección del contrato Marketplace

# IPFS (Pinata)
VITE_PINATA_JWT=eyJhbGciOi...                 # JWT de Pinata
# O usar API Key/Secret:
# VITE_PINATA_API_KEY=...
# VITE_PINATA_SECRET_KEY=...
```

#### Backend (server/.env)
```env
PORT=8787
ORIGIN=https://<URL-FRONTEND-PRODUCCION>
BACKEND_URL=https://<URL-BACKEND-PRODUCCION>  # URL pública del backend
MP_ACCESS_TOKEN=<TOKEN-MERCADO-PAGO>
SUPABASE_URL=https://cdvcgpcyjdvaoilzibdk.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<SERVICE-ROLE-KEY>
```

## 📦 Despliegue del Backend

### Opción 1: Railway / Render
1. Conectar repositorio
2. Configurar carpeta raíz: `server/`
3. Comando build: `npm install`
4. Comando start: `npm start`
5. Agregar variables de entorno

### Opción 2: Vercel (Serverless)
1. Crear `server/vercel.json`:
```json
{
  "version": 2,
  "builds": [
    { "src": "src/index.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "src/index.js" }
  ]
}
```
2. Deploy: `vercel --prod`

### Opción 3: DigitalOcean App Platform
1. Crear nueva App
2. Configurar desde GitHub
3. Agregar variables de entorno
4. Deploy automático

## 🔐 Configuración de Supabase Auth

En el dashboard de Supabase (`https://supabase.com/dashboard/project/cdvcgpcyjdvaoilzibdk/auth/url-configuration`):

1. **Site URL**: `https://<dominio-frontend>`
2. **Redirect URLs**:
   - `https://<dominio-frontend>/auth/login`
   - `https://<dominio-frontend>/auth/reset-password`
   - `http://localhost:5173/auth/login` (dev)
   - `http://localhost:5173/auth/reset-password` (dev)

## 🧪 Testing Pre-Producción

### Frontend
```bash
npm run build
npm run preview
```

### Backend
```bash
cd server
npm install
npm run dev
```

### Tests Críticos
1. ✅ Login/Registro funciona
2. ✅ Captura de foto con cámara (solo móvil)
3. ✅ Mensaje de bloqueo en desktop sin cámara
4. ✅ Subida de imagen a Supabase Storage
5. ✅ Creación de preferencia de pago
6. ✅ Webhook recibe notificaciones
7. ✅ Mint NFT (conectar wallet + confirmar tx)
8. ✅ Subida a IPFS (imagen + metadata)

## ⚠️ Advertencias de Seguridad (No críticas para MVP)

Las siguientes advertencias fueron detectadas pero NO bloquean el despliegue:

1. **Function Search Path Mutable** (3 funciones)
   - Funciones: `generate_image_hash`, `handle_new_user`, `update_user_images_updated_at`
   - Impacto: Bajo - funciones de utilidad internas
   - Acción: Revisar post-MVP

2. **Auth OTP long expiry**
   - Configuración por defecto de Supabase
   - Acción: Ajustar en Settings → Auth si es necesario

3. **Leaked Password Protection Disabled**
   - Feature opcional de Supabase
   - Acción: Habilitar en Settings → Auth

4. **Postgres version**
   - Actualización disponible
   - Acción: Programar actualización fuera de horario pico

## 📱 Verificación Final

Antes de publicar, verificar:

- [ ] Frontend desplegado y accesible
- [ ] Backend responde en `/health`
- [ ] Variables de entorno configuradas (todas)
- [ ] Auth URLs configuradas en Supabase
- [ ] Mercado Pago en modo producción (no test)
- [ ] Contratos NFT desplegados en Polygon
- [ ] Pinata IPFS configurado
- [ ] Dominios HTTPS configurados
- [ ] CORS configurado correctamente en backend

## 🔗 Despliegue de Contratos NFT

### Polygon Amoy (Testnet)
1. Ir a `contracts/`
2. Configurar `.env` con `PRIVATE_KEY`
3. Desplegar contratos:
```bash
npx hardhat run scripts/deploy.js --network mumbai
```
4. Copiar direcciones de contratos a `.env` del frontend

### Polygon Mainnet (Producción)
Cambiar red en `hardhat.config.js` y desplegar con:
```bash
npx hardhat run scripts/deploy.js --network polygon
```

## 📝 Evidencias de QA

### Auth
- [ ] Video/capturas de registro exitoso
- [ ] Video/capturas de login exitoso
- [ ] Video/capturas de reset password

### Cámara
- [ ] Video en móvil: cámara abre y captura foto
- [ ] Captura en desktop: mensaje de bloqueo

### Storage
- [ ] Archivo subido a `post-images/<uid>/...`
- [ ] URL pública accesible
- [ ] Usuario anónimo NO puede subir

### Pagos (Mercado Pago)
- [ ] `GET /health` responde `{ok: true}`
- [ ] Checkout Pro se abre correctamente
- [ ] Eventos registrados en `payments_events`

### NFT On-Chain
- [ ] Hash de transacción de mint
- [ ] Link al explorer (Amoy/Polygon)
- [ ] NFT visible en wallet (opcional)
- [ ] Hash de listado/gift/auction (opcional)

## 🚀 Go Live

1. Desplegar backend
2. Actualizar `VITE_BACKEND_URL` en frontend
3. Desplegar frontend
4. Configurar Auth URLs en Supabase
5. Probar flujo completo con usuario real
6. ¡Lanzar! 🎉

## 📞 Soporte

Para problemas post-despliegue:
- Logs del backend: Revisar plataforma de hosting
- Logs de Supabase: Dashboard → Database → Logs
- Edge Functions: Dashboard → Functions → Logs
