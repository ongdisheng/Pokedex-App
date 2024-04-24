import { Link } from "@remix-run/react"

export const NavBar = () => {
  return (
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 py-2">
        <div className="relative flex h-14 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <Link to="/">
                <img
                  className="h-14 w-auto"
                  src="https://cdn.worldvectorlogo.com/logos/pokemon-23.svg"
                  alt="Pokemon image"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}