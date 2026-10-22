import { test, expect } from '@playwright/test'

test('redirects unauthenticated user from /admin to /admin/login', async ({ page }) => {
  await page.goto('/admin')
  await expect(page).toHaveURL(/\/admin\/login/)
})

test('login with wrong credentials shows error', async ({ page }) => {
  await page.goto('/admin/login')
  await page.getByLabel('Adresse e-mail').fill('wrong@synelia.tech')
  await page.getByLabel('Mot de passe').fill('wrong')
  await page.getByRole('button', { name: /Se connecter/ }).click()
  await expect(page.getByRole('alert')).toBeVisible()
  await expect(page).toHaveURL(/\/admin\/login/)
})

test('GET /api/admin/summary returns 401 without auth', async ({ request }) => {
  const res = await request.get('/api/admin/summary')
  expect(res.status()).toBe(401)
})
