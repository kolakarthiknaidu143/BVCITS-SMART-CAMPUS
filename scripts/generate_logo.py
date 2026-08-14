import os
import subprocess

svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900" width="600" height="900">
  <defs>
    <!-- Gradients -->
    <radialGradient id="sunburst" cx="50%" cy="45%" r="55%" fx="50%" fy="45%">
      <stop offset="0%" stop-color="#FFFBEB" />
      <stop offset="25%" stop-color="#FEF08A" />
      <stop offset="55%" stop-color="#FBBF24" />
      <stop offset="85%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#D97706" />
    </radialGradient>
    
    <radialGradient id="goldRing" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FDE68A" />
      <stop offset="40%" stop-color="#F59E0B" />
      <stop offset="70%" stop-color="#D97706" />
      <stop offset="100%" stop-color="#92400E" />
    </radialGradient>

    <radialGradient id="goldRim" cx="30%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#FEF3C7" />
      <stop offset="30%" stop-color="#FBBF24" />
      <stop offset="60%" stop-color="#D97706" />
      <stop offset="100%" stop-color="#78350F" />
    </radialGradient>

    <linearGradient id="maroonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#70090F" />
      <stop offset="30%" stop-color="#991B1B" />
      <stop offset="50%" stop-color="#7F1D1D" />
      <stop offset="75%" stop-color="#991B1B" />
      <stop offset="100%" stop-color="#58080C" />
    </linearGradient>

    <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#991B1B" />
      <stop offset="45%" stop-color="#B91C1C" />
      <stop offset="70%" stop-color="#7F1D1D" />
      <stop offset="100%" stop-color="#58080C" />
    </linearGradient>

    <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FEF08A" stop-opacity="0.9" />
      <stop offset="50%" stop-color="#F59E0B" stop-opacity="0.5" />
      <stop offset="100%" stop-color="#F59E0B" stop-opacity="0" />
    </radialGradient>

    <!-- Text Paths for circular text -->
    <!-- Center of seal: (300, 330), Radius ~208 -->
    <!-- Top arc: starts ~195 deg, sweeps clockwise to -15 deg -->
    <path id="topTextArc" d="M 94,330 A 206,206 0 1,1 506,330" fill="none" />
    <!-- Bottom arc: starts ~165 deg, sweeps counter-clockwise or clockwise -->
    <path id="bottomTextArc" d="M 125,385 A 206,206 0 0,0 475,385" fill="none" />
    
    <!-- Filter for subtle drop shadows -->
    <filter id="dropShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.25" />
    </filter>
  </defs>

  <!-- ================= MAIN CIRCULAR SEAL ================= -->
  <!-- Outer Gold Border -->
  <circle cx="300" cy="330" r="260" fill="url(#goldRim)" filter="url(#dropShadow)" />
  <circle cx="300" cy="330" r="252" fill="#78350F" />
  
  <!-- Maroon Annular Ring -->
  <circle cx="300" cy="330" r="248" fill="url(#maroonGrad)" />
  
  <!-- Inner Gold Rim -->
  <circle cx="300" cy="330" r="172" fill="url(#goldRim)" />
  <circle cx="300" cy="330" r="166" fill="#78350F" />
  
  <!-- Inner Center Shield with Sunburst -->
  <circle cx="300" cy="330" r="164" fill="url(#sunburst)" />

  <!-- Sun Rays in Background -->
  <g opacity="0.35" stroke="#F59E0B" stroke-width="2">
    <line x1="300" y1="330" x2="300" y2="170" />
    <line x1="300" y1="330" x2="355" y2="178" />
    <line x1="300" y1="330" x2="406" y2="204" />
    <line x1="300" y1="330" x2="445" y2="246" />
    <line x1="300" y1="330" x2="460" y2="295" />
    <line x1="300" y1="330" x2="464" y2="330" />
    <line x1="300" y1="330" x2="460" y2="365" />
    <line x1="300" y1="330" x2="445" y2="414" />
    <line x1="300" y1="330" x2="406" y2="456" />
    <line x1="300" y1="330" x2="355" y2="482" />
    <line x1="300" y1="330" x2="300" y2="490" />
    <line x1="300" y1="330" x2="245" y2="482" />
    <line x1="300" y1="330" x2="194" y2="456" />
    <line x1="300" y1="330" x2="155" y2="414" />
    <line x1="300" y1="330" x2="140" y2="365" />
    <line x1="300" y1="330" x2="136" y2="330" />
    <line x1="300" y1="330" x2="140" y2="295" />
    <line x1="300" y1="330" x2="155" y2="246" />
    <line x1="300" y1="330" x2="194" y2="204" />
    <line x1="300" y1="330" x2="245" y2="178" />
  </g>

  <!-- ================= CIRCULAR TEXT ================= -->
  <!-- Top Text: ★ B.V.C. INSTITUTE OF TECHNOLOGY & SCIENCE ★ -->
  <text font-family="'Arial Black', 'Trebuchet MS', 'Impact', sans-serif" font-weight="900" font-size="21.5" fill="#FFFFFF" letter-spacing="1.8px">
    <textPath href="#topTextArc" startOffset="50%" text-anchor="middle">
      ★ B.V.C. INSTITUTE OF TECHNOLOGY &amp; SCIENCE ★
    </textPath>
  </text>

  <!-- Bottom Text: AMALAPURAM -->
  <text font-family="'Arial Black', 'Trebuchet MS', 'Impact', sans-serif" font-weight="900" font-size="28" fill="#FFFFFF" letter-spacing="4px">
    <textPath href="#bottomTextArc" startOffset="50%" text-anchor="middle">
      AMALAPURAM
    </textPath>
  </text>

  <!-- ================= INNER EMBLEM GRAPHICS ================= -->

  <!-- Top-Right: Horizontal Sine/Data Waves behind computer -->
  <g stroke="#B45309" stroke-width="3" fill="none" opacity="0.85">
    <path d="M 335,178 Q 360,170 385,178 T 435,178 T 460,178" />
    <path d="M 335,198 Q 360,190 385,198 T 435,198 T 460,198" />
    <path d="M 335,218 Q 360,210 385,218 T 435,218 T 460,218" />
    <path d="M 350,238 Q 375,230 400,238 T 450,238" />
    <path d="M 360,258 Q 385,250 410,258 T 455,258" />
    <path d="M 370,278 Q 395,270 420,278 T 450,278" />
    <path d="M 380,298 Q 405,290 430,298 T 450,298" />
  </g>

  <!-- Top-Right: Computer Monitor & Keyboard -->
  <g transform="translate(360, 192)" stroke="#1E293B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <!-- Monitor Outer Body -->
    <rect x="18" y="8" width="62" height="46" rx="4" fill="#FFFFFF" />
    <!-- Monitor Screen -->
    <rect x="23" y="13" width="52" height="36" rx="2" fill="#0F172A" />
    <rect x="25" y="15" width="48" height="32" rx="1" fill="#1E293B" />
    <!-- Stand Neck -->
    <path d="M 44,54 L 54,54 L 52,62 L 46,62 Z" fill="#0F172A" />
    <!-- Stand Base -->
    <ellipse cx="49" cy="62" rx="16" ry="3" fill="#0F172A" />
    
    <!-- Keyboard (Perspective) -->
    <polygon points="0,80 98,80 84,65 14,65" fill="#FFFFFF" />
    <polygon points="0,80 98,80 84,65 14,65" fill="none" stroke="#1E293B" stroke-width="3" />
    <!-- Keyboard Key Grid Rows -->
    <line x1="16" y1="69" x2="82" y2="69" stroke="#1E293B" stroke-width="1.5" />
    <line x1="11" y1="73" x2="87" y2="73" stroke="#1E293B" stroke-width="1.5" />
    <line x1="5" y1="77" x2="93" y2="77" stroke="#1E293B" stroke-width="1.5" />
    <!-- Key Vertical Separators -->
    <line x1="28" y1="66" x2="25" y2="79" stroke="#1E293B" stroke-width="1.2" />
    <line x1="42" y1="66" x2="40" y2="79" stroke="#1E293B" stroke-width="1.2" />
    <line x1="56" y1="66" x2="56" y2="79" stroke="#1E293B" stroke-width="1.2" />
    <line x1="70" y1="66" x2="72" y2="79" stroke="#1E293B" stroke-width="1.2" />
  </g>

  <!-- Left: Antenna Tower & Parabolic Satellite Dish -->
  <g stroke="#1E293B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <!-- Left Mast Outer Framework -->
    <path d="M 148,340 C 160,285 185,225 210,188 L 228,212 C 205,250 188,300 180,345 Z" fill="#FFFFFF" />
    <!-- Tower Lattice Cross-Braces -->
    <line x1="152" y1="325" x2="184" y2="328" stroke="#1E293B" stroke-width="2.5" />
    <line x1="158" y1="298" x2="192" y2="302" stroke="#1E293B" stroke-width="2.5" />
    <line x1="168" y1="268" x2="204" y2="272" stroke="#1E293B" stroke-width="2.5" />
    <line x1="184" y1="238" x2="216" y2="242" stroke="#1E293B" stroke-width="2.5" />
    <line x1="202" y1="208" x2="224" y2="214" stroke="#1E293B" stroke-width="2.5" />
    <!-- Diagonal Braces -->
    <line x1="152" y1="325" x2="192" y2="302" stroke="#1E293B" stroke-width="2" />
    <line x1="158" y1="298" x2="204" y2="272" stroke="#1E293B" stroke-width="2" />
    <line x1="168" y1="268" x2="216" y2="242" stroke="#1E293B" stroke-width="2" />
    <line x1="184" y1="238" x2="224" y2="214" stroke="#1E293B" stroke-width="2" />
    
    <!-- Parabolic Satellite Dish Bowl -->
    <!-- Base / bracket -->
    <path d="M 215,225 L 235,210" stroke="#1E293B" stroke-width="4" />
    <!-- Dish Ellipse Profile (Tilted 40 deg) -->
    <g transform="translate(245, 195) rotate(-35)">
      <!-- Outer Dish Rim -->
      <ellipse cx="0" cy="0" rx="36" ry="24" fill="#FFFFFF" stroke="#1E293B" stroke-width="3.5" />
      <!-- Inner Dish Concavity -->
      <ellipse cx="-4" cy="0" rx="30" ry="18" fill="#0F172A" />
      <!-- Center Feed Support Struts -->
      <line x1="-4" y1="0" x2="-38" y2="-2" stroke="#FFFFFF" stroke-width="3" />
      <!-- Subreflector / Feed Horn -->
      <ellipse cx="-38" cy="-2" rx="4" ry="6" fill="#FFFFFF" stroke="#1E293B" stroke-width="1.5" />
    </g>
    
    <!-- Stepped Signal Pattern on Far Left -->
    <path d="M 148,340 L 138,340 L 138,300 L 148,300 L 148,270 L 160,270 L 160,240 L 178,240 L 178,215 L 200,215" fill="none" stroke="#B45309" stroke-width="2.5" />
  </g>

  <!-- Center-Bottom: Rays from Book to Head -->
  <g stroke="#1E293B" stroke-width="2">
    <line x1="228" y1="345" x2="260" y2="425" />
    <line x1="245" y1="352" x2="268" y2="425" />
    <line x1="262" y1="356" x2="276" y2="425" />
    <line x1="280" y1="358" x2="284" y2="425" />
    <line x1="300" y1="360" x2="300" y2="425" />
    <line x1="320" y1="358" x2="316" y2="425" />
    <line x1="338" y1="356" x2="324" y2="425" />
    <line x1="355" y1="352" x2="332" y2="425" />
    <line x1="372" y1="345" x2="340" y2="425" />
  </g>

  <!-- Center: Open Book -->
  <g transform="translate(300, 328)" stroke="#1E293B" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
    <!-- Book Pages Background -->
    <!-- Left Page -->
    <path d="M 0, -2 C -24, -14 -60, -10 -78, 2 L -74, 38 C -56, 26 -22, 22 0, 32 Z" fill="#FFFFFF" />
    <!-- Right Page -->
    <path d="M 0, -2 C 24, -14 60, -10 78, 2 L 74, 38 C 56, 26 22, 22 0, 32 Z" fill="#FFFFFF" />
    <!-- Center Spine & Binding -->
    <line x1="0" y1="-2" x2="0" y2="34" stroke="#1E293B" stroke-width="4" />
    
    <!-- Text Lines on Left Page -->
    <g stroke="#1E293B" stroke-width="2" stroke-linecap="round">
      <line x1="-66" y1="8" x2="-14" y2="4" />
      <line x1="-64" y1="15" x2="-14" y2="11" />
      <line x1="-62" y1="22" x2="-14" y2="18" />
      <line x1="-60" y1="29" x2="-14" y2="25" />
    </g>

    <!-- Text Lines on Right Page -->
    <g stroke="#1E293B" stroke-width="2" stroke-linecap="round">
      <line x1="14" y1="4" x2="66" y2="8" />
      <line x1="14" y1="11" x2="64" y2="15" />
      <line x1="14" y1="18" x2="62" y2="22" />
      <line x1="14" y1="25" x2="60" y2="29" />
    </g>
  </g>

  <!-- Bottom-Center: Human Head Silhouette with Brain -->
  <g transform="translate(300, 442)" stroke="#1E293B" stroke-linecap="round" stroke-linejoin="round">
    <!-- Head Outline (Facing Right) -->
    <path d="M -42,12 C -42,-18 -24,-34 6,-34 C 34,-34 46,-12 46,6 C 46,14 42,18 42,22 C 48,25 54,26 54,30 C 54,34 46,36 44,38 C 48,42 50,46 44,52 C 40,56 36,56 32,56 C 28,62 16,68 16,74 L -12,74 C -12,58 -28,46 -42,12 Z" fill="#FFFFFF" stroke-width="3.5" />
    
    <!-- Exposed Brain Structure in Head Profile -->
    <g stroke="#1E293B" stroke-width="2.5" fill="#FEF08A">
      <!-- Brain Hemisphere Base Bubble -->
      <path d="M -30,6 C -32,-16 -16,-26 8,-26 C 28,-26 36,-12 36,4 C 36,18 24,20 12,20 C -4,20 -18,22 -30,6 Z" />
      <!-- Cortical Folds / Gyri Lines -->
      <path d="M -22,-2 Q -12,-16 2,-8 Q 18,-18 28,-2" fill="none" />
      <path d="M -26,4 Q -16,-6 -2,2 Q 14,-8 26,6" fill="none" />
      <path d="M -18,10 Q -6,0 10,8 Q 20,4 24,14" fill="none" />
      <path d="M -8,-20 Q 4,-12 16,-20" fill="none" />
      <path d="M -14,-12 Q -2,-4 8,-14" fill="none" />
      <path d="M 0,6 Q 8,14 16,6" fill="none" />
    </g>
  </g>


  <!-- ================= DIYA LAMP (BELOW CIRCLE) ================= -->
  <!-- Lamp Halo Glow -->
  <circle cx="300" cy="610" r="48" fill="url(#lampGlow)" />
  <!-- Radiating Dot Halo -->
  <g stroke="#F59E0B" stroke-width="2" stroke-dasharray="2,5" fill="none">
    <circle cx="300" cy="610" r="32" />
    <circle cx="300" cy="610" r="40" />
  </g>

  <!-- Diya Base (Clay/Brass Vessel) -->
  <g transform="translate(300, 622)">
    <!-- Vessel Body -->
    <path d="M -40,-2 C -32,18 32,18 40,-2 C 34,-6 -34,-6 -40,-2 Z" fill="#78350F" stroke="#FBBF24" stroke-width="2.5" />
    <!-- Vessel Rim -->
    <ellipse cx="0" cy="-2" rx="38" ry="6" fill="#92400E" stroke="#FBBF24" stroke-width="2" />
    <!-- Vessel Stand Foot -->
    <path d="M -14,14 L -20,20 L 20,20 L 14,14 Z" fill="#78350F" stroke="#FBBF24" stroke-width="1.5" />
    
    <!-- Flame -->
    <!-- Outer Red Flame -->
    <path d="M 0,-6 C -14,-22 -14,-38 0,-54 C 14,-38 14,-22 0,-6 Z" fill="#DC2626" />
    <!-- Middle Orange Flame -->
    <path d="M 0,-8 C -9,-20 -9,-32 0,-46 C 9,-32 9,-20 0,-8 Z" fill="#F97316" />
    <!-- Inner Yellow Core -->
    <path d="M 0,-10 C -5,-18 -5,-26 0,-36 C 5,-26 5,-18 0,-10 Z" fill="#FEF08A" />
    <!-- Flame Wick -->
    <line x1="0" y1="-4" x2="0" y2="-12" stroke="#451A03" stroke-width="2" />
  </g>


  <!-- ================= BANNER RIBBON WITH SANSKRIT MOTTO ================= -->
  <g transform="translate(300, 672)" filter="url(#dropShadow)">
    <!-- Ribbon Tails (Left & Right folded swallowtails) -->
    <!-- Left Tail Under -->
    <polygon points="-260,35 -290,45 -265,70 -295,95 -240,85 -220,50" fill="#450A0A" />
    <polygon points="-260,35 -290,45 -265,70 -295,95 -240,85 -220,50" fill="none" stroke="#F59E0B" stroke-width="2.5" />
    
    <!-- Right Tail Under -->
    <polygon points="260,35 290,45 265,70 295,95 240,85 220,50" fill="#450A0A" />
    <polygon points="260,35 290,45 265,70 295,95 240,85 220,50" fill="none" stroke="#F59E0B" stroke-width="2.5" />

    <!-- Ribbon Middle Wings Fold Shadows -->
    <polygon points="-240,55 -215,20 -210,65" fill="#3B0709" />
    <polygon points="240,55 215,20 210,65" fill="#3B0709" />

    <!-- Main Flowing Ribbon Banner Front -->
    <path d="M -235,45 C -150,5 -60,25 0,25 C 60,25 150,5 235,45 C 255,55 255,80 235,90 C 150,55 60,75 0,75 C -60,75 -150,55 -235,90 C -255,80 -255,55 -235,45 Z" fill="url(#ribbonGrad)" stroke="#FBBF24" stroke-width="4" />
    
    <!-- Inner Gold Accent Border Line on Ribbon -->
    <path d="M -225,48 C -145,12 -55,30 0,30 C 55,30 145,12 225,48" fill="none" stroke="#FDE68A" stroke-width="1.5" />
    <path d="M -225,84 C -145,52 -55,70 0,70 C 55,70 145,52 225,84" fill="none" stroke="#FDE68A" stroke-width="1.5" />

    <!-- Sanskrit Text: विश्व विज्ञानं लभ्यते -->
    <!-- Using Devanagari text styled with high contrast white & bold letter spacing -->
    <text x="0" y="58" font-family="'Siddhanta', 'Yantramanav', 'Mukta', 'Noto Sans Devanagari', 'Mangal', 'Lohit Devanagari', 'Arial', sans-serif" font-weight="900" font-size="34" fill="#FFFFFF" text-anchor="middle" letter-spacing="3.5px" filter="drop-shadow(0px 2px 2px rgba(0,0,0,0.8))">
      विश्व विज्ञानं लभ्यते
    </text>
  </g>
</svg>
'''

# Save SVG to src/assets and public
os.makedirs('src/assets', exist_ok=True)
os.makedirs('public', exist_ok=True)

with open('src/assets/bvcits-logo.svg', 'w', encoding='utf-8') as f:
    f.write(svg_content)

with open('public/bvcits-logo.svg', 'w', encoding='utf-8') as f:
    f.write(svg_content)

print("Saved bvcits-logo.svg to src/assets and public")

# Convert SVG to high-res PNG using ImageMagick
try:
    subprocess.run(['convert', '-background', 'none', '-density', '300', 'src/assets/bvcits-logo.svg', 'src/assets/bvcits-logo.png'], check=True)
    subprocess.run(['convert', '-background', 'none', '-density', '300', 'public/bvcits-logo.svg', 'public/bvcits-logo.png'], check=True)
    print("Successfully converted SVG to PNG in src/assets/bvcits-logo.png and public/bvcits-logo.png")
except Exception as e:
    print(f"Error converting via convert: {e}")
