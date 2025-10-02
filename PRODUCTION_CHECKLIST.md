# PurePix - Checklist de Producción

## ✅ Estado del Código
✓ Backend configurado con `BACKEND_URL` para webhooks
✓ IPFS service creado (`src/services/ipfs.ts`)
✓ Blockchain service usa variables de entorno
✓ CreatePost sube a IPFS antes de mintear
✓ Todo el código usa `@/lib/supabase` (sin duplicados)

---

## 📋 Pasos Manuales Restantes

### 1️⃣ Deploy del Backend (server/)

**Plataformas recomendadas:**
- Railway: https://railway.app
- Render: https://render.com
- Vercel (Serverless)
- DigitalOcean App Platform

**Pasos:**
1. Deployar la carpeta `server/` del repositorio
2. Obtener la URL pública del backend (ej: `https://purepix-backend.railway.app`)
3. Configurar las siguientes variables de entorno **EN EL SERVICIO DE BACKEND**:

```bash
PORT=8787
ORIGIN=https://purepix.lovable.app  # o tu dominio custom
BACKEND_URL=https://purepix-backend.railway.app  # URL pública del backend
MP_ACCESS_TOKEN=TEST-xxxxx  # o PROD-xxxxx para producción
SUPABASE_URL=https://cdvcgpcyjdvaoilzibdk.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # Service role key (secreta)
```

**Verificar:**
```bash
curl https://purepix-backend.railway.app/health
# Debe devolver: {"ok":true}
```

---

### 2️⃣ Variables de Entorno del Frontend (Lovable)

**Ir a:** Lovable → Project Settings → Environment Variables

**Configurar:**

```bash
# Supabase (REQUERIDO)
VITE_SUPABASE_URL=https://cdvcgpcyjdvaoilzibdk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkdmNncGN5amR2YW9pbHppYmRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NjU4NDgsImV4cCI6MjA2MzM0MTg0OH0.aoef5FSN7GsVf9EjQ2ymqlDI9MHYWH-k4RcfUH_Hecs
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkdmNncGN5amR2YW9pbHppYmRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NjU4NDgsImV4cCI6MjA2MzM0MTg0OH0.aoef5FSN7GsVf9EjQ2ymqlDI9MHYWH-k4RcfUH_Hecs
VITE_SUPABASE_PROJECT_ID=cdvcgpcyjdvaoilzibdk

# Backend (REQUERIDO para pagos)
VITE_BACKEND_URL=https://purepix-backend.railway.app  # URL del paso 1

# IPFS/Pinata (OPCIONAL - solo si activan NFT real)
VITE_PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # JWT de Pinata
# O alternativamente:
# VITE_PINATA_API_KEY=xxxxx
# VITE_PINATA_SECRET_KEY=xxxxx

# Blockchain (OPCIONAL - solo si activan NFT real)
VITE_CHAIN_ID=80002  # Amoy testnet (o 137 para Polygon mainnet)
VITE_RPC_URL=https://rpc-amoy.polygon.technology/  # o Alchemy/Infura URL
VITE_NFT_CONTRACT_ADDRESS=0x...  # Dirección del contrato NFT desplegado
VITE_MARKETPLACE_CONTRACT_ADDRESS=0x...  # Dirección del contrato Marketplace
```

---

### 3️⃣ Supabase Auth - Configuración de URLs

**Ir a:** https://supabase.com/dashboard/project/cdvcgpcyjdvaoilzibdk/auth/url-configuration

**Configurar:**

1. **Site URL:**
   ```
   https://purepix.lovable.app
   ```
   (o tu dominio custom: `https://tudominio.com`)

2. **Redirect URLs** (agregar estas 2):
   ```
   https://purepix.lovable.app/auth/login
   https://purepix.lovable.app/auth/reset-password
   ```
   (o con tu dominio custom)

**Para desarrollo local (opcional):**
```
http://localhost:5173
http://localhost:5173/auth/login
http://localhost:5173/auth/reset-password
```

---

### 4️⃣ QA End-to-End (Evidencias Requeridas)

#### A) Autenticación ✓
- [ ] Registro de nuevo usuario funciona
- [ ] Login con usuario existente funciona
- [ ] Reset password funciona (email recibido y cambio exitoso)
- **Evidencia:** Capturas de pantalla de cada flujo

#### B) Cámara Estricta (StrictCameraCapture) ✓
- [ ] En móvil: abre la cámara nativa y permite capturar/subir
- [ ] En desktop sin cámara: muestra mensaje de bloqueo y no permite continuar
- **Evidencia:** Video corto mostrando ambos casos

