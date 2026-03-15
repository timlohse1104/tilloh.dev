# NX Library Scaffold

> How to create a new backend NX library in the `backend/` workspace.

## Reference Library

Use `backend/libs/jokes/` as the scaffold reference. It is the simplest feature library with full structure.

---

## File Structure

```
backend/libs/<name>/
├── project.json           # NX project definition
├── jest.config.ts         # Jest config (references tsconfig.spec.json)
├── tsconfig.json          # Base TS config (extends root tsconfig.base.json)
├── tsconfig.lib.json      # Library build config
├── tsconfig.spec.json     # Test config
├── .eslintrc.json         # ESLint (extends root)
└── src/
    ├── index.ts           # Public API barrel (export * from './lib/...')
    └── lib/
        ├── <name>.module.ts
        ├── <name>.controller.ts
        ├── <name>.service.ts
        ├── <name>-mongodb.service.ts   # (if using MongoDB)
        └── schema/
            └── <name>.schema.ts        # (if using MongoDB)
```

---

## Step-by-step

### 1. Create library directory and files

Copy the `jokes` library structure and rename all references.

### 2. Register path alias in `backend/tsconfig.base.json`

```json
// backend/tsconfig.base.json → compilerOptions.paths
"@backend/<name>": ["libs/<name>/src/index.ts"]
```

### 3. Export public API in `src/index.ts`

```ts
export * from './lib/<name>.module';
// export other public symbols
```

### 4. Register NestJS module in `backend/apps/tilloh-dev/src/main.ts`

```ts
import { NameModule } from '@backend/<name>';

@Module({
  imports: [
    // ...existing modules
    NameModule,
  ],
})
export class AppModule { ... }
```

### 5. Add environment variables (if needed)

Edit `backend/apps/tilloh-dev/src/env.validation.ts`:

```ts
export class EnvironmentVariables {
  // ...existing vars
  @IsString()
  NEW_VAR: string;
}
```

---

## NX Project Config (`project.json`)

Minimal structure based on the jokes library:

```json
{
  "name": "@backend/<name>",
  "sourceRoot": "libs/<name>/src",
  "projectType": "library",
  "targets": {
    "build": { "executor": "@nx/js:tsc" },
    "test": {
      "executor": "@nx/jest:jest",
      "options": { "jestConfig": "libs/<name>/jest.config.ts" }
    }
  }
}
```

---

## Naming Conventions

- **Service functions** (business logic layer): descriptive names — `listJokes`, `createJoke`, `deleteJoke`
- **MongoDB functions** (DB layer): generic CRUD — `findAll`, `findOne`, `create`, `update`, `remove`
- Module class: `NameModule`; Controller: `NameController`; Service: `NameService`; DB service: `NameMongoDbService`
