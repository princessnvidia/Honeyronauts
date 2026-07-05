# Honeyronauts 🌙🍯

Open-source platform exploring **dream journaling, sleep tracking and future lucid dreaming interfaces**.

Honeyronauts is designed as the software foundation of a future DIY lucid dreaming mask, combining dream logging, sleep analytics and experimental human-computer interaction during sleep.

---

<p align="center">
  <img src="docs/demo.gif" alt="Honeyronauts Demo" width="100%">
</p>

---

# Vision

Honeyronauts is not simply a dream journal.

The long-term vision is to build a complete open-source ecosystem dedicated to lucid dreaming research, where software and experimental hardware evolve together.

The application serves as the central interface for recording dreams, visualizing sleep data and, eventually, communicating with a custom wearable capable of delivering dream cues during probable REM sleep.

**Honeyronauts is not a medical device. It is an experimental research project intended for educational and personal exploration purposes.**

---

# Features

## 🌙 Dream Journal

- Dream titles
- Dream descriptions
- Dream tags
- Searchable history
- Local storage

## 💤 Sleep Tracking

- Sleep sessions
- Sleep duration
- Sleep statistics
- Historical visualization

## 📊 Statistics

- Dream recall frequency
- Sleep patterns
- Progress monitoring
- Dream history

## 📱 Modern Interface

- Mobile-first design
- Responsive layout
- Dark mode
- Offline support

---

# Future Hardware

Honeyronauts is designed around a future open-source lucid dreaming mask.

Planned hardware capabilities include:

- ESP32-S3 communication
- Bluetooth Low Energy
- REM-stage estimation
- Configurable light cues
- Haptic vibration cues
- Sleep timeline visualization
- Motion sensing
- Low-power operation

---

# System Architecture

```
Dream Journal
        │
        ▼
Local Database
        │
        ▼
Statistics Engine
        │
        ▼
Sleep Timeline
        │
        ▼
REM Estimation
        │
        ▼
ESP32-S3 Communication
        │
        ▼
Lucid Dream Mask
```

---

# Research Goals

Honeyronauts explores several research directions:

- Dream journaling
- Sleep visualization
- REM estimation
- Lucid dream cue timing
- Open-source wearable hardware
- Human–computer interaction during sleep

---

# Tech Stack

## Software

- React
- Vite
- JavaScript
- CSS
- Capacitor
- Android

## Planned Hardware

- ESP32-S3
- Bluetooth Low Energy
- LEDs
- Vibration Motor
- Motion Sensors

---

# Installation

Clone the repository

```bash
git clone https://github.com/princessnvidia/Honeyronauts.git
cd Honeyronauts
```

Install dependencies

```bash
npm install
```

Run the development server

```bash
npm run dev
```

Android

```bash
npx cap sync
npx cap open android
```

---

# Roadmap

## Software

- [x] Dream journal
- [x] Dream history
- [x] Statistics
- [x] Android prototype
- [ ] Sleep timeline
- [ ] Better visualization
- [ ] Data export

## Hardware

- [ ] ESP32-S3 communication
- [ ] Sleep mask prototype
- [ ] Light stimulation
- [ ] Vibration stimulation
- [ ] REM estimation
- [ ] Configurable stimulation profiles

---

# Philosophy

Honeyronauts is built around a simple idea:

Dreams are one of the least explored human experiences, yet modern software rarely treats them as something worth studying.

Instead of focusing solely on sleep tracking or productivity, Honeyronauts aims to provide an open platform for documenting dreams, experimenting with lucid dreaming techniques and exploring new forms of interaction between humans and technology during sleep.

The long-term goal is to make every part of the project—from the mobile application to the future wearable hardware—fully open-source and accessible to makers, researchers and curious dreamers.

---

# Status

🚧 Active Research Project

---

# License

MIT License
