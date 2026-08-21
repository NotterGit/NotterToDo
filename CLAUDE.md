# CLAUDE.md — Notter ToDo

## CRITICAL RULES
- **NEVER RUN `npm run build` OR `next build`.**
- For type checks: `npx tsc --noEmit`
- For linting: `npm run lint`
- Dev server: `npm run dev`
- Prisma Studio: `npm run studio`

---

## TECH STACK
- **Framework**: Next.js 15 (App Router, Server Actions), React 19, TypeScript
- **Styling**: Tailwind CSS v4, `clsx`, `tailwind-merge` (`cn` helper)
- **UI**: Radix / Base UI / shadcn-style, Lucide icons, `tw-animate-css`
- **Database**: MariaDB / MySQL via Prisma 7 (`@prisma/client`, `@prisma/adapter-mariadb`)
- **Auth**: Clerk (`@clerk/nextjs`, `@clerk/themes`)
- **State**: Zustand (modals, UI state), TanStack React Query (client cache/fetching)
- **DnD**: `@hello-pangea/dnd`
- **Validation**: Zod
- **Notifications**: `react-hot-toast`
- **Images**: Unsplash API (`unsplash-js`)

---

## DIRECTORY STRUCTURE

```
/
├── prisma/schema.prisma         # Models: Board, List, Card, AuditLog. Enums: ACTION, ENTITY_TYPE
├── src/
│   ├── actions/                 # Modular Server Actions (one directory per action)
│   │   └── <action-name>/       # index.ts (handler), schema.ts (Zod), types.ts (ActionState)
│   ├── app/                     # App Router routes & layouts
│   │   ├── (landing)/           # Public landing page
│   │   ├── (dashboard)/         # Protected dashboard & board pages
│   │   │   ├── board/[boardId]/ # Kanban board view
│   │   │   └── dashboard/[orgId]/ # Org boards, activity, settings
│   │   ├── auth/                # Clerk auth pages (sign-in, sign-up, select-org)
│   │   ├── api/                 # Route Handlers
│   │   ├── globals.css          # Global Tailwind styles
│   │   ├── layout.tsx           # Root layout with providers
│   │   └── middleware.ts        # Clerk route matcher & protection
│   ├── components/
│   │   ├── dashboard/           # Sidebar, navbar, board list components
│   │   ├── form/                # FormInput, FormTextarea, FormPicker, FormButton, FormErrors, FormPopover
│   │   ├── landing/             # Landing navbar/footer
│   │   ├── modals/              # Global modals (card-modal, etc.)
│   │   ├── providers/           # QueryProvider, ModalProvider, ThemeProvider
│   │   └── ui/                  # Primitives (button, input, dialog, popover, sheet, etc.)
│   ├── config/
│   │   ├── const/               # Constants (app, banner images, limits, links)
│   │   ├── routing/             # pages.route.ts (pages.*), api.route.ts (apiRoutes.*)
│   │   └── types/               # Nav & config types
│   ├── hooks/                   # use-action.ts, use-card-modal.ts, use-mobile-sidebar.ts
│   ├── lib/                     # db.ts (Prisma singleton), create-safe-action.ts, audit-log.ts, utils.ts, fetcher.ts
│   └── types.ts                 # ActionState<TInput, TOutput>
```

---

## ARCHITECTURE & CODING STANDARDS

### 1. Server Actions Pattern
All data mutations MUST follow the safe-action pattern:
- Directory: `src/actions/<action-name>/`
- `schema.ts`: Zod schema for input validation.
- `types.ts`: `InputType = z.infer<typeof Schema>`, `ReturnType = ActionState<InputType, ResultModel>`.
- `index.ts`:
  ```ts
  "use server"
  import { auth } from "@clerk/nextjs/server"
  import { db } from "@/lib/db"
  import { createSafeAction } from "@/lib/create-safe-action"
  import { createAuditLog } from "@/lib/audit-log"
  import { revalidatePath } from "next/cache"
  import { pages } from "@/config/routing/pages.route"
  import { ActionSchema } from "./schema"
  import { InputType, ReturnType } from "./types"

  const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId: clerkOrgId } = await auth()
    const orgId = clerkOrgId || userId
    if (!userId || !orgId) return { error: "Unauthorized" }

    // Execute db queries & createAuditLog if needed
    // revalidatePath(...)
    // return { data: result }
  }

  export const actionName = createSafeAction(ActionSchema, handler)
  ```

### 2. Client-Side Mutation Invocations
Always invoke server actions via `useAction`:
```tsx
const { execute, fieldErrors, isLoading } = useAction(actionName, {
  onSuccess: (data) => toast.success("Created"),
  onError: (error) => toast.error(error)
})
```

### 3. Routing Rules
- **NEVER hardcode URL strings.**
- Use `pages.*` from `@/config/routing/pages.route` (`pages.ROOT`, `pages.DASHBOARD(id)`, `pages.BOARD(id)`, `pages.AUTH.*`, etc.).
- Use `apiRoutes.*` from `@/config/routing/api.route`.

### 4. Database & Logging
- Always import Prisma client from `@/lib/db`: `import { db } from "@/lib/db"`.
- Log entity changes using `createAuditLog` from `@/lib/audit-log`.

### 5. UI State & Forms
- Global UI state (modals, sidebars) must use Zustand stores in `src/hooks/`.
- Use pre-built form inputs from `src/components/form/` (`FormInput`, `FormTextarea`, `FormPicker`, `FormButton`, `FormErrors`, `FormPopover`).
- Merge classes using `cn()` from `@/lib/utils`.

### 6. Naming Conventions
- **Files**: `kebab-case.ts` / `kebab-case.tsx`
- **Components**: `PascalCase`
- **Hooks**: `useCamelCase`
- **Types/Interfaces**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE` or `camelCase` dictionaries
- **Imports**: Always use path alias `@/*`
