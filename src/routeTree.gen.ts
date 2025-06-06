/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'

// Create Virtual Routes

const TestLazyImport = createFileRoute('/test')()
const ScrollBlurTextLazyImport = createFileRoute('/scroll-blur-text')()
const LoaderFx1LazyImport = createFileRoute('/loader-fx1')()
const LenisScaleAndPinLazyImport = createFileRoute('/lenis-scale-and-pin')()
const HelloLazyImport = createFileRoute('/hello')()
const CircleAnimationLazyImport = createFileRoute('/circle-animation')()

// Create/Update Routes

const TestLazyRoute = TestLazyImport.update({
  id: '/test',
  path: '/test',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/test.lazy').then((d) => d.Route))

const ScrollBlurTextLazyRoute = ScrollBlurTextLazyImport.update({
  id: '/scroll-blur-text',
  path: '/scroll-blur-text',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/scroll-blur-text.lazy').then((d) => d.Route),
)

const LoaderFx1LazyRoute = LoaderFx1LazyImport.update({
  id: '/loader-fx1',
  path: '/loader-fx1',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/loader-fx1.lazy').then((d) => d.Route))

const LenisScaleAndPinLazyRoute = LenisScaleAndPinLazyImport.update({
  id: '/lenis-scale-and-pin',
  path: '/lenis-scale-and-pin',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/lenis-scale-and-pin.lazy').then((d) => d.Route),
)

const HelloLazyRoute = HelloLazyImport.update({
  id: '/hello',
  path: '/hello',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/hello.lazy').then((d) => d.Route))

const CircleAnimationLazyRoute = CircleAnimationLazyImport.update({
  id: '/circle-animation',
  path: '/circle-animation',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/circle-animation.lazy').then((d) => d.Route),
)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/circle-animation': {
      id: '/circle-animation'
      path: '/circle-animation'
      fullPath: '/circle-animation'
      preLoaderRoute: typeof CircleAnimationLazyImport
      parentRoute: typeof rootRoute
    }
    '/hello': {
      id: '/hello'
      path: '/hello'
      fullPath: '/hello'
      preLoaderRoute: typeof HelloLazyImport
      parentRoute: typeof rootRoute
    }
    '/lenis-scale-and-pin': {
      id: '/lenis-scale-and-pin'
      path: '/lenis-scale-and-pin'
      fullPath: '/lenis-scale-and-pin'
      preLoaderRoute: typeof LenisScaleAndPinLazyImport
      parentRoute: typeof rootRoute
    }
    '/loader-fx1': {
      id: '/loader-fx1'
      path: '/loader-fx1'
      fullPath: '/loader-fx1'
      preLoaderRoute: typeof LoaderFx1LazyImport
      parentRoute: typeof rootRoute
    }
    '/scroll-blur-text': {
      id: '/scroll-blur-text'
      path: '/scroll-blur-text'
      fullPath: '/scroll-blur-text'
      preLoaderRoute: typeof ScrollBlurTextLazyImport
      parentRoute: typeof rootRoute
    }
    '/test': {
      id: '/test'
      path: '/test'
      fullPath: '/test'
      preLoaderRoute: typeof TestLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/circle-animation': typeof CircleAnimationLazyRoute
  '/hello': typeof HelloLazyRoute
  '/lenis-scale-and-pin': typeof LenisScaleAndPinLazyRoute
  '/loader-fx1': typeof LoaderFx1LazyRoute
  '/scroll-blur-text': typeof ScrollBlurTextLazyRoute
  '/test': typeof TestLazyRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/circle-animation': typeof CircleAnimationLazyRoute
  '/hello': typeof HelloLazyRoute
  '/lenis-scale-and-pin': typeof LenisScaleAndPinLazyRoute
  '/loader-fx1': typeof LoaderFx1LazyRoute
  '/scroll-blur-text': typeof ScrollBlurTextLazyRoute
  '/test': typeof TestLazyRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/circle-animation': typeof CircleAnimationLazyRoute
  '/hello': typeof HelloLazyRoute
  '/lenis-scale-and-pin': typeof LenisScaleAndPinLazyRoute
  '/loader-fx1': typeof LoaderFx1LazyRoute
  '/scroll-blur-text': typeof ScrollBlurTextLazyRoute
  '/test': typeof TestLazyRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/circle-animation'
    | '/hello'
    | '/lenis-scale-and-pin'
    | '/loader-fx1'
    | '/scroll-blur-text'
    | '/test'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/circle-animation'
    | '/hello'
    | '/lenis-scale-and-pin'
    | '/loader-fx1'
    | '/scroll-blur-text'
    | '/test'
  id:
    | '__root__'
    | '/'
    | '/circle-animation'
    | '/hello'
    | '/lenis-scale-and-pin'
    | '/loader-fx1'
    | '/scroll-blur-text'
    | '/test'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  CircleAnimationLazyRoute: typeof CircleAnimationLazyRoute
  HelloLazyRoute: typeof HelloLazyRoute
  LenisScaleAndPinLazyRoute: typeof LenisScaleAndPinLazyRoute
  LoaderFx1LazyRoute: typeof LoaderFx1LazyRoute
  ScrollBlurTextLazyRoute: typeof ScrollBlurTextLazyRoute
  TestLazyRoute: typeof TestLazyRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  CircleAnimationLazyRoute: CircleAnimationLazyRoute,
  HelloLazyRoute: HelloLazyRoute,
  LenisScaleAndPinLazyRoute: LenisScaleAndPinLazyRoute,
  LoaderFx1LazyRoute: LoaderFx1LazyRoute,
  ScrollBlurTextLazyRoute: ScrollBlurTextLazyRoute,
  TestLazyRoute: TestLazyRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/circle-animation",
        "/hello",
        "/lenis-scale-and-pin",
        "/loader-fx1",
        "/scroll-blur-text",
        "/test"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/circle-animation": {
      "filePath": "circle-animation.lazy.tsx"
    },
    "/hello": {
      "filePath": "hello.lazy.tsx"
    },
    "/lenis-scale-and-pin": {
      "filePath": "lenis-scale-and-pin.lazy.tsx"
    },
    "/loader-fx1": {
      "filePath": "loader-fx1.lazy.tsx"
    },
    "/scroll-blur-text": {
      "filePath": "scroll-blur-text.lazy.tsx"
    },
    "/test": {
      "filePath": "test.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
