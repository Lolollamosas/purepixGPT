import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Obtener el tipo de notificación
    const url = new URL(req.url);
    const topic = url.searchParams.get('topic');
    const id = url.searchParams.get('id');

    console.log('Webhook recibido:', { topic, id });

    if (!topic || !id) {
      console.warn('Webhook sin topic o id');
      return new Response('OK', { status: 200 });
    }

    // Solo procesamos notificaciones de pagos
    if (topic === 'payment') {
      // Consultar el pago en Mercado Pago
      const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!paymentResponse.ok) {
        console.error('Error consultando pago:', await paymentResponse.text());
        return new Response('Error', { status: 500 });
      }

      const payment = await paymentResponse.json();
      console.log('Pago procesado:', {
        id: payment.id,
        status: payment.status,
        external_reference: payment.external_reference,
      });

      // Aquí puedes agregar lógica adicional como:
      // - Actualizar base de datos
      // - Enviar email de confirmación
      // - Activar servicios según el pago
    }

    return new Response('OK', { 
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('Error en webhook:', error);
    return new Response('Error', { 
      status: 500,
      headers: corsHeaders,
    });
  }
});
