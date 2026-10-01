/**
 * Test del parser JSON de los agentes (extractJson).
 * Uso: bun run scripts/test-extract-json.ts
 */
import { extractJson } from "../src/lib/agents/deepseek";

type Caso = { nombre: string; entrada: string; espera: "ok" | "null" };

const casos: Caso[] = [
  { nombre: "json limpio", entrada: '{"a":1,"b":[1,2]}', espera: "ok" },
  { nombre: "vallas markdown", entrada: '```json\n{"a":1}\n```', espera: "ok" },
  { nombre: "texto alrededor", entrada: 'Claro, aquí va:\n{"a":1}\nEspero que sirva.', espera: "ok" },
  { nombre: "truncado a mitad de string", entrada: '{"title":"Cómo vender más","blocks":[{"type":"p","content":"texto que se cor', espera: "ok" },
  { nombre: "truncado sin cerrar arreglo", entrada: '{"title":"X","blocks":[{"type":"h2","content":"Uno"},{"type":"p","content":"Dos"}', espera: "ok" },
  { nombre: "truncado con propiedad sin valor", entrada: '{"title":"X","blocks":[{"type":"p"}],"excerpt":', espera: "ok" },
  { nombre: "basura sin json", entrada: "lo siento, no puedo ayudarte con eso", espera: "null" },
  { nombre: "vacío", entrada: "", espera: "null" },
];

let fallos = 0;
for (const c of casos) {
  const r = extractJson(c.entrada);
  const ok = c.espera === "ok" ? r !== null : r === null;
  if (!ok) fallos++;
  console.log(`${ok ? "PASS" : "FALLA"} · ${c.nombre} → ${JSON.stringify(r)?.slice(0, 90)}`);
}
console.log(fallos === 0 ? "\nTODO OK" : `\n${fallos} FALLOS`);
process.exit(fallos === 0 ? 0 : 1);
