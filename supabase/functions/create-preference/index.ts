import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MercadoPagoItem {
  title: string;
  quantity: number;
  unit_price: number;
}

interface CreatePreferenceRequest {
  items: MercadoPagoItem[];
  user_id?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const accessToken = Deno.env.get('MP_ACCESS_TOKEN');
    if (!accessToken) {
      console.error('MP_ACCESS_TOKEN no configurado');
      throw new Error('Mercado Pago no está configurado correctamente');
    }

    const { items, user_id }: CreatePreferenceRequest = await req.json();
    
    console.log('Creando preferencia de pago para:', { items, user_id });

    // Crear la preferencia en Mercado Pago
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items,
        back_urls: {
          success: `${req.headers.get('origin')}/payment/success`,
          failure: `${req.headers.get('origin')}/payment/failure`,
          pending: `${req.headers.get('origin')}/payment/pending`,
        },
        auto_return: 'approved',
        external_reference: user_id,
        notification_url: `https://cdvcgpcyjdvaoilzibdk.supabase.co/functions/v1/mp-webhook`,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Error de Mercado Pago:', error);
      throw new Error(`Error creando preferencia: ${error}`);
    }

    const data = await response.json();
    console.log('Preferencia creada exitosamente:', data.id);

    return new Response(
      JSON.stringify({
        id: data.id,
        init_point: data.init_point,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error en create-preference:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
