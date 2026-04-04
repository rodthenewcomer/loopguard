import { cache } from 'react';

interface RepoData {
  stargazers_count?: number;
}

const fetchStars = cache(async (): Promise<number | null> => {
  try {
    const headers: Record<string, string> = {};
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
    const res = await fetch('https://api.github.com/repos/rodthenewcomer/loopguard', {
      next: { revalidate: 3600 },
      headers,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as RepoData;
    return data.stargazers_count ?? null;
  } catch {
    return null;
  }
});

export default async function GitHubStars() {
  const stars = await fetchStars();
  if (stars === null) return null;

  return (
    <a
      href="https://github.com/rodthenewcomer/loopguard"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-[#9FB0C4] transition hover:border-white/20 hover:text-white"
      aria-label={`${stars} GitHub stars — open repository`}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      {stars.toLocaleString()} stars on GitHub
    </a>
  );
}
