#!/bin/bash
# Genera 150 logos adicionales (51-200) con prompts variados que representan:
# web, SEO, marketing, IA, crecimiento, analytics, tecnología, etc.

mkdir -p /tmp/logos200

# 150 prompts variados - cada uno representa algo de la agencia
PROMPTS=(
  # 51-60: Más variantes de crecimiento
  "Professional logo, abstract upward arrow with spark, growth direction, purple cyan gradient, dark background, no text icon"
  "Professional logo, stylized plant growing with tech elements, organic growth, purple blue gradient, dark background, no text icon"
  "Professional logo, abstract stairs going up, step by step growth, purple cyan gradient, dark background, no text icon"
  "Professional logo, ladder ascending with spark, achievement, purple blue gradient, dark background, no text icon"
  "Professional logo, balloon rising with data, upward, purple cyan gradient, dark background, no text icon"
  "Professional logo, abstract wings spread, freedom growth, purple blue gradient, dark background, no text icon"
  "Professional logo, stylized tree with roots and branches, growth, purple cyan gradient, dark background, no text icon"
  "Professional logo, mountain with flag on top, achievement, purple blue gradient, dark background, no text icon"
  "Professional logo, abstract upward spiral, dynamic growth, purple cyan gradient, dark background, no text icon"
  "Professional logo, pyramid with eye on top, vision, purple blue gradient, dark background, no text icon"

  # 61-70: Tech y circuitos
  "Professional logo, microchip with glowing circuits, technology, purple cyan gradient, dark background, no text icon"
  "Professional logo, CPU processor with spark, computing, purple blue gradient, dark background, no text icon"
  "Professional logo, abstract server racks, cloud hosting, purple cyan gradient, dark background, no text icon"
  "Professional logo, cloud with data, cloud computing, purple blue gradient, dark background, no text icon"
  "Professional logo, wifi signal with spark, connectivity, purple cyan gradient, dark background, no text icon"
  "Professional logo, abstract USB connector, tech, purple blue gradient, dark background, no text icon"
  "Professional logo, database cylinder with glow, data storage, purple cyan gradient, dark background, no text icon"
  "Professional logo, abstract blockchain cubes, decentralized, purple blue gradient, dark background, no text icon"
  "Professional logo, quantum computer abstract, advanced tech, purple cyan gradient, dark background, no text icon"
  "Professional logo, abstract algorithm flowchart, process, purple blue gradient, dark background, no text icon"

  # 71-80: IA y neural
  "Professional logo, neural network with glowing synapses, AI, purple cyan gradient, dark background, no text icon"
  "Professional logo, abstract robot head minimal, AI, purple blue gradient, dark background, no text icon"
  "Professional logo, chat bubble with AI spark, conversation, purple cyan gradient, dark background, no text icon"
  "Professional logo, abstract machine learning, pattern recognition, purple blue gradient, dark background, no text icon"
  "Professional logo, stylized brain with circuits, AI, purple cyan gradient, dark background, no text icon"
  "Professional logo, abstract AI chip, intelligence, purple blue gradient, dark background, no text icon"
  "Professional logo, robot arm modern, automation, purple cyan gradient, dark background, no text icon"
  "Professional logo, abstract data processing, AI, purple blue gradient, dark background, no text icon"
  "Professional logo, chat interface with spark, AI assistant, purple cyan gradient, dark background, no text icon"
  "Professional logo, abstract voice waves with AI, speech, purple blue gradient, dark background, no text icon"

  # 81-90: Web y código
  "Professional logo, code window with cursor, programming, purple cyan gradient, dark background, no text icon"
  "Professional logo, abstract HTML brackets, web dev, purple blue gradient, dark background, no text icon"
  "Professional logo, browser tab with star, web, purple cyan gradient, dark background, no text icon"
  "Professional logo, abstract responsive design, multi device, purple blue gradient, dark background, no text icon"
  "Professional logo, mobile phone with app, mobile, purple cyan gradient, dark background, no text icon"
  "Professional logo, abstract web layout, design, purple blue gradient, dark background, no text icon"
  "Professional logo, cursor with click, interaction, purple cyan gradient, dark background, no text icon"
  "Professional logo, abstract wireframe, web design, purple blue gradient, dark background, no text icon"
  "Professional logo, code terminal with prompt, dev, purple cyan gradient, dark background, no text icon"
  "Professional logo, abstract API connection, integration, purple blue gradient, dark background, no text icon"

  # 91-100: Analytics y data
  "Professional logo, line chart going up, analytics, purple cyan gradient, dark background, no text icon"
  "Professional logo, pie chart with spark, data, purple blue gradient, dark background, no text icon"
  "Professional logo, bar chart ascending, growth, purple cyan gradient, dark background, no text icon"
  "Professional logo, abstract graph network, connections, purple blue gradient, dark background, no text icon"
  "Professional logo, dashboard with metrics, analytics, purple cyan gradient, dark background, no text icon"
  "Professional logo, abstract data visualization, insights, purple blue gradient, dark background, no text icon"
  "Professional logo, radar chart with glow, monitoring, purple cyan gradient, dark background, no text icon"
  "Professional logo, abstract funnel, conversion, purple blue gradient, dark background, no text icon"
  "Professional logo, scatter plot abstract, data, purple cyan gradient, dark background, no text icon"
  "Professional logo, gauge meter with needle, performance, purple blue gradient, dark background, no text icon"

  # 101-110: Marketing
  "Professional logo, megaphone with sound waves, marketing, purple cyan gradient, dark background, no text icon"
  "Professional logo, target with arrow hit, marketing, purple blue gradient, dark background, no text icon"
  "Professional logo, abstract funnel with people, conversion, purple cyan gradient, dark background, no text icon"
  "Professional logo, social media icons abstract, marketing, purple blue gradient, dark background, no text icon"
  "Professional logo, email envelope with spark, email marketing, purple cyan gradient, dark background, no text icon"
  "Professional logo, abstract hashtag, social, purple blue gradient, dark background, no text icon"
  "Professional logo, bell notification with glow, alerts, purple cyan gradient, dark background, no text icon"
  "Professional logo, abstract promotion tag, sales, purple blue gradient, dark background, no text icon"
  "Professional logo, shopping cart with spark, ecommerce, purple cyan gradient, dark background, no text icon"
  "Professional logo, abstract ads click, advertising, purple blue gradient, dark background, no text icon"

  # 111-120: SEO
  "Professional logo, magnifying glass with chart, SEO, purple cyan gradient, dark background, no text icon"
  "Professional logo, search bar with spark, search, purple blue gradient, dark background, no text icon"
  "Professional logo, abstract ranking position, SEO, purple cyan gradient, dark background, no text icon"
  "Professional logo, Google like search abstract, search, purple blue gradient, dark background, no text icon"
  "Professional logo, abstract keyword tag, SEO, purple cyan gradient, dark background, no text icon"
  "Professional logo, map pin with star, local SEO, purple blue gradient, dark background, no text icon"
  "Professional logo, abstract backlink, connections, purple cyan gradient, dark background, no text icon"
  "Professional logo, search algorithm abstract, SEO, purple blue gradient, dark background, no text icon"
  "Professional logo, abstract page ranking, SEO, purple cyan gradient, dark background, no text icon"
  "Professional logo, abstract content strategy, content, purple blue gradient, dark background, no text icon"

  # 121-130: Abstract geométrico
  "Professional logo, abstract geometric blob, modern, purple cyan gradient, dark background, no text icon"
  "Professional logo, interlocking circles, connection, purple blue gradient, dark background, no text icon"
  "Professional logo, abstract origami crane, creativity, purple cyan gradient, dark background, no text icon"
  "Professional logo, geometric pattern mosaic, design, purple blue gradient, dark background, no text icon"
  "Professional logo, abstract crystal gem, premium, purple cyan gradient, dark background, no text icon"
  "Professional logo, mandala abstract, balance, purple blue gradient, dark background, no text icon"
  "Professional logo, abstract spiral galaxy, cosmos, purple cyan gradient, dark background, no text icon"
  "Professional logo, geometric low poly, modern, purple blue gradient, dark background, no text icon"
  "Professional logo, abstract zen circle, minimal, purple cyan gradient, dark background, no text icon"
  "Professional logo, sacred geometry, abstract, purple blue gradient, dark background, no text icon"

  # 131-140: Premium y lujo
  "Professional logo, crown with spark, premium, purple cyan gradient, dark background, no text icon"
  "Professional logo, diamond with light, luxury, purple blue gradient, dark background, no text icon"
  "Professional logo, abstract gold bar, premium, purple cyan gradient, dark background, no text icon"
  "Professional logo, award trophy, excellence, purple blue gradient, dark background, no text icon"
  "Professional logo, abstract medal, achievement, purple cyan gradient, dark background, no text icon"
  "Professional logo, ribbon award, premium, purple blue gradient, dark background, no text icon"
  "Professional logo, abstract luxury emblem, premium, purple cyan gradient, dark background, no text icon"
  "Professional logo, shield with crown, premium, purple blue gradient, dark background, no text icon"
  "Professional logo, abstract luxury monogram, premium, purple cyan gradient, dark background, no text icon"
  "Professional logo, scepter modern, premium, purple blue gradient, dark background, no text icon"

  # 141-150: Naturaleza y metafóricos
  "Professional logo, phoenix rising, transformation, purple cyan gradient, dark background, no text icon"
  "Professional logo, eagle abstract, vision, purple blue gradient, dark background, no text icon"
  "Professional logo, lion head modern, strength, purple cyan gradient, dark background, no text icon"
  "Professional logo, wolf abstract, leadership, purple blue gradient, dark background, no text icon"
  "Professional logo, owl minimal, wisdom, purple cyan gradient, dark background, no text icon"
  "Professional logo, bull abstract, power, purple blue gradient, dark background, no text icon"
  "Professional logo, horse galloping, speed, purple cyan gradient, dark background, no text icon"
  "Professional logo, dolphin abstract, intelligence, purple blue gradient, dark background, no text icon"
  "Professional logo, butterfly transformation, change, purple cyan gradient, dark background, no text icon"
  "Professional logo, bee abstract, productivity, purple blue gradient, dark background, no text icon"

  # 151-160: Símbolos varios
  "Professional logo, compass with needle, direction, purple cyan gradient, dark background, no text icon"
  "Professional logo, anchor modern, stability, purple blue gradient, dark background, no text icon"
  "Professional logo, key with spark, solution, purple cyan gradient, dark background, no text icon"
  "Professional logo, lock with shield, security, purple blue gradient, dark background, no text icon"
  "Professional logo, lightning bolt, power, purple cyan gradient, dark background, no text icon"
  "Professional logo, flame fire, energy, purple blue gradient, dark background, no text icon"
  "Professional logo, water drop ripple, impact, purple cyan gradient, dark background, no text icon"
  "Professional logo, sun with rays, brightness, purple blue gradient, dark background, no text icon"
  "Professional logo, moon crescent, night, purple cyan gradient, dark background, no text icon"
  "Professional logo, star burst, excellence, purple blue gradient, dark background, no text icon"

  # 161-170: Conexión y red
  "Professional logo, network nodes connected, tech, purple cyan gradient, dark background, no text icon"
  "Professional logo, abstract people connected, community, purple blue gradient, dark background, no text icon"
  "Professional logo, handshake modern, partnership, purple cyan gradient, dark background, no text icon"
  "Professional logo, linked chain, connection, purple blue gradient, dark background, no text icon"
  "Professional logo, abstract bridge, connection, purple cyan gradient, dark background, no text icon"
  "Professional logo, infinity loop, continuous, purple blue gradient, dark background, no text icon"
  "Professional logo, abstract wifi waves, connectivity, purple cyan gradient, dark background, no text icon"
  "Professional logo, network globe, global, purple blue gradient, dark background, no text icon"
  "Professional logo, abstract web network, connections, purple cyan gradient, dark background, no text icon"
  "Professional logo, puzzle pieces fitting, solution, purple blue gradient, dark background, no text icon"

  # 171-180: Velocidad y motion
  "Professional logo, speed lines abstract, fast, purple cyan gradient, dark background, no text icon"
  "Professional logo, rocket boost, launch, purple blue gradient, dark background, no text icon"
  "Professional logo, abstract motion blur, dynamic, purple cyan gradient, dark background, no text icon"
  "Professional logo, cheetah running, speed, purple blue gradient, dark background, no text icon"
  "Professional logo, lightning fast, energy, purple cyan gradient, dark background, no text icon"
  "Professional logo, abstract turbine, power, purple blue gradient, dark background, no text icon"
  "Professional logo, speedometer gauge, performance, purple cyan gradient, dark background, no text icon"
  "Professional logo, abstract wind, motion, purple blue gradient, dark background, no text icon"
  "Professional logo, racing flag, speed, purple cyan gradient, dark background, no text icon"
  "Professional logo, abstract velocity, fast, purple blue gradient, dark background, no text icon"

  # 181-190: Creativos y únicos
  "Professional logo, abstract origami bird, creativity, purple cyan gradient, dark background, no text icon"
  "Professional logo, geometric fox, clever, purple blue gradient, dark background, no text icon"
  "Professional logo, abstract ninja, stealth, purple cyan gradient, dark background, no text icon"
  "Professional logo, abstract samurai, discipline, purple blue gradient, dark background, no text icon"
  "Professional logo, abstract wizard, magic, purple cyan gradient, dark background, no text icon"
  "Professional logo, abstract alchemist, transformation, purple blue gradient, dark background, no text icon"
  "Professional logo, abstract explorer, adventure, purple cyan gradient, dark background, no text icon"
  "Professional logo, abstract pioneer, innovation, purple blue gradient, dark background, no text icon"
  "Professional logo, abstract architect, design, purple cyan gradient, dark background, no text icon"
  "Professional logo, abstract inventor, creation, purple blue gradient, dark background, no text icon"

  # 191-200: Mix final
  "Professional logo, abstract music waves, audio, purple cyan gradient, dark background, no text icon"
  "Professional logo, abstract video play, media, purple blue gradient, dark background, no text icon"
  "Professional logo, camera with spark, photo, purple cyan gradient, dark background, no text icon"
  "Professional logo, microphone with waves, podcast, purple blue gradient, dark background, no text icon"
  "Professional logo, abstract palette art, creative, purple cyan gradient, dark background, no text icon"
  "Professional logo, brush stroke, art, purple blue gradient, dark background, no text icon"
  "Professional logo, abstract pen writing, content, purple cyan gradient, dark background, no text icon"
  "Professional logo, book open with spark, knowledge, purple blue gradient, dark background, no text icon"
  "Professional logo, graduation cap, education, purple cyan gradient, dark background, no text icon"
  "Professional logo, abstract infinity star, premium, purple blue gradient, dark background, no text icon"
)

# Generar logos del 51 al 200
for i in $(seq 51 200); do
  idx=$((i - 51))
  prompt="${PROMPTS[$idx]}"
  output="/tmp/logos200/logo${i}.png"

  if [ -f "$output" ]; then
    echo "✓ Logo $i ya existe"
    continue
  fi

  echo -n "Generando logo $i... "
  z-ai image -p "$prompt" -o "$output" -s 1024x1024 2>&1 | tail -1
done

echo ""
echo "=== RESUMEN ==="
ls /tmp/logos200/ | wc -l
echo "logos generados"