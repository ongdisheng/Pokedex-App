// import statements
import { HeadersFunction, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import supabase from "utils/supabase";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { useState } from "react";
import {
  Card,
  Image,
  Typography,
  Flex,
  Row,
  Col,
  Layout
} from "antd";
const { Title, Text } = Typography;
const { Content } = Layout;

// loader function
export const loader = async () => {
  // retrieve owned pokemons from db
  let { data } = await supabase.from("Pokemons_Owned").select();
  data = data ?? [];
  data.sort((a, b) => a.id - b.id);
  return json({ data });
};

// handle cache control for document response
export let headers: HeadersFunction = () => {
  return {
    "Cache-Control": "max-age=0, no-cache, no-store, must-revalidate, private"
  };
};

export default function Index() {
  // get data from loader function
  const { data } = useLoaderData<typeof loader>();

  // display data using pagination
  const pokemonsPerPage = 12;
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(pokemonsPerPage);

  // render owned pokemons data
  return (
    <div>
      {data.length > 0 ?
        <div className="flex flex-col min-h-screen items-center">
          <Title className="text-center m-4">Your Collection</Title>

          <div className="w-2/5 sm:w-3/4 items-center">
            <Row gutter={[16, 16]} justify="center">
              {data.slice(startIndex, endIndex).map(d => (
                <Col key={d.id}>
                  <Link to={`/pokemons/${d.id}`}>
                    <Card hoverable className="min-h-full text-center	w-[200px] sm:w-[300px]">
                      <Image
                        preview={false}
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${d.id}.png`}
                        alt={`${d.name} image`}
                      />
                      <Flex justify="center" align="center" vertical>
                        <Text type="secondary">#{d.id}</Text>
                        <Title level={4} className="capitalize font-bold !text-stone-600 !m-0">{d.name}</Title>
                      </Flex>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
          </div>

          <Pagination className="mt-4">
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
                    data.length <= endIndex ? "pointer-events-none opacity-50" : undefined
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
