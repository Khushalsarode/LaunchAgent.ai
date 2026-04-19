
# LaunchAgent.ai 🚀
### *The Autonomous Engineering Agent for Verified SaaS Scaffolding*
[![Auth0](https://img.shields.io/badge/Security-Auth0-EB5424?style=for-the-badge&logo=auth0&logoColor=white)](https://auth0.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![GitHub Copilot](https://img.shields.io/badge/Assistant-GitHub_Copilot-000000?style=for-the-badge&logo=githubcopilot&logoColor=white)](https://github.com/features/copilot)
[![Solana](https://img.shields.io/badge/Blockchain-Solana-blueviolet?style=for-the-badge&logo=solana)](https://solana.com/)
[![Gemini](https://img.shields.io/badge/AI-Gemini_1.5_Pro-blue?style=for-the-badge&logo=google-gemini)](https://deepmind.google/technologies/gemini/)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge?style=for-the-badge)](LICENSE)

**LaunchAgent.ai** is a multimodal autonomous agent designed to take founders from a raw idea to a verified, architecturally sound SaaS blueprint in seconds. It bridges the gap between conceptual logic and technical infrastructure, securing your IP on-chain.

---

## 🏗️ Architectural Overview
The system utilizes a multi-layered approach to project engineering:

1.  **Intent Mapping Layer:** Uses **Gemini 2.5 flash** to decompose natural language into technical requirements.
2.  **Voice Feedback:** Integrated **ElevenLabs** for real-time, low-latency AI interaction.
3.  **Origin Shield:** Commits SHA-256 project fingerprints to the **Solana Devnet** via `@solana/web3.js`.
4.  **Auditor Engine:** A SaaS-level diagnostic tool that verifies on-chain data integrity and trust scores.

---

## ✨ Features
- **Deterministic Scaffolding:** Generates the high-stakes core logic and security layers of a SaaS application.
- **On-Chain Originality Proof:** Immutably seals your project metadata on the Solana ledger.
- **Multimodal Intelligence:** Interactive AI reasoning paired with high-fidelity voice synthesis.
- **Audit Dashboard:** A pro-tier interface to verify signatures and track ledger diagnostics.

---

## 🛠️ Tech Stack
- **AI/LLM:** Google Gemini 2.5 flash
- **Voice Synthesis:** ElevenLabs API
- **Blockchain:** Solana (Devnet)
- **Database:** MongoDB Atlas
- **Authentication:** Auth0
- **Frontend:** React.js, Tailwind CSS, Lucide Icons
- **State Management:** React Hooks & Context API

---

## ⚠️ Current Limitations (Work in Progress)
*As this is a hackathon submission, we are currently addressing the following technical hurdles:*

- **Audio-Operation Flow:** Achieving a perfectly smooth synchronization between ElevenLabs voice output and agentic operations is still being optimized.
- **Ledger Stability:** Due to the experimental nature of the Solana Devnet public RPCs, transactions and airdrops may occasionally hit rate limits (429 errors).
- **Dynamic Code Fetching:** While the architectural logic is generated, the system currently provides static scaffolds rather than a fully dynamic, end-to-end code fetch for the entire idea context.

---

## 🚀 Future Roadmap
- [ ] **GitHub Intelligence:** Engineer logic to fetch and analyze similar open-source implementations on GitHub for architectural comparison.
- [ ] **Live Dev-Server Sync:** Provide real-time synchronization with local development servers to track and maintain progress during the build.
- [ ] **Autonomous Deployment:** One-click "No-Human-Ops" deployment to Vercel/AWS.

---

## 🔧 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kushalsarode/LaunchAgent.ai.git
   cd LaunchAgent.ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file and add your credentials:
   ```env
   VITE_GEMINI_API_KEY=your_key
   VITE_ELEVENLABS_API_KEY=your_key
   VITE_SOLANA_RPC=https://api.devnet.solana.com
   VITE_AUTH0_DOMAIN=your_domain
   VITE_MONGODB_URI=your_uri
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Server Configuration (Node.js)**
- The backend manages secure communication with MongoDB and ElevenLabs.
```cd server
npm install
```
6. **Create a .env file in the server directory**
```touch .env
   add .env requirements:

MONGODB_URI=your_mongodb_connection_string
ELEVENLABS_API_KEY=your_elevenlabs_key
```
7. **start the server**
```
npm start
```
---

## 🤝 Contributing
Contributions are welcome! If you have suggestions for improving the agent's logic or the blockchain integration, please feel free to fork the repo and create a pull request.

