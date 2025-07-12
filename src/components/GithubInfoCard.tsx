import React from "react";

// Моковые данные для демонстрации
const mockGithubData = {
  username: "mockuser",
  avatar_url: "https://avatars.githubusercontent.com/u/00000000?v=4",
  repos: [
    {
      name: "mock-repo-1",
      url: "https://github.com/mockuser/mock-repo-1",
      description: "Первый тестовый репозиторий",
      stars: 42,
      forks: 10,
      language: "TypeScript",
    },
    {
      name: "mock-repo-2",
      url: "https://github.com/mockuser/mock-repo-2",
      description: "Второй тестовый репозиторий",
      stars: 17,
      forks: 3,
      language: "JavaScript",
    },
  ],
};

const GithubInfoCard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-xl neumorph">
      <div className="flex items-center mb-4">
        <img
          src={mockGithubData.avatar_url}
          alt="avatar"
          className="w-16 h-16 rounded-full mr-4 border"
        />
        <div>
          <div className="text-xl font-bold">{mockGithubData.username}</div>
          <div className="text-gray-500">GitHub User</div>
        </div>
      </div>
      <div>
        <div className="text-lg font-semibold mb-2">Репозитории:</div>
        <ul>
          {mockGithubData.repos.map((repo) => (
            <li key={repo.name} className="mb-3 border-b pb-2 last:border-b-0">
              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-semibold"
              >
                {repo.name}
              </a>
              <div className="text-gray-700 text-sm">{repo.description}</div>
              <div className="flex gap-4 text-xs text-gray-500 mt-1">
                <span>⭐ {repo.stars}</span>
                <span>🍴 {repo.forks}</span>
                <span>💻 {repo.language}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GithubInfoCard;
