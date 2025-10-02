# 🚀 PurePix - GUÍA EJECUTABLE PARA PRODUCCIÓN

**Estado del código**: ✅ 100% LISTO  
**Acción requerida**: Ejecutar pasos manuales abajo

---

## 📋 RESUMEN EJECUTIVO

Esta guía te llevará paso a paso para:
1. ✅ Deployar el backend y obtener su URL pública
2. ✅ Configurar variables de entorno (backend y frontend)
3. ✅ Configurar Supabase Auth URLs
4. ✅ Ejecutar QA completo y recopilar evidencias

**Tiempo estimado**: 30-45 minutos  
**No se modificará el diseño del corazón** ❤️

---

## 🎯 PASO 1: DEPLOY DEL BACKEND

### 1.1 Preparar el backend para deploy

El backend está en la carpeta `server/` del repo y es un servidor Node.js/Express.

**Requisitos**:
- Node.js 18+
- npm 9+

### 1.2 Elegir plataforma de hosting

Recomendamos **Railway** o **Render** (ambas tienen free tier):

#### Opción A: Railway (Recomendado)
1. Ir a https://railway.app
2. Click en "Start a New Project" → "Deploy from GitHub repo"
3. Seleccionar tu repo de PurePix
4. **IMPORTANTE**: Configurar "Root Directory" como `server`
5. Railway detectará automáticamente que es Node.js

#### Opción B: Render
1. Ir a https://render.com
2. Click en "New +" → "Web Service"
3. Conectar tu repo de GitHub
4. **IMPORTANTE**: Configurar "Root Directory" como `server`
5. Build Command: `npm install`
6. Start Command: `npm start`

### 1.3 Configurar variables de entorno del BACKEND

En tu plataforma elegida (Railway/Render), agregar estas variables de entorno:

```env
PORT=8787
ORIGIN=https://AQUI_VA_EL_DOMINIO_DE_TU_FRONTEND
BACKEND_URL=https://AQUI_VA_LA_URL_PUBLICA_DE_ESTE_BACKEND
MP_ACCESS_TOKEN=AQUI_VA_TU_TOKEN_DE_MERCADO_PAGO
SUPABASE_URL=https://cdvcgpcyjdvaoilzibdk.supabase.co
SUPABASE_SERVICE_ROLE_KEY=AQUI_VA_LA_SERVICE_ROLE_KEY_DE_SUPABASE
```

**Dónde obtener cada valor**:

| Variable | Dónde obtenerla |
|----------|----------------|
| `ORIGIN` | URL de tu frontend en Lovable (ej: `https://tuapp.lovable.app`) |
| `BACKEND_URL` | La URL pública que te dará Railway/Render después del deploy |
| `MP_ACCESS_TOKEN` | Panel de Mercado Pago → Credenciales (usar TEST primero) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API → `service_role` key (secreta) |

**⚠️ IMPORTANTE**: Después de obtener la URL pública del backend (ej: `https://purepix-backend-abc123.railway.app`), ACTUALIZAR la variable `BACKEND_URL` con ese valor.

### 1.4 Verificar el deploy del backend

Una vez deployado, confirmar que funciona:

```bash
curl https://TU-BACKEND-URL.com/health
```

**Respuesta esperada**:
```json
{"ok":true}
```

Si ves `{"ok":true}` → ✅ Backend funcionando correctamente

---

## 🎯 PASO 2: CONFIGURAR VARIABLES DEL FRONTEND

### 2.1 Ir a configuración de variables en Lovable

1. Abrir tu proyecto PurePix en Lovable
2. Click en el menú (⚙️) → "Environment Variables"

### 2.2 Agregar variables requeridas

**Variables REQUERIDAS** (sin estas no funciona):

```env
VITE_SUPABASE_URL=https://cdvcgpcyjdvaoilzibdk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkdmNncGN5amR2YW9pbHppYmRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NjU4NDgsImV4cCI6MjA2MzM0MTg0OH0.aoef5FSN7GsVf9EjQ2ymqlDI9MHYWH-k4RcfUH_Hecs
VITE_BACKEND_URL=https://TU-BACKEND-URL-DEL-PASO-1.com
```

**Variables OPCIONALES** (solo si activarás NFT/IPFS ahora):

```env
# IPFS (Pinata) - para subir imágenes a IPFS
VITE_PINATA_JWT=TU_TOKEN_DE_PINATA

# Blockchain (Polygon)
VITE_CHAIN_ID=80002
VITE_RPC_URL=https://rpc-amoy.polygon.technology/
VITE_NFT_CONTRACT_ADDRESS=0xDIRECCION_DE_TU_CONTRATO_NFT
VITE_MARKETPLACE_CONTRACT_ADDRESS=0xDIRECCION_DE_TU_CONTRATO_MARKETPLACE
```

