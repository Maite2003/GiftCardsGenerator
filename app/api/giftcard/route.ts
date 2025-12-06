import { NextResponse } from 'next/server';
import { generateImage } from '@/services/image';
import path from 'path';
import { promises as fs } from 'fs';

const FONT_URL = 'https://github.com/googlefonts/opensans/blob/main/fonts/ttf/OpenSans-Bold.ttf';

export async function POST(
  request: Request
) {
  try {
    const formData = await request.formData();
    
    let name = formData.get('name') as string;
    let total = formData.get('total') as string;
    const msg = formData.get('msg') as string | null;

    // Validación simple
    if (!name || !total) {
      return NextResponse.json(
        { error: 'Faltan datos obligatorios: nombre y total' }, 
        { status: 400 }
      );
    }

    try {
      const numberValue = parseFloat(total.replace(',', '.'));

      if (!isNaN(numberValue)) {
        total = new Intl.NumberFormat('es-AR', {
          minimumFractionDigits: 0, // If round number, no decimals
          maximumFractionDigits: 2, // Max 2 decimals
        }).format(numberValue);
      }
    } catch (e) {
      console.log("Error formateando numero", e);
    }

    const imagePath = path.join(process.cwd(), 'public', 'images', 'gift-card-base.png');
    
    const [imageBuffer, fontRes] = await Promise.all([
      fs.readFile(imagePath),
      fetch(FONT_URL)
    ]);

    if (!fontRes.ok) throw new Error("No se pudo descargar la fuente");
    
    // Convertimos la respuesta de la fuente a Buffer
    const fontArrayBuffer = await fontRes.arrayBuffer();
    const fontBuffer = Buffer.from(fontArrayBuffer);

    // 3. Generar la imagen
    const finalImage = await generateImage(imageBuffer, fontBuffer, {
      name,
      total,
      msg: msg || '' 
    });

    name = name.split(' ').join('-')

    return new NextResponse(finalImage as any, {
      headers: { 
        'Content-Type': 'image/png',
        'Content-Disposition': `inline; filename="giftcard-${name}.png"`
      },
    });
  } catch (error) {
    console.error("Error en API GiftCard:", error);
    return NextResponse.json({ error: 'Error generando la tarjeta' }, { status: 500 });
  }
}
