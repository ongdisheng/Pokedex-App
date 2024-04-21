// import statements
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import supabase from "utils/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

// loader function
export const loader = async () => {
  // retrieve owned pokemons from db
  let { data } = await supabase.from("Pokemons_Owned").select();
  data = data ?? [];
  return json({ data });
};

export default function Index() {
  // get data from loader function
  const { data } = useLoaderData<typeof loader>();

  // render owned pokemons data
  return (
    <div>
      {data.length > 0 ?
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(d => (
              <TableRow key={d.id}>
                <TableCell>
                  <Link to={`/pokemons/${d.id}`}>
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${d.id}.png`}
                      alt={`${d.name} image`}
                    />
                  </Link>
                </TableCell>
                <TableCell>
                  <Link to={`/pokemons/${d.id}`}>
                    {d.name}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table> :
        null
      }
    </div>
  );
}
