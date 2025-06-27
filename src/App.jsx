import "./App.css"
import { useEffect, useState } from "react";
import axios from "axios";

export default function App() {

    const baseURL  = import.meta.env.VITE_BASE_URL;
    const playerId = import.meta.env.VITE_PLAYER_ID;


    const [settings, setSettings] = useState(null);
    const [saving,   setSaving]   = useState(false);


    useEffect(() => {
        axios
            .get(`${baseURL}/api/player/settings/${playerId}`)
            .then(({ data }) => setSettings(data.data))
            .catch(console.error);
    }, []);

    const flip = (key) => {
        if (!settings) return;
        const next = { ...settings, [key]: !settings[key] };

        setSettings(next);
        setSaving(true);

        axios
            .patch(
                `${baseURL}/api/player/settings/update`,
                { [key]: next[key] },
                { params: { playerId } }
            )
            .catch((err) => {
                console.error(err);
                setSettings(settings);
            })
            .finally(() => setSaving(false));
    };

    const wrap  = { fontFamily: "sans-serif", maxWidth: 460, margin: "2rem auto" };
    const row   = { display: "flex", justifyContent: "space-between", margin: 6 };
    const btn   = (on) => ({
        minWidth: 64,
        padding: "4px 12px",
        cursor: "pointer",
        border: "none",
        borderRadius: 4,
        color: "#fff",
        background: on ? "#28a745" : "#6c757d",
    });

    if (!settings) return <p style={wrap}>Loading …</p>;

    return (
        <div style={wrap}>
            <h3 style={{ textAlign: "center" }}>Player Settings (test)</h3>

            {["sound", "notification", "vibration", "showOnline",
                "friendOnline", "allowBuddyRequest"].map((k) => (
                <div key={k} style={row}>
                    <span>{k}</span>
                    <button style={btn(settings[k])} onClick={() => flip(k)}>
                        {settings[k] ? "ON" : "OFF"}
                    </button>
                </div>
            ))}

            {saving && <p style={{ textAlign: "center" }}>saving …</p>}
        </div>
    );
}
