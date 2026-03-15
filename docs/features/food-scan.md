# Food Scan

> OCR image text extraction — upload a food label image and get the extracted text via OCR.space API.

## Architecture Pattern

The frontend uploads an image file to the NestJS backend, which proxies it to the external OCR.space API. The result (extracted text + structured data) is returned to the frontend. No database persistence — stateless proxy.

---

## Backend

**NX Library**: `backend/libs/ocr/`
**Path alias**: `@backend/ocr`

The OCR module wraps the shared OCR provider (`@backend/shared-ocr`).

### Module Structure

| File | Purpose |
|------|---------|
| `src/lib/ocr.module.ts` | NestJS module |
| `src/lib/ocr.controller.ts` | File upload endpoint |

Shared provider: `backend/libs/shared/provider/ocr/`
**Path alias**: `@backend/shared-ocr`

### API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/v1/ocr` | Public | Upload image, returns OCR text extraction |

**File upload**: Uses `@nest-lab/fastify-multer` with `FileInterceptor('file')`. The `fastifyMultipart` plugin is registered in `main.ts`.

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OCR_SPACE_URL` | Yes | OCR.space API endpoint (`https://api.ocr.space/parse/image`) |
| `OCR_SPACE_API_KEY` | Yes | OCR.space API key |

---

## Frontend

**Route**: `/food-scan`
**Route files**: `frontend/src/routes/food-scan/+page.svelte`, `+page.ts`

### API Client

`frontend/src/lib/api/ocr.api.ts`

Sends image as `multipart/form-data` to `POST /v1/ocr`.

### Types

`frontend/src/lib/types/ocr-space.dto.ts`

`OcrSpaceResponseDto` — structured OCR result from OCR.space.

### i18n Key Prefix

Keys under `foodScan.*` in translation files.

---

## Toggle Configuration

| Property | Value |
|----------|-------|
| Toggle key | `TOGGLE_NAV_FOOD_SCAN` |
| Seed default | `'true'` |
| Frontend enum | `TogglesEnum.foodScan` |
| Route config | `applicationRoutes['food-scan']` |

---

## Shared Infrastructure Dependencies

- [toggle-system.md](../shared/toggle-system.md)
- [route-page-pattern.md](../shared/route-page-pattern.md)
- [auth-guard.md](../shared/auth-guard.md)

---

## Key Implementation Notes

- The backend acts as a pure proxy — it only forwards the file to OCR.space and returns the response.
- `fastifyMultipart` must be registered in `main.ts` for file uploads to work with Fastify.
- The endpoint is `@Public()` — no auth required to scan images.
