import { test, expect } from '@playwright/test'

test('landing page shows hero and CTA', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Votre avis compte' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Donner mon avis' })).toBeVisible()
})

test('empty form submits and shows thank-you', async ({ page }) => {
  await page.goto('/survey')
  await page.getByRole('button', { name: 'Envoyer mes réponses' }).click()
  await expect(page).toHaveURL('/merci')
  await expect(page.getByRole('heading', { name: /Merci/ })).toBeVisible()
})

test('full form submission succeeds', async ({ page }) => {
  await page.goto('/survey')
  await page.getByLabel('Au siège').check()
  await page.getByRole('button', { name: '4' }).click()
  await page.getByLabel("Communication et circulation de l'information").check()
  await page.getByLabel('Formations et certifications').check()
  await page.getByLabel("J'utilise déjà des outils d'IA dans mon travail.").check()
  await page.getByLabel(/changer une seule chose/).fill('Plus de partage.')
  await page.getByRole('button', { name: 'Envoyer mes réponses' }).click()
  await expect(page).toHaveURL('/merci')
})
