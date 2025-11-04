// Define the shape of the skills object
interface CandidateSkills {
  knowsHtmlCssJs: boolean;
  knowsReactNext: boolean;
  canBuildCrud: boolean;
  canBuildAuth: boolean;
  knowsBackendFrameworks: boolean;
  knowsGolang: boolean;
  knowsCloudInfra: boolean;
  knowsSystemDesign: boolean;
}

// Tier definitions for reference and display
export const TIER_DEFINITIONS: { [key: number]: { title: string; description: string } } = {
  0: { title: "Tier 0 - Beginner", description: "Knows HTML, CSS, and basic JavaScript. Has basic knowledge of Next.js or React but cannot build a CRUD app with a database." },
  1: { title: "Tier 1 - CRUD Developer", description: "Can build a CRUD application with a database using server actions or API routes, but cannot add advanced authentication." },
  2: { title: "Tier 2 - Full-Stack Next.js Developer", description: "Can build an authenticated (password + Google) CRUD App and deploy it, but lacks deep knowledge of other backend frameworks like Express/Hono." },
  3: { title: "Tier 3 - Multi-Framework Developer", description: "Knows Next.js/React and another backend framework (like Express/Hono/Laravel) to build authenticated CRUD APIs with documentation. Does not know Golang." },
  4: { title: "Tier 4 - Advanced Full-Stack Developer", description: "Proficient in Next.js, backend frameworks, and also knows Golang to build simple APIs." },
  5: { title: "Tier 5 - Architect/Lead Developer", description: "Proficient in all previous tiers and has experience with cloud infrastructure, containerization (Docker), and system design." },
};

/**
 * Calculates the skill tier of a candidate based on their self-declared skills.
 * The logic checks from the highest tier downwards.
 * @param skills - An object containing boolean flags for each skill.
 * @returns The calculated tier number (0-5).
 */
export function calculateTier(skills: CandidateSkills): number {
  if (skills.knowsGolang && (skills.knowsCloudInfra || skills.knowsSystemDesign)) {
    return 5;
  }
  if (skills.knowsGolang) {
    return 4;
  }
  if (skills.knowsBackendFrameworks) {
    return 3;
  }
  if (skills.canBuildAuth) {
    return 2;
  }
  if (skills.canBuildCrud) {
    return 1;
  }
  // The default is Tier 0, even if they only know HTML/CSS/JS.
  // The form ensures these are prerequisites for higher tiers.
  return 0;
}