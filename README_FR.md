<div align="center">
  <h1>@dimer47/capacitor-microphone</h1>

Un plugin Capacitor pour l'enregistrement audio avec support du **pause/reprise**, des **événements de statut en temps réel** et une compatibilité multiplateforme.

[![npm version](https://badge.fury.io/js/%40dimer47%2Fcapacitor-microphone.svg)](https://www.npmjs.com/package/@dimer47/capacitor-microphone)
[![License](https://img.shields.io/npm/l/@dimer47/capacitor-microphone.svg)](/LICENSE)

</div>

> **[Read in English](README.md)**

## A propos

Ce plugin est un fork de [`@mozartec/capacitor-microphone`](https://github.com/mozartec/capacitor-microphone) initialement créé par [Mozart](https://github.com/mozartec). Nous remercions chaleureusement le développeur original pour les bases solides qu'il a posées.

Ce fork a été créé pour ajouter un **contrôle avancé de l'enregistrement** nécessaire pour les cas d'usage d'enregistrement audio de longue durée (réunions, interviews, cours, etc.) :

- **Pause & Reprise** — Contrôle complet du flux d'enregistrement sans perte de données
- **Suivi du statut** — Interrogation de l'état de l'enregistrement à tout moment
- **Événements natifs** — Notifications en temps réel des changements d'état via des écouteurs d'événements
- Support complet sur les 3 plateformes : **iOS**, **Android** et **Web**

## Support des plateformes

|              | iOS                  | Android              | Web                  |
| ------------ | -------------------- | -------------------- | -------------------- |
| Disponibilité | :heavy_check_mark:  | :heavy_check_mark:   | :heavy_check_mark:   |
| Encodage     | kAudioFormatMPEG4AAC (audio/aac) | MPEG_4 / AAC (audio/aac) | audio/webm ou audio/mp4 ou audio/ogg ou audio/wav |
| Extension    | .m4a                 | .m4a                 | .webm ou .mp4 ou .ogg ou .wav |

## Installation

```bash
npm install @dimer47/capacitor-microphone
npx cap sync
```

## Configuration iOS

Ajoutez la description d'utilisation suivante dans le fichier `Info.plist` de votre application :

- `NSMicrophoneUsageDescription` (`Privacy - Microphone Usage Description`)

Consultez la documentation [Configurer `Info.plist`](https://capacitorjs.com/docs/ios/configuration#configuring-infoplist) dans le [Guide iOS](https://capacitorjs.com/docs/ios) pour plus d'informations.

## Configuration Android

Ajoutez la permission suivante dans votre `AndroidManifest.xml` :

```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

> **Note :** La fonctionnalité Pause/Reprise nécessite Android API 24+ (Android 7.0 Nougat).

Consultez la documentation [Configurer les permissions](https://capacitorjs.com/docs/android/configuration#setting-permissions) dans le [Guide Android](https://capacitorjs.com/docs/android) pour plus d'informations.

## Utilisation

```typescript
import { Microphone } from '@dimer47/capacitor-microphone';

// Demander les permissions
const { microphone } = await Microphone.requestPermissions();

// Démarrer l'enregistrement
await Microphone.startRecording();

// Pause / Reprise
await Microphone.pauseRecording();
await Microphone.resumeRecording();

// Vérifier le statut
const { status } = await Microphone.getCurrentStatus();

// Écouter les changements de statut
await Microphone.addListener('status', ({ status }) => {
  console.log('Statut enregistrement :', status);
});

// Arrêter et récupérer le fichier audio
const recording = await Microphone.stopRecording();
console.log(recording.path, recording.duration, recording.mimeType);
```

## API

| Méthode | Description |
| ------- | ----------- |
| `checkPermissions()` | Vérifie les permissions du microphone |
| `requestPermissions()` | Demande les permissions du microphone |
| `startRecording()` | Démarre une session d'enregistrement |
| `pauseRecording()` | Met en pause la session en cours |
| `resumeRecording()` | Reprend une session en pause |
| `getCurrentStatus()` | Récupère le statut actuel sans modifier l'état |
| `addListener('status', ...)` | Écoute les changements de statut en temps réel |
| `removeStatusListener(...)` | Supprime un écouteur spécifique |
| `removeAllListeners()` | Supprime tous les écouteurs |
| `stopRecording()` | Arrête l'enregistrement et retourne le fichier audio |

Pour la documentation API complète avec les signatures TypeScript, consultez le [README principal (anglais)](README.md#api).

## Messages de statut

Les chaînes de statut suivantes sont retournées par les méthodes de l'API et émises via les événements :

| Statut                             | Description                                      |
| ---------------------------------- | ------------------------------------------------ |
| `recording stared`                 | L'enregistrement a démarré avec succès           |
| `recording in progress`            | Un enregistrement est en cours                   |
| `recording paused`                 | L'enregistrement a été mis en pause              |
| `recording resumed`                | L'enregistrement a été repris                    |
| `no recording in progress`         | Aucune session d'enregistrement active           |
| `microphone permission not granted`| La permission du microphone n'a pas été accordée |
| `cannot record on this phone`      | L'appareil ne supporte pas l'enregistrement      |
| `recording failed`                 | Une erreur est survenue pendant l'enregistrement |
| `failed to fetch recording`        | Impossible de récupérer le fichier audio         |
| `microphone is busy`               | Le microphone est déjà utilisé                   |

## Remerciements

Ce projet est un fork de [`@mozartec/capacitor-microphone`](https://github.com/mozartec/capacitor-microphone) par [Mozart](https://mozartec.com/). Merci d'avoir créé et maintenu le plugin original qui a rendu ce travail possible.

## Licence

MIT - Voir [LICENSE](LICENSE) pour les détails.
