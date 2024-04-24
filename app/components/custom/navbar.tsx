// import statements
import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export const NavBar = () => {
  return (
    <nav className="bg-gray-800 py-2 flex justify-center">
      <div className="flex justify-center items-center w-2/5 sm:w-1/2">
        <div className="relative h-14 items-center flex-initial">
          <Link to="/">
            <img
              className="h-14 w-auto"
              src="https://cdn.worldvectorlogo.com/logos/pokemon-23.svg"
              alt="Pokemon image"
            />
          </Link>
        </div>
        <div className="ml-8 sm:block flex-grow text-center">
          <div className="mx-auto flex items-center justify-center space-x-2">
            <Input placeholder="Type Pokemon Name" />
            <Button className="bg-blue-600 hover:bg-blue-500" type="submit">Search</Button>
          </div>
        </div>
      </div>
    </nav>
  )
}