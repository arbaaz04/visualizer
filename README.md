# IBA Karachi - Department of Computer Science
## CSE-302: Computer Architecture and Assembly Language
### Instructor: Dr. Salman Zaffar
### Project: Interactive Cache Hierarchy & Memory Mapping Visualizer

Submitted as a homework assignment for the CSE-302 curriculum at the Institute of Business Administration (IBA), Karachi.

---

## Project Overview

In modern computer architectures, caching is a critical technique used to bridge the speed gap between high-speed CPU registers and relatively slow main memory (DRAM). This project provides a visual simulation of:
1. **Cache Structures**: Direct-mapped caches and set-associative designs.
2. **Hit/Miss Simulation**: Real-time evaluation of data requests, calculating index and tag mapping.
3. **Replacement Policies**: Visual feedback representing block updates (using simulated Least Recently Used (LRU) / First-In-First-Out (FIFO) mechanics).
4. **Register Pipeline Cycles**: Interactive clock generation and control loops.

### Technical Architecture
The visualizer is implemented as a lightweight, zero-overhead static frontend using standard web technology (HTML5, CSS3, and modern ECMAScript) for direct hardware-in-the-loop rendering without server-side latency.

---

## Simulation Layout Components

1. **System Control Unit (Main Page / Initializer)**:
   - Initial CPU simulator setup unit. Click **Initialize System Pipeline** to boot the simulated CPU structures.
2. **Cache Blocks Gallery (Right Panel)**:
   - Visual mockups of Cache Line slots demonstrating spatial/temporal locality states. Shows address-tag alignments (styled as Direct-Mapped / Set-Associative sets).
3. **Data Bus Block Injector (Sticker tray)**:
   - Emulates memory controller operations. Drags or stamps data blocks (represented by hex/address tags) into active cache lines to trigger visual cache state changes. Double-click elements to purge cache lines.
4. **Pipeline Clock Speed Controller (Lofi music widget)**:
   - Controls the simulation clock signal loop, displaying active clock cycle states visually.
5. **System Operation Log (Diary widget)**:
   - Paginated operational logs detailing execution results, hit rates, and address decoding guidelines.
6. **Detailed Architecture Manual (Envelope popup)**:
   - Pops up technical details, microarchitectural guidelines, and student notes on cache performance metrics.

---

## Installation & Local Execution

To run the simulator locally, clone the repository and launch a local host:

### Option A: Using Python (Native Terminal)
From the project root, run:
```bash
python3 -m http.server 8000
```
Open your browser and navigate to `http://localhost:8000`.

### Option B: Using Node.js (Live Reload Dev Server)
If you have Node installed, execute:
```bash
npx live-server
```

---

## Simulation Test Suite

Automated integration tests are provided to verify the simulator logic, including component initial states, cache toggles, audio indicators, and layout triggers.

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Execute tests**:
   ```bash
   npm test
   ```
   *Note: Tests run via Vitest inside a JSDOM virtual headless browser environment.*


# visualiser