#### C) Storage (Supabase) ✓
- [ ] Foto se guarda en `post-images/<user_id>/...`
- [ ] URL pública de la foto es accesible
- [ ] Usuario anónimo (sin login) NO puede subir fotos
- **Evidencia:** 
  - Captura del bucket en Supabase con la foto subida
  - Captura de la URL pública funcionando
  - Captura del error cuando anónimo intenta subir

#### D) Pagos (Mercado Pago) ✓
1. **Health check:**
   ```bash
   curl https://purepix-backend.railway.app/health
   ```
   Debe devolver: `{"ok":true}`

2. **Crear preferencia desde el front:**
   - Clic en botón de pago/compra
   - Se abre Checkout Pro de Mercado Pago
   - Completar o cancelar el pago

3. **Verificar en Supabase:**
   ```sql
   -- Verificar que se creó la preferencia
   SELECT * FROM payments ORDER BY created_at DESC LIMIT 3;
   
   -- Verificar que llegaron webhooks de MP
   SELECT * FROM payments_events ORDER BY created_at DESC LIMIT 3;
   ```

- **Evidencia:**
  - Captura del health check exitoso
  - Captura de Checkout Pro abriéndose
  - Capturas de las queries SQL mostrando datos en ambas tablas

#### E) NFT Real (OPCIONAL - solo si activan blockchain) ✓
- [ ] Conectar MetaMask con red Polygon Amoy (chainId: 80002)
- [ ] Mintear un post desde la app
- [ ] Transacción confirmada en la blockchain
- [ ] TokenURI apunta a `ipfs://<cid>` (metadata subida vía Pinata)
- **Evidencia:**
  - Hash de transacción (ej: `0xabc123...`)
  - Link al explorer: `https://amoy.polygonscan.com/tx/0xabc123...`
  - Captura del NFT en el explorer mostrando tokenURI

---

## 🔒 Seguridad - Verificaciones Finales

- [ ] NO hay claves hardcodeadas en el código
- [ ] Todas las claves sensibles están en variables de entorno
- [ ] `MP_ACCESS_TOKEN` y `SUPABASE_SERVICE_ROLE_KEY` solo están en el backend
- [ ] El frontend solo usa `VITE_SUPABASE_ANON_KEY` (publishable, segura)
- [ ] RLS policies activas en todas las tablas de Supabase
- [ ] Storage policy permite solo usuarios autenticados subir a su propia carpeta

---

## 📦 Entregables Finales

1. **URL pública del backend** (ej: `https://purepix-backend.railway.app`)
2. **URL pública del frontend** (ej: `https://purepix.lovable.app`)
3. **Listado de variables de entorno** configuradas (frontend y backend)
4. **Evidencias de QA:**
   - Capturas de Auth (registro/login/reset)
   - Video corto de cámara (móvil y desktop)
   - Capturas de Storage (bucket + URL pública + error anónimo)
   - Capturas de Pagos (health + Checkout Pro + queries SQL)
   - [Opcional] Hash + link al explorer para NFT

---

## 🚀 URLs Útiles

- **Supabase Dashboard:** https://supabase.com/dashboard/project/cdvcgpcyjdvaoilzibdk
- **Auth Config:** https://supabase.com/dashboard/project/cdvcgpcyjdvaoilzibdk/auth/url-configuration
- **Storage Buckets:** https://supabase.com/dashboard/project/cdvcgpcyjdvaoilzibdk/storage/buckets
- **Database Tables:** https://supabase.com/dashboard/project/cdvcgpcyjdvaoilzibdk/editor
- **Polygon Amoy Explorer:** https://amoy.polygonscan.com/
- **Polygon Mainnet Explorer:** https://polygonscan.com/

---

## ⚠️ Notas Importantes

- **NO modificar el diseño del corazón** - Ya está correcto
- **BACKEND_URL** debe ser la URL pública del backend (sin trailing slash)
- **ORIGIN** en el backend debe ser la URL del frontend (sin trailing slash)
- Para **pruebas de MP**, usar `TEST-` token; para **producción**, usar `PROD-` token
- Si no pueden configurar Supabase Auth URLs, proporciónennos las URLs exactas y lo configuramos nosotros

---

## ✨ Checklist Rápido

- [ ] Backend deployado y health OK
- [ ] Variables del backend configuradas
- [ ] Variables del frontend configuradas en Lovable
- [ ] Supabase Auth URLs configuradas
- [ ] QA Auth completado
- [ ] QA Cámara completado
- [ ] QA Storage completado
- [ ] QA Pagos completado
- [ ] [Opcional] QA NFT completado
- [ ] Evidencias recopiladas y enviadas
