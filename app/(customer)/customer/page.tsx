import Image from "next/image";
import Link from "next/link";
import {
  Baby,
  Bike,
  BookOpen,
  Coffee,
  Cpu,
  House,
  PawPrint,
  Shirt,
  Sparkles,
  ToyBrick,
} from "lucide-react";

const categories = [
  {
    name: "Home & Kitchen",
    icon: House,
    items: [
      ["Cookware", "cookware"],
      ["Kitchen tools", "kitchen-tools"],
      ["Bedding", "bedding"],
      ["Storage & organization", "storage"],
    ],
  },
  {
    name: "Electronics",
    icon: Cpu,
    items: [
      ["Headphones", "headphones"],
      ["Smart home", "smart-home"],
      ["Cameras", "cameras"],
      ["Computer accessories", "computer-accessories"],
    ],
  },
  {
    name: "Fashion",
    icon: Shirt,
    items: [
      ["Women's clothing", "womens-clothing"],
      ["Men's clothing", "mens-clothing"],
      ["Shoes", "shoes"],
      ["Watches", "watches"],
    ],
  },
  {
    name: "Beauty & Personal Care",
    icon: Sparkles,
    items: [
      ["Skincare", "skincare"],
      ["Makeup", "makeup"],
      ["Hair care", "hair-care"],
      ["Fragrance", "fragrance"],
    ],
  },
  {
    name: "Toys & Games",
    icon: ToyBrick,
    items: [
      ["Building sets", "building-sets"],
      ["Board games", "board-games"],
      ["Outdoor play", "outdoor-play"],
      ["Stuffed animals", "stuffed-animals"],
    ],
  },
  {
    name: "Sports & Outdoors",
    icon: Bike,
    items: [
      ["Fitness", "fitness"],
      ["Camping", "camping"],
      ["Cycling", "cycling"],
      ["Water sports", "water-sports"],
    ],
  },
  {
    name: "Grocery & Gourmet Food",
    icon: Coffee,
    items: [
      ["Coffee & tea", "coffee-tea"],
      ["Snacks", "snacks"],
      ["Pantry staples", "pantry-staples"],
      ["Baking", "baking"],
    ],
  },
  {
    name: "Books & Media",
    icon: BookOpen,
    items: [
      ["Fiction", "fiction"],
      ["Nonfiction", "nonfiction"],
      ["Kids' books", "kids-books"],
      ["Music & movies", "music-movies"],
    ],
  },
  {
    name: "Baby & Kids",
    icon: Baby,
    items: [
      ["Baby clothing", "baby-clothing"],
      ["Nursery", "nursery"],
      ["Feeding", "feeding"],
      ["Strollers & travel", "strollers-travel"],
    ],
  },
  {
    name: "Pet Supplies",
    icon: PawPrint,
    items: [
      ["Dog supplies", "dog-supplies"],
      ["Cat supplies", "cat-supplies"],
      ["Beds & furniture", "pet-beds"],
      ["Toys & treats", "pet-toys-treats"],
    ],
  },
];

function imageUrl(fileName: string) {
  return `/categories/${fileName}.jpg`;
}

export default function CustomerHomePage() {
  return (
    <main className="min-h-screen bg-[#fafafa] px-3 pt-50 sm:pt-35 py-5 text-[#0f1111] sm:px-5 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-4">
          {categories.map((category) => (
            <section key={category.name} className="bg-white p-5 border rounded-2xl sm:p-6">
              <div className="mb-2 flex items-center gap-3">
                <h2 className="text-xl font-bold leading-7">{category.name}</h2>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                {category.items.map(([name, fileName]) => (
                  <Link
                    key={name}
                    href="/customer/products"
                    className="group min-w-0 text-sm text-[#0f1111] hover:text-[#c45500]"
                  >
                    <div className="relative aspect-[1.28/1] overflow-hidden bg-[#f4f4f4]">
                      <Image
                        src={imageUrl(fileName)}
                        alt={name}
                        fill
                        sizes="(max-width: 639px) 44vw, (max-width: 1279px) 22vw, 14vw"
                        className="object-cover rounded-lg transition-transform duration-200 group-hover:scale-[1.03]"
                      />
                    </div>
                    <span className="mt-2 block leading-5">{name}</span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
