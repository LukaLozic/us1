import HomePage from "../HomePage";
import type { Metadata } from "next";

// This function allows you to set dynamic meta tags based on the route params
export async function generateMetadata(
  { params }: { params: { gender: string } }
): Promise<Metadata> {
  const gender = params.gender?.toLowerCase() || "";
  let title = "Naked Models Live – Women, Men, Couples, and Trans on Cam";
  let description = "Watch the hottest live shows with naked girls, men, couples, and transgender models. Kneppe-me.dk – everything in one place!";

  if (gender === "nogne-damer") {
    title = "Naked Women Live – Watch Hot Girls on Kneppe-me.dk";
    description = "Watch mature and young naked women live – no signup required. Exclusive erotic content with Danish girls only on Kneppe-me.dk!";
  } else if (gender === "nogne-mænd") {
    title = "Naked Men Live – Watch Horny Guys on Kneppe-me.dk";
    description = "Watch young and mature men show everything live – no signup required. Exclusive erotic content with Danish guys only on Kneppe-me.dk!";
  } else if (gender === "par") {
    title = "Couples Fucking Live on Cam – Watch on Kneppe-me.dk";
    description = "Hundreds of couples having sex live for you – no signup required. Exclusive live content with Danish couples only on Kneppe-me.dk!";
  } else if (gender === "trans") {
    title = "Transsexuals Live – Watch Shemales on Kneppe-me.dk";
    description = "Watch beautiful transgender models and shemales show everything live – no signup required. Exclusive trans content only on Kneppe-me.dk!";
  }

  return { title, description };
}

// This is a Server Component (default in app router)
export default function GenderPage({ params }: { params: { gender: string } }) {
  return <HomePage />;
}