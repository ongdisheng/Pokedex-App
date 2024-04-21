// import statements
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import supabase from "utils/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "~/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { useState } from "react";

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

  // display data using pagination
  const pokemonsPerPage = 5;
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(pokemonsPerPage);

  // render owned pokemons data
  return (
    <div>
      {data.length > 0 ?
        <div>
          <h1 className="flex justify-center items-center text-2xl font-mono m-4 font-bold tracking-tight text-gray-900 sm:text-3xl md:text-4xl p-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-tr to-cyan-500 from-blue-600">
              Pokemons Owned
            </span>
          </h1>

          <div className="flex justify-center items-center">
            <Table className="border">
              <TableBody>
                {data.slice(startIndex, endIndex).map(d => (
                  <TableRow key={d.id}>
                    <TableCell className="flex justify-center items-center">
                      <Link to={`/pokemons/${d.id}`}>
                        <img
                          className="scale-125"
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${d.id}.png`}
                          alt={`${d.name} image`}
                        />
                      </Link>
                    </TableCell>
                    <TableCell className="text-center border font-mono text-xl">
                      <Link to={`/pokemons/${d.id}`}>
                        <span>{d.name}</span>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Pagination className="mt-2">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className={
                    startIndex === 0 ? "pointer-events-none opacity-50" : undefined
                  }
                  onClick={() => {
                    setStartIndex(startIndex - pokemonsPerPage);
                    setEndIndex(endIndex - pokemonsPerPage);
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  className={
                    Math.floor(data.length / endIndex) === 0 ? "pointer-events-none opacity-50" : undefined
                  }
                  onClick={() => {
                    setStartIndex(startIndex + pokemonsPerPage);
                    setEndIndex(endIndex + pokemonsPerPage);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div> : null
      }
    </div>
  );
}
