// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require("multer");
const FormData = require("form-data");
const axios = require("axios");

const { ElevenLabsClient } = require("@elevenlabs/elevenlabs-js");
require("dotenv").config();

const uri = 'mongodb://localhost:27017/domainnamesset';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

const upload = multer({ storage: multer.memoryStorage() });

const elevenlabs = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY,
});
// ---------------- MongoDB Connection ----------------
mongoose.connect(uri)
    .then(() => console.log('MongoDB connected...'))
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });
// ---------------- Schemas ----------------
const bookmarkSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    domainName: { type: String, required: true },
    tagline: String,
    valueProposition: String,
    targetAudience: String,
    brandTone: String,
    metaTitle: String,
    metaDesc: String,
    domainIdeas: [String],
}, { timestamps: true });

const Bookmark = mongoose.model('Bookmark', bookmarkSchema, 'bookmarks');

const industrySchema = new mongoose.Schema({
    Industry: String
});

const Industry = mongoose.model('Industry', industrySchema, 'industry');

const extensionSchema = new mongoose.Schema({
    Extension: String
});

const Extension = mongoose.model('Extension', extensionSchema, 'extension');

const PromptHistorySchema = new mongoose.Schema({
    userId: { type: String, required: true },
    prompt: { type: String, required: true },
}, { timestamps: true });

const PromptHistory = mongoose.model(
    "PromptHistory",
    PromptHistorySchema,
    "prompthistories"
);


// --- 1. THE MODEL (Ensure this is at the top with other schemas) ---
const WorkspaceSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    domainName: { type: String, required: true },
    // This stores the Snapshot of the Bookmark data
    projectContext: {
        tagline: String,
        valueProposition: String,
        targetAudience: String,
        brandTone: String,
        metaTitle: String,
        metaDesc: String,
        domainIdeas: [String]
    },
    generations: { type: Object, default: {} },
    lastUpdated: { type: Date, default: Date.now }
});
WorkspaceSchema.index({ userId: 1, domainName: 1 }, { unique: true });
const Workspace = mongoose.model('Workspace', WorkspaceSchema, 'workspaces');

// ---------------- INDUSTRY ----------------
app.get('/api/industries', async (req, res) => {
    try {
        const industries = await Industry.find();
        res.json(industries);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching industries' });
    }
});

// ---------------- EXTENSIONS ----------------
app.get('/api/extensions', async (req, res) => {
    try {
        const extensions = await Extension.find();
        res.json(extensions);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching extensions' });
    }
});

app.get('/api/random-extensions', async (req, res) => {
    try {
        const extensions = await Extension.aggregate([
            { $sample: { size: 3 } }
        ]);
        res.json(extensions);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching random extensions' });
    }
});

// ---------------- BOOKMARKS ----------------
app.post('/api/bookmarks', async (req, res) => {
    try {
        const {
            userId,
            domainName,
            tagline,
            valueProposition,
            targetAudience,
            brandTone,
            metaTitle,
            metaDesc,
            domainIdeas
        } = req.body;

        if (!userId || !domainName) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const existing = await Bookmark.findOne({ userId, domainName });

        if (existing) {
            return res.status(400).json({ message: 'Already bookmarked' });
        }

        const newBookmark = await Bookmark.create({
            userId,
            domainName,
            tagline,
            valueProposition,
            targetAudience,
            brandTone,
            metaTitle,
            metaDesc,
            domainIdeas
        });

        res.status(201).json(newBookmark);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error adding bookmark' });
    }
});

app.get('/api/bookmarks/:userId', async (req, res) => {
    try {
        const data = await Bookmark.find({ userId: req.params.userId })
            .sort({ createdAt: -1 });

        res.json(data);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching bookmarks' });
    }
});

app.delete('/api/bookmarks/:id', async (req, res) => {
    try {
        const deleted = await Bookmark.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: 'Bookmark not found' });
        }

        res.json({ message: 'Deleted successfully' });

    } catch (err) {
        res.status(500).json({ message: 'Error deleting bookmark' });
    }
});

