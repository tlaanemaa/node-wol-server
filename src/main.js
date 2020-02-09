"use strict";

const path = require('path');
const express = require('express');
const wol = require('node-wol');

const port = process.env.PORT || 8080;

const app = express();
app.use(express.static(path.resolve(__dirname, '..', 'public')));
app.use(express.json());

// Helper to send the wake packet
const wake = (mac, port) => new Promise((resolve, reject) => {
    wol.wake(
        mac,
        { port },
        (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        }
    );
});

// Route handler
app.post('/', async (req, res) => {
    try {
        const { mac, port = 7 } = req.body;
        await wake(mac, port);
        res.status(200).json({
            message: 'success',
            mac,
            port
        });
    } catch (e) {
        res.status(500).json({
            error: e.stack
        });
    }
});

app.listen(port, () => console.log(`Node-WOL server listening on http://localhost:${port}`));
