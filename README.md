# Portfolio 3D Interattivo

Un portfolio web interattivo realizzato con React, Three.js e TypeScript, che presenta un ambiente 3D navigabile con un computer interattivo.

## Requisiti di Sistema

- Node.js (versione 18 o superiore)
- npm (incluso con Node.js)
- Un browser moderno con supporto WebGL

## Tecnologie Utilizzate

- React 18
- TypeScript
- Three.js
- React Three Fiber
- Vite
- Tailwind CSS

## Installazione

1. Clona il repository:
\`\`\`bash
git clone <repository-url>
cd 3d-portfolio
\`\`\`

2. Installa le dipendenze:
\`\`\`bash
npm install
\`\`\`

3. Avvia il server di sviluppo:
\`\`\`bash
npm run dev
\`\`\`

4. Apri il browser e naviga a:
\`\`\`
http://localhost:5173
\`\`\`

## Struttura del Progetto

\`\`\`
src/
  ├── components/        # Componenti React
  │   ├── Computer/     # Componente computer interattivo
  │   ├── OS/           # Sistema operativo virtuale
  │   └── UI/           # Interfaccia utente
  ├── hooks/            # Hook personalizzati
  ├── models/           # Modelli 3D
  ├── scenes/           # Scene 3D
  └── utils/            # Utility functions
\`\`\`

## Comandi Disponibili

- \`npm run dev\`: Avvia il server di sviluppo
- \`npm run build\`: Crea la build di produzione
- \`npm run preview\`: Visualizza la build di produzione in locale

## Note per lo Sviluppo

- Il progetto utilizza TypeScript per il type checking
- Tailwind CSS è configurato per lo styling
- I modelli 3D devono essere in formato .glb o .gltf
- Le texture devono essere ottimizzate per il web

## Risoluzione dei Problemi Comuni

### Il progetto non si avvia

1. Verifica di avere Node.js installato:
\`\`\`bash
node --version
\`\`\`

2. Cancella la cartella node_modules e reinstalla:
\`\`\`bash
rm -rf node_modules
npm install
\`\`\`

### Errori WebGL

- Assicurati che il tuo browser supporti WebGL
- Verifica che la scheda grafica sia aggiornata
- Prova a disabilitare l'accelerazione hardware del browser

### Performance Scarse

- Riduci la qualità dei modelli 3D
- Ottimizza le texture
- Utilizza il profiler di Chrome per identificare i colli di bottiglia

## Licenza

MIT