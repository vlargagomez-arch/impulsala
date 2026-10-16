// Test: full booking flow with React-aware value setting + sticky CTA dismissal
const { chromium } = require('playwright');

async function reactFill(page, selector, value) {
  await page.evaluate(({ sel, val }) => {
    const el = document.querySelector(sel);
    if (!el) return;
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(el, val);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, { sel: selector, val: value });
  await page.waitForTimeout(300);
}

async function clickContinuar(page) {
  // Wait for button to be enabled, then click
  await page.locator('button', { hasText: 'Continuar' }).click({ state: 'attached' });
  await page.waitForTimeout(700);
}

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Dismiss sticky CTA if present (click its X button)
  const dismissBtn = page.locator('[aria-label="Cerrar"]');
  if (await dismissBtn.count() > 0) {
    await dismissBtn.click().catch(() => {});
    await page.waitForTimeout(500);
  }

  // Click "Agendar diagnóstico" quick prompt
  await page.getByRole('button', { name: 'Agendar diagnóstico' }).click();
  await page.waitForTimeout(1800);

  // Step 1: Name
  await reactFill(page, 'input[placeholder="Ej: Carlos Mendoza"]', 'Carlos Mendoza');
  await page.locator('button', { hasText: 'Continuar' }).click();
  await page.waitForTimeout(700);

  // Step 2: Business
  await reactFill(page, 'input[placeholder="Ej: TechStart S.A.S"]', 'TechStart S.A.S');
  await page.locator('button', { hasText: 'Continuar' }).click();
  await page.waitForTimeout(700);

  // Step 3: hasWebsite
  await page.getByRole('button', { name: 'Sí, tengo web' }).click();
  await page.waitForTimeout(900);

  // Step 4: Email
  await reactFill(page, 'input[placeholder="tu@empresa.com"]', 'carlos@techstart.com');
  await page.locator('button', { hasText: 'Continuar' }).click();
  await page.waitForTimeout(700);

  // Step 5: Phone
  await reactFill(page, 'input[placeholder="+57 300 000 0000"]', '+57 300 555 1234');
  await page.locator('button', { hasText: 'Continuar' }).click();
  await page.waitForTimeout(2500); // wait for slots to load

  // Step 6: Pick first slot
  const slotButtons = await page.locator('button', { hasText: /a\. m\.|p\. m\./ }).all();
  console.log(`Found ${slotButtons.length} slot buttons`);
  if (slotButtons.length === 0) {
    console.log('ERROR: No slots found');
    await page.screenshot({ path: '/home/z/my-project/download/booking-no-slots.png' });
    await browser.close();
    return;
  }
  await slotButtons[0].click();
  await page.waitForTimeout(500);

  // Confirm
  await page.locator('button', { hasText: 'Confirmar cita' }).click();
  await page.waitForTimeout(3000);

  // Check confirmation
  const confirmationText = await page.getByText('¡Cita confirmada!').count();
  const googleCalLink = await page.getByRole('link', { name: /Agregar a Google Calendar/ }).count();

  console.log('Confirmation shown:', confirmationText > 0);
  console.log('Google Calendar link shown:', googleCalLink > 0);

  await page.screenshot({ path: '/home/z/my-project/download/booking-confirmation.png', fullPage: false });

  await browser.close();
  console.log('DONE');
})();
