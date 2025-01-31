export const ENVIRONMENT_CONFIG = {
  // Illuminazione
  lighting: {
    // Luce naturale dalla finestra
    window: {
      color: '#fdf4e3',  // Luce calda naturale
      intensity: 1.2,
      position: [0, 2, -3.9],  // Posizionata alla finestra
      size: [1.2, 1.5]  // Dimensioni della finestra
    },
    // Luce ambiente generale
    ambient: {
      color: '#ffffff',
      intensity: 0.4
    },
    // Luce di riempimento per le ombre
    fill: {
      color: '#b6d1ff',  // Leggera tinta blu per simulare il cielo
      intensity: 0.2
    }
  },

  // Materiali e Colori
  materials: {
    walls: {
      color: '#e6e6e6',
      roughness: 0.95,
      metalness: 0
    },
    floor: {
      color: '#d4cdc5',  // Colore parquet
      roughness: 0.8,
      metalness: 0
    },
    desk: {
      color: '#8b4513',
      roughness: 0.7,
      metalness: 0
    },
    metals: {
      roughness: 0.2,
      metalness: 0.8
    }
  },

  // Post Processing
  postProcessing: {
    bloom: {
      enabled: true,
      intensity: 0.5,
      threshold: 0.9,
      radius: 0.4
    },
    ambientOcclusion: {
      enabled: true,
      intensity: 1.5,
      radius: 0.5
    },
    colorGrading: {
      enabled: true,
      temperature: 4000,  // Temperatura colore calda
      tint: 0.2
    }
  },

  // Dettagli Ambientali
  details: {
    dust: {
      enabled: true,
      particleCount: 100,
      size: 0.02,
      speed: 0.1
    },
    paperwork: {
      // Posizioni casuali per fogli e post-it
      positions: [
        [-0.3, 0.81, -0.1],
        [0.2, 0.81, 0.1],
        [-0.1, 0.81, 0.2],
        [0.4, 0.81, -0.15]
      ],
      rotations: [15, -10, 5, -20]  // Rotazioni casuali in gradi
    }
  },

  // Vista dalla Finestra
  cityView: {
    timeOfDay: 'evening',  // Momento del giorno
    fogDensity: 0.015,
    fogColor: '#1a1a2e',
    buildingCount: 50,
    buildingConfig: {
      minHeight: 5,
      maxHeight: 30,
      minWidth: 2,
      maxWidth: 4,
      spacing: 2,
      colors: ['#1a1a2e', '#16213e', '#0f3460']
    },
    lights: {
      count: 100,
      colors: ['#ffd700', '#ff8c00', '#ff4500'],
      intensity: 0.8,
      size: 0.05
    }
  }
}