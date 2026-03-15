# Auth Guard

> Global `AdminGuard` protects all endpoints by default. Use `@Public()` to opt out.

## Overview

The backend uses a single global guard (`AdminGuard`) registered in `AppModule`. All routes require a valid Bearer token unless explicitly marked with `@Public()`.

---

## Implementation

**File**: `backend/libs/shared/util/src/lib/admin-auth.guard.ts`

```ts
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Check for @Public() metadata → allow immediately
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    // 2. Extract Bearer token from Authorization header
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException(...);

    // 3. Compare token against ADMIN_IDENTIFIER env var
    const adminIdentifier = this.configService.get('ADMIN_IDENTIFIER');
    return token === adminIdentifier;
  }
}
```

---

## Registration in AppModule

```ts
// backend/apps/tilloh-dev/src/main.ts
providers: [
  {
    provide: APP_GUARD,
    useClass: AdminGuard,
  },
],
```

---

## Usage in Controllers

```ts
// Mark a single endpoint as public (no auth required)
@Public()
@Get('/random')
getRandomJoke() { ... }

// Leave off @Public() for admin-only endpoints (requires Bearer token)
@ApiBearerAuth()
@Get('/')
listJokes() { ... }
```

---

## Environment Variable

| Variable | Description |
|----------|-------------|
| `ADMIN_IDENTIFIER` | The secret Bearer token checked against incoming requests |

---

## Throttler Guard

A second global guard `ThrottlerGuard` is also registered. Default: **500 requests per 5 minutes**. The `admin` POST `/verify` endpoint uses a stricter limit: 300 per 5 minutes.

---

## Key Notes

- Token comparison is a simple string equality check against `ADMIN_IDENTIFIER` — no JWT, no sessions.
- `@Public()` is a NestJS metadata decorator, not a real security skip; the guard still runs but short-circuits.
- Export path: `@backend/util` → `backend/libs/shared/util/src/index.ts`
