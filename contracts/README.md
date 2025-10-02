# PurePix Smart Contracts

Contratos inteligentes para el marketplace de NFTs de PurePix.

## Setup

1. **Instalar dependencias:**
```bash
cd contracts
npm install
```

2. **Configurar variables de entorno:**
```bash
cp .env.example .env
# Editar .env con tu PRIVATE_KEY
```

3. **Compilar contratos:**
```bash
npm run compile
```

4. **Deploy en Mumbai (Polygon Testnet):**
```bash
npm run deploy:mumbai
```

5. **Deploy en Base Goerli:**
```bash
npm run deploy:base
```

## Después del Deploy

1. Copia las direcciones que aparecen en la consola
2. Actualiza `src/lib/blockchain.ts` con las nuevas direcciones:

```typescript
export const NFT_CONTRACT_ADDRESS = 'direccion_del_nft';
export const MARKETPLACE_CONTRACT_ADDRESS = 'direccion_del_marketplace';
```

## Contratos

- **PurePixNFT.sol**: Contrato ERC721 para mintear NFTs de fotos
- **PurePixMarketplace.sol**: Marketplace para vender, regalar y subastar NFTs

## Funcionalidades

- ✅ Mint de NFTs
- ✅ Venta a precio fijo
- ✅ Regalos (transferencias gratuitas)
- ✅ Subastas con tiempo límite
- ✅ Sistema de reembolsos para pujas perdedoras