**Dónde obtener valores opcionales**:

| Variable | Dónde obtenerla |
|----------|----------------|
| `VITE_PINATA_JWT` | https://app.pinata.cloud → API Keys → New Key |
| `VITE_NFT_CONTRACT_ADDRESS` | Después de desplegar contratos (ver PASO 5 opcional) |
| `VITE_MARKETPLACE_CONTRACT_ADDRESS` | Después de desplegar contratos (ver PASO 5 opcional) |

### 2.3 Guardar y redesplegar frontend

1. Click en "Save" en las variables de entorno
2. Lovable reconstruirá el frontend automáticamente

---

## 🎯 PASO 3: CONFIGURAR SUPABASE AUTH

### 3.1 Ir al dashboard de Supabase

1. Ir a https://supabase.com/dashboard
2. Seleccionar el proyecto `cdvcgpcyjdvaoilzibdk`
3. Ir a **Authentication** → **URL Configuration**

### 3.2 Configurar Site URL

En el campo **Site URL**, poner:
```
https://TU-DOMINIO-FRONTEND.lovable.app
```

(Usar la URL real de tu frontend desplegado en Lovable)

### 3.3 Configurar Redirect URLs

En **Redirect URLs**, agregar (una por línea):

```
https://TU-DOMINIO-FRONTEND.lovable.app/auth/login
https://TU-DOMINIO-FRONTEND.lovable.app/auth/reset-password
http://localhost:5173/auth/login
http://localhost:5173/auth/reset-password
```

**Nota**: Las URLs de localhost son para desarrollo local.

### 3.4 Guardar configuración

Click en "Save" en la parte inferior.

---

## 🎯 PASO 4: QA END-TO-END (RECOPILAR EVIDENCIAS)

Ahora vamos a probar todo el sistema y recopilar evidencias.

### 4.1 QA: Autenticación ✅

**Qué probar**:
1. Ir a tu frontend → Click en "Registrarse"
2. Crear un nuevo usuario con email y contraseña
3. Confirmar que puedes hacer login
4. Probar "Olvidé mi contraseña" (opcional)

**Evidencia requerida**:
- ✅ Captura de pantalla del registro exitoso
- ✅ Captura de pantalla del login exitoso

---

### 4.2 QA: Cámara Estricta ✅

**Qué probar**:

**En móvil** (con cámara):
1. Abrir el frontend en un móvil real (no emulador)
2. Ir a "Feed" o "Create Post"
3. Click en el botón de captura de foto
4. Confirmar que la cámara se abre en vivo
5. Tomar una foto
6. Confirmar que se sube correctamente

**En desktop** (sin cámara o navegador sin acceso):
1. Abrir el frontend en una computadora
2. Ir a "Feed" o "Create Post"
3. Click en el botón de captura de foto
4. Confirmar que aparece un mensaje de "No hay cámara disponible" o similar

**Evidencia requerida**:
- ✅ Video corto (10-15 seg) de captura en móvil (puede ser GIF)
- ✅ Captura de pantalla del mensaje de bloqueo en desktop

---

### 4.3 QA: Storage (Supabase) ✅

**Qué probar**:
1. Después de subir una foto (desde móvil), ir a:
   - Supabase Dashboard → Storage → `post-images`
2. Confirmar que hay un archivo en la ruta: `post-images/<tu-user-id>/...`
3. Click en el archivo y copiar la URL pública
4. Pegar la URL en el navegador y confirmar que la imagen se ve

**Probar con usuario anónimo** (sin login):
1. Abrir el frontend en modo incógnito (sin hacer login)
2. Intentar subir una foto
3. Confirmar que NO permite subir (debe pedir login)

**Evidencia requerida**:
- ✅ Captura de pantalla del archivo en Supabase Storage
- ✅ URL pública de la imagen funcionando
- ✅ Captura del bloqueo para usuario anónimo

---

### 4.4 QA: Pagos (Mercado Pago) ✅

**Pre-requisito**: Asegurar que `MP_ACCESS_TOKEN` esté configurado en el backend (TEST token primero).

**Qué probar**:

**1. Health check del backend**:
```bash
curl https://TU-BACKEND-URL.com/health
```
Debe responder: `{"ok":true}`

**2. Crear una preferencia de pago**:
1. Desde el frontend (logueado), ir a alguna funcionalidad que genere un pago
2. Confirmar que se abre el Checkout Pro de Mercado Pago en una nueva ventana
3. (Opcional) Completar el pago en modo test

**3. Verificar webhook**:
1. Ir a Supabase Dashboard → SQL Editor
2. Ejecutar estas queries:

```sql
-- Ver últimos pagos creados
SELECT * FROM payments ORDER BY created_at DESC LIMIT 3;

-- Ver últimos eventos de webhook
SELECT * FROM payments_events ORDER BY created_at DESC LIMIT 3;
```

