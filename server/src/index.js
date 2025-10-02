import express from "express";
import cors from "cors";
import mercadopago from "mercadopago";
import { createClient } from "@supabase/supabase-js";

const {
  PORT = 8787,
  MP_ACCESS_TOKEN,
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  ORIGIN = "http://localhost:5173",
  BACKEND_URL
} = process.env;

mercadopago.configure({ access_token: MP_ACCESS_TOKEN || "" });
const supabase = (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

const app = express();
app.use(cors({ origin: ORIGIN, credentials: true }));
app.use(express.json());

app.get("/health", (_, res) => res.json({ ok: true }));

app.post("/payments/create-preference", async (req, res) => {
  try {
    const { user_id, items } = req.body || {};
    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ error: "items requeridos" });
    }
    const pref = await mercadopago.preferences.create({
      items: items.map(i => ({
        title: i.title || "PurePix",
        quantity: Number(i.quantity || 1),
        currency_id: "ARS",
        unit_price: Number(i.unit_price || 1)
      })),
      back_urls: {
        success: `${ORIGIN}/activity`,
        failure: `${ORIGIN}/activity`,
        pending: `${ORIGIN}/activity`
      },
      auto_return: "approved",
      notification_url: `${BACKEND_URL || `http://localhost:${PORT}`}/payments/webhook`
    });

    if (supabase && user_id) {
      await supabase.from("payments").insert({
        user_id,
        mp_preference_id: pref.body.id,
        status: "created"
      });
    }
    res.json({ id: pref.body.id, init_point: pref.body.init_point });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "MP error" });
  }
});

app.post("/payments/webhook", async (req, res) => {
  try {
    const { type, data } = req.body || {};
    if (type === "payment" && data?.id && supabase) {
      await supabase.from("payments_events").insert({
        mp_id: String(data.id),
        payload: req.body
      });
    }
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.sendStatus(200);
  }
});

app.listen(PORT, () => {
  console.log(`[PurePix backend] listo en http://localhost:${PORT}`);
});
