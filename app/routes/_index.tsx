// import statements
import { json } from "@remix-run/node"; 
import { useLoaderData } from "@remix-run/react";
import supabase from "utils/supabase";

// loader function
export const loader = async () => {
  // retrieve owned pokemons from db
  const { data } = await supabase.from("Pokemons_Owned").select();
  return json({ data });
};

export default function Index() {
  // get data from loader function
  const { data } = useLoaderData<typeof loader>();

  // render owned pokemons data
  return (
    <div>
      {JSON.stringify(data)}
    </div>
  );
}