**Evidencia requerida**:
- ✅ Captura del health check (`{"ok":true}`)
- ✅ Captura del Checkout Pro abierto
- ✅ Resultado de las queries SQL (capturas de las tablas)

---

### 4.5 QA: NFT On-Chain (OPCIONAL - Solo si activaste blockchain)

**Pre-requisitos**:
- Tener `VITE_PINATA_JWT` configurado
- Tener `VITE_NFT_CONTRACT_ADDRESS` configurado
- Tener `VITE_MARKETPLACE_CONTRACT_ADDRESS` configurado
- Tener MetaMask instalado y conectado a Polygon Amoy testnet

**Qué probar**:
1. Desde el frontend, capturar una foto
2. Cuando aparezca la opción de "Crear NFT", click ahí
3. Conectar wallet (MetaMask)
4. Confirmar la transacción de mint
5. Esperar confirmación y copiar el hash de transacción

**Evidencia requerida**:
- ✅ Hash de transacción de mint (ej: `0xabc123...`)
- ✅ Link al explorer de Amoy Polygonscan con la transacción
- ✅ Confirmar que el `tokenURI` en el NFT apunta a `ipfs://...`

**Para ver el tokenURI**:
1. Ir a https://amoy.polygonscan.com/tx/TU-HASH-DE-TRANSACCION
2. Click en la pestaña "Logs"
3. Buscar el campo `tokenURI` o ir al contrato y llamar a `tokenURI(tokenId)`

---

## 📦 ENTREGABLES FINALES

Una vez completado todo el QA, recopilar:

### 1. URLs Públicas
```
Frontend: https://...
Backend: https://...
```

### 2. Lista de Variables de Entorno Activas

**Backend**:
```
PORT=8787
ORIGIN=https://...
BACKEND_URL=https://...
MP_ACCESS_TOKEN=TEST-...
SUPABASE_URL=https://cdvcgpcyjdvaoilzibdk.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

**Frontend**:
```
VITE_SUPABASE_URL=https://cdvcgpcyjdvaoilzibdk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_BACKEND_URL=https://...
# (y las opcionales si las usaste)
```

### 3. Evidencias de QA
- [ ] Auth: Capturas de registro y login
- [ ] Cámara: Video en móvil + captura de bloqueo en desktop
- [ ] Storage: Capturas de archivo en Supabase + URL pública
- [ ] Pagos: Capturas de health, checkout y queries SQL
- [ ] NFT (opcional): Hash + link al explorer

### 4. ZIP del Código Final
Exportar el repo completo con todos los cambios.

---

## 🚨 TROUBLESHOOTING

### Problema: Backend no responde en /health
**Solución**: Verificar que las variables de entorno estén correctamente configuradas y que el servicio esté corriendo.

### Problema: CORS error al crear preferencia de pago
**Solución**: Verificar que `ORIGIN` en el backend coincida exactamente con la URL del frontend (incluir https://).

### Problema: Auth redirect a localhost:3000
**Solución**: Verificar que las Redirect URLs en Supabase estén configuradas correctamente (PASO 3).

### Problema: No se puede subir imagen
**Solución**: Verificar que el usuario esté logueado y que el bucket `post-images` tenga las políticas RLS correctas.

### Problema: Webhook no recibe notificaciones
**Solución**: Verificar que `BACKEND_URL` apunte a la URL pública real del backend (no localhost).

---

## ✅ CHECKLIST FINAL

Antes de dar por terminado:

- [ ] Backend deployado y respondiendo en `/health`
- [ ] Variables de entorno configuradas (backend y frontend)
- [ ] Auth URLs configuradas en Supabase
- [ ] QA de Auth completado con evidencias
- [ ] QA de Cámara completado con evidencias
- [ ] QA de Storage completado con evidencias
- [ ] QA de Pagos completado con evidencias
- [ ] QA de NFT completado (si aplica) con evidencias
- [ ] No se modificó el diseño del corazón ❤️
- [ ] Todas las evidencias recopiladas
- [ ] ZIP del código final generado

---

## 🎉 ¡LISTO PARA PRODUCCIÓN!

Una vez completados todos los pasos y recopiladas las evidencias, tu app PurePix estará 100% operativa en producción.

**Recordatorios finales**:
- ⚠️ Cambiar `MP_ACCESS_TOKEN` de TEST a PRODUCCIÓN cuando estés listo para cobros reales
- ⚠️ Si deployaste en Amoy testnet, cambiar a Polygon Mainnet para NFTs reales
- ⚠️ Monitorear logs de backend y Supabase después del lanzamiento

---

**¿Dudas o problemas?**  
Revisa la sección de Troubleshooting o consulta los otros archivos de documentación: `PRODUCTION_CHECKLIST.md` y `DEPLOYMENT.md`.
