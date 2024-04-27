import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
  useRevalidator,
} from "@remix-run/react";
import { Analytics } from "@vercel/analytics/react";
import { NavBar } from "./components/custom/navbar";
import { Button } from "~/components/ui/button";
import styles from "./tailwind.css?url";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/auth-helpers-remix";
import createServerSupabase from "utils/supabase";
import type { Database } from "db_types";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];

// loader function
export async function loader({
  request
}: LoaderFunctionArgs) {
  // get env values from server
  // pass env values to client
  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!
  };

  // use server client
  const response = new Response();
  const supabase = createServerSupabase({ request, response });

  // retrieve currently logged in user
  const { data: { user } } = await supabase.auth.getUser();

  // retrieve session from server
  const { data: { session } } = await supabase.auth.getSession();

  return json({ env, session, user }, { headers: response.headers })
}

export function Layout({ children }: { children: React.ReactNode }) {
  // get env values from loader function
  const { env, session, user } = useLoaderData<typeof loader>();

  // create singleton supabase client
  const [supabase] = useState(() =>
    createBrowserClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
  );

  // event handler for login
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google"
    });
  }

  // call loader function on login and logout events
  const revalidator = useRevalidator();
  const serverAccessToken = session?.access_token;
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // data is out of sync 
      if (session?.access_token !== serverAccessToken) {
        revalidator.revalidate();
      }
    })

    return () => {
      subscription.unsubscribe();
    }
  }, [supabase, serverAccessToken, revalidator]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Pokedex</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div>
          {
            user ?
              <>
                <NavBar supabase={supabase} />
                {children}
              </> :
              <div>
                <Button onClick={handleLogin}>Login</Button>
              </div>
          }
          <ScrollRestoration />
          <Scripts />
          <Analytics />
        </div>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
