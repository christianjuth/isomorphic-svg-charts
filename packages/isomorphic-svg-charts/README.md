# Getting Started

So you're like me and you love Server Actions, but you **need more Zod and TypeScript**!

### Why Use This Library?

* Server action validation with [`zod-form-data`](https://www.npmjs.com/package/zod-form-data)
* Server error handling
* Amazing TypeScript DX
* Doesn't break [`useActionState` progressive enhancement](https://react.dev/reference/rsc/server-actions#progressive-enhancement-with-useactionstate)
* No dependencies other then `zod`/`zod-form-data`

### Why React 19+ is required

This library is designed to enhance `useActionState`, which requires React 19. Without that, you really won't get much benefit from this library.

I have only tested with Next.js for now, but the goal is to make this work with React in general.

### Documentation

See [christianjuth.github.io/better-react-server-actions](https://christianjuth.github.io/better-react-server-actions/).

### Example

#### Login Form Example

* [Try it](https://better-react-server-actions-demo.vercel.app/examples/login-form) 
* [View in docs](https://christianjuth.github.io/better-react-server-actions/examples/login-form)

```js
"use server";
 
import { createActionWithState } from 'better-react-server-actions';
import { zfd } from 'zod-form-data';
import { z } from 'zod';
import { redirect } from 'next/navigation';
 
const EMAIL = 'admin@example.com';
const PASSWORD = 'password';
 
export const login = createActionWithState({
  formDataSchema: zfd.formData({
    email: z.string().email(),
    password: zfd.text(),
  }),
  requestHandler: async (prevState, { email, password }) => {
    if (email !== EMAIL || password !== PASSWORD) {
      throw new Error('Invalid email or password');
    }
 
    redirect('/examples/success')
  }
});

```

```jsx
"use client";
 
import { useActionState } from 'react';
import { login } from './action';
 
export default function Page() {
  const [state, action] = useActionState(login, {});
 
  const formErrors = state.errors?.formErrors;
 
  return (
    <form action={action}>
      <h1>Login</h1>
 
      {state.errors?.actionErrors && (
        <span>
          {state.errors.actionErrors.join(', ')}
        </span>
      )}
 
      <label htmlFor="email">Email:</label>
      <input 
        id="email" 
        name="email" 
      />
      {formErrors?.email && (
        <span>
          {formErrors.email.join(', ')}
        </span>
      )}
 
      <label htmlFor="password">Password:</label>
      <input 
        id="password" 
        name="password" 
        type="password" 
      />
      {formErrors?.password && (
        <span>
          {formErrors.password.join(', ')}
        </span>
      )}
 
      <button>
        Login
      </button>
    </form>
  )
}
```

#### Like Button Example

* [Try it](https://better-react-server-actions-demo.vercel.app/examples/like-button)
* [View in docs](https://christianjuth.github.io/better-react-server-actions/examples/like-button)

```js
"use server";
 
import { createActionWithState } from 'better-react-server-actions';
import { z } from 'zod';
 
export const login = createActionWithState({
  stateSchema: z.object({
    likeId: z.string().optional(),
  }),
  requestHandler: async ({ likeId }) => {
    // Check if user is logged in
    // and redirect to login page if not
 
    if (likeId) {
      // Delete like via api
      return {
        likeId: undefined,
      }
    } else {
      // Create like via api
      const newLikeId = 'new-like-id';
      return {
        likeId: newLikeId,
      }
    }
  }
});
```

```jsx
"use client";
 
import { useActionState } from 'react';
import { toggleLike } from './action';
 
export default function Page() {
  const [state, action] = useActionState(toggleLike, {});
 
  return (
    <form action={action}>
      <button>
        {state.likeId ? 'Unlike' : 'Like'}
      </button>
    </form>
  )
}
```

#### Increment Counter Example

* [Try it](https://better-react-server-actions-demo.vercel.app/examples/increment-counter)
* [View in docs](https://christianjuth.github.io/better-react-server-actions/examples/increment-counter)

```js
"use server";
 
import { createActionWithState } from 'better-react-server-actions';
import { z } from 'zod';
 
export const incrementCounter = createActionWithState({
  stateSchema: z.object({
    count: z.number().min(0),
  }),
  requestHandler: async ({ count }) => {
    return {
      count: count + 1,
    }
  }
});
```

```jsx
"use client";
 
import { useActionState } from 'react';
import { incrementCounter } from './action';
 
export default function Page() {
  const [state, action] = useActionState(incrementCounter, {
    count: 0,
  });
 
  return (
    <form action={action}>
      <span>Count: {state.count}</span>
      <button>
        Increment
      </button>
    </form>
  )
}
```