app.delete('/api/bookmarks/user/:userId', async (req, res) => {
    try {
        await Bookmark.deleteMany({ userId: req.params.userId });
        res.json({ message: 'All bookmarks deleted' });

    } catch (err) {
        res.status(500).json({ message: 'Error deleting bookmarks' });
    }
});

// ---------------- PROMPT HISTORY (FIXED CORE ISSUE) ----------------
app.post("/api/prompts", async (req, res) => {
    try {
        const { userId, prompt } = req.body;

        if (!userId || !prompt?.trim()) {
            return res.status(400).json({ error: "Missing userId or prompt" });
        }

        const cleanPrompt = prompt.trim();

        // ✅ ADD THIS HERE (before saving)
        const existing = await PromptHistory.findOne({
            userId,
            prompt: cleanPrompt
        });

        if (existing) {
            return res.status(200).json({
                success: true,
                prompt: existing.prompt
            });
        }

        const saved = await PromptHistory.create({
            userId,
            prompt: cleanPrompt
        });

        res.status(201).json({
            success: true,
            prompt: saved.prompt
        });

    } catch (err) {
        console.error("PROMPT SAVE ERROR:", err);
        res.status(500).json({ error: "Server error" });
    }
});

app.get("/api/prompts/:userId", async (req, res) => {
    try {
        const history = await PromptHistory.find({ userId: req.params.userId })
            .sort({ createdAt: -1, _id: -1 })
            .limit(10);

        res.json(history);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

app.delete('/api/prompts/:id', async (req, res) => {
    try {
        console.log("DELETE ID RECEIVED:", req.params.id);

        const deleted = await PromptHistory.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ error: "Prompt not found" });
        }

        res.json({ success: true, deleted });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Delete failed" });
    }
});



//-----------------------ELEVEN LABS ---------
app.post("/api/transcribe", upload.single("file"), async (req, res) => {
    try {
        if (!req.file?.buffer) {
            return res.status(400).json({ error: "Invalid audio file" });
        }

        const formData = new FormData();

        formData.append("file", req.file.buffer, {
            filename: "audio.webm",
            contentType: req.file.mimetype || "audio/webm"
        });

        formData.append("model_id", "scribe_v2");

        const response = await axios.post(
            "https://api.elevenlabs.io/v1/speech-to-text",
            formData,
            {
                headers: {
                    "xi-api-key": process.env.ELEVENLABS_API_KEY,
                    ...formData.getHeaders()
                }
            }
        );

        res.json({
            text: response.data?.text || ""
        });

    } catch (err) {
        console.error("Transcription error:", err.response?.data || err.message);
        res.status(500).json({ error: "Transcription failed" });
    }
});

// 2. The SAVE Route (POST)
app.post('/api/workspace/save', async (req, res) => {
    const { userId, domainName, generations } = req.body;

    if (!userId || !domainName) {
        return res.status(400).json({ message: "Missing userId or domainName" });
    }

    try {
        const updated = await Workspace.findOneAndUpdate(
            { userId, domainName },
            {
                generations,
                lastUpdated: new Date()
            },
            { upsert: true, new: true }
        );
        res.status(200).json(updated);
    } catch (error) {
        console.error("Workspace Save Error:", error);
        res.status(500).json({ message: "Persistence Error", error });
    }
});

// GET: Load previous progress
app.get('/api/workspace/:userId/:domainName', async (req, res) => {
    try {
        const { userId, domainName } = req.params;
        const workspace = await Workspace.findOne({
            userId,
            domainName: decodeURIComponent(domainName) // Handles spaces/special chars
        });

        // Return null if not found (200 OK) so frontend knows to use defaults
        if (!workspace) return res.status(200).json(null);
        res.json(workspace);
    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({ error: "Fetch failed" });
    }
});

// POST: Save current progress (Upsert logic)
app.post('/api/workspace/save', async (req, res) => {
    const { userId, domainName, projectContext, generations } = req.body;
    try {
        const updated = await Workspace.findOneAndUpdate(
            { userId, domainName },
            {
                projectContext, // Save the bookmark snapshot
                generations,
                lastUpdated: new Date()
            },
            { upsert: true, new: true }
        );
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: "Save Error", error });
    }
});
// ---------------- START SERVER ----------------
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});