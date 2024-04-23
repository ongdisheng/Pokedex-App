// get pokemon type color
export const getTypeColor = (type: string) => {
  const typeColors: { [key: string]: string } = {
    bug: "bg-lime-500",
    dark: "bg-zinc-600",
    dragon: "bg-orange-300",
    electric: "bg-yellow-400",
    fairy: "bg-pink-300",
    fire: "bg-orange-400",
    fighting: "bg-amber-600",
    flying: "bg-sky-200",
    ghost: "bg-purple-300",
    grass: "bg-lime-400",
    ground: "bg-yellow-700",
    ice: "bg-cyan-300",
    normal: "bg-slate-400",
    poison: "bg-purple-300",
    psychic: "bg-rose-400",
    rock: "bg-yellow-600",
    shadow: "bg-stone-500",
    steel: "bg-gray-400",
    unknown: "bg-emerald-400",
    water: "bg-blue-500",
  };

  return typeColors[type] || "#FFF";
};