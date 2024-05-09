
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react";

import { useSWEffect } from "@remix-pwa/sw";

// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('/entry.worker.js')
//     .then((registration) => {
//       console.log('Service Worker registered:', registration.scope);
//     })
//     .catch((error) => {
//       console.error('Service Worker registration failed:', error);
//     });
// }


import stylesheet from "~/tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export default function App() {
  // useSWEffect()

  console.log()
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />

        <link rel="manifest" href="/manifest.json" />
        
      </head>
      <body>
        
        <Outlet/>
        
        <ScrollRestoration/>
        <Scripts/>
        <LiveReload />
        
      </body>
    </html>
  );
}
