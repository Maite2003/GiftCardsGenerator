import { ImageResponse } from 'next/og';
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';  

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    let name = formData.get('name') as string;
    let total = formData.get('total') as string;
    const msg = formData.get('msg') as string || '';

    if (!name || !total) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }

    try {
      const val = parseFloat(total.replace(',', '.'));
      if (!isNaN(val)) {
        total = new Intl.NumberFormat('es-AR', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(val);
      }
    } catch (e) {}

    const dateStr = new Date().toLocaleDateString('es-AR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    }).replace(/\//g, ' - ');

    const fontResponse = await fetch('https://github.com/googlefonts/opensans/raw/main/fonts/ttf/OpenSans-Bold.ttf');
    
    if (!fontResponse.ok) throw new Error('Error cargando la fuente');
    const fontData = await fontResponse.arrayBuffer();
    const imageData = await fs.readFile(path.join(process.cwd(), 'public/images/gift-card-base.png'));
    
    const imageBase64 = `data:image/png;base64,${imageData.toString('base64')}`;

    const width = 1600
    const height = 1135

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            position: 'relative',
            fontFamily: '"OpenSans"',
          }}
        >
          <img 
            src={imageBase64} 
            style={{ position: 'absolute', top: 0, left: 0, width: `${width}px`, height: `${height}px`, objectFit: 'cover' }} 
          />

          {/* TOTAL (Original SVG x=875 -> +75px del centro -> paddingLeft 150) */}
          <div style={{
            position: 'absolute',
            left: 0, 
            top: 585, // Ajustado para compensar la altura de la fuente (aprox -40px de tu SVG y=630)
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            paddingLeft: '150px', 
          }}>
            <span style={{ fontSize: 45, fontWeight: 700, color: 'black' }}>
              $ {total}
            </span>
          </div>

          {/* FECHA (Original SVG x=790 -> -10px del centro -> paddingRight 20) */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: 695, // SVG y=735
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            paddingRight: '20px', 
          }}>
            <span style={{ fontSize: 45, fontWeight: 700, color: 'black' }}>
              {dateStr}
            </span>
          </div>

          {/* NOMBRE (Original SVG x=880 -> +80px del centro -> paddingLeft 160) */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: 790, // SVG y=835
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            paddingLeft: '160px',
          }}>
            <span style={{ fontSize: 45, fontWeight: 700, color: 'black' }}>
              {name}
            </span>
          </div>

          {/* MENSAJE (Original SVG x=800 -> Centro exacto) */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: 875, // SVG y=940
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}>
            <span style={{ fontSize: 35, color: 'white', maxWidth: '800px', textAlign: 'center' }}>
              {msg}
            </span>
          </div>

        </div>
      ),
      {
        width: width,
        height: height,
        fonts: [
          {
            name: 'OpenSans',
            data: fontData,
            style: 'normal',
            weight: 700, // Bold
          },
        ],
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': `inline; filename="giftcard-${name.split(' ').join('-')}.png"`,
        },
      }
    );

  } catch (error: any) {
    console.error("Error ImageResponse:", error);
    return NextResponse.json({ error: 'Error generando tarjeta: ' + error.message }, { status: 500 });
  }
}