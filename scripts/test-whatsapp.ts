import { formatPhoneForWhatsApp } from "../src/lib/whatsapp";

const tests = [
  { input: "3227072022", expected: "573227072022", desc: "10 dígitos sin prefijo" },
  { input: "322 707 2022", expected: "573227072022", desc: "10 dígitos con espacios" },
  { input: "+57 322 707 2022", expected: "573227072022", desc: "Con +57 y espacios" },
  { input: "573227072022", expected: "573227072022", desc: "Ya con 57" },
  { input: "3001234567", expected: "573001234567", desc: "Otro número colombiano" },
  { input: "+57 311 234 5678", expected: "573112345678", desc: "Con +57 y guiones" },
];

let pass = 0;
for (const t of tests) {
  const result = formatPhoneForWhatsApp(t.input);
  const ok = result === t.expected;
  console.log(`${ok ? "✅" : "❌"} ${t.desc}: "${t.input}" → "${result}" (esperado: "${t.expected}")`);
  if (ok) pass++;
}
console.log(`\n${pass}/${tests.length} pruebas pasaron`);
