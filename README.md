# TranslateAI - Vietnamese-English Translation App

A translation app that converts text between Vietnamese and English using AI. It also includes a dictionary feature for word lookups.

## Features

- Text translation between Vietnamese and English
- Language detection and swapping
- Dictionary with detailed word information
- Dark/light mode support
- Copy to clipboard functionality
- Responsive design

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **API Integration**: Gemeni 2.0 Flash
- **Styling**: TailwindCSS with dark mode support
- **Design System**: Custom components
- **State Management**: React useState hooks

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- Gemeni API key

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/translate-ai.git
cd translate-ai
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with your OpenAI API key:

```
NEXT_PUBLIC_GEMINI_API_KEY=your-api-key-here
```

4. Run the development server

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

- **Translation**: Enter text in the input field, select the source and target languages, and click "Translate"
- **Dictionary**: Go to the Dictionary page, enter a word, and click "Search"
- **Language Swap**: Click the swap button to switch between languages
- **Theme Toggle**: Click the theme toggle button in the header to switch between light and dark modes

## Future Improvements

- Add more language pairs
- Implement user authentication
- Save translation history
- Add text-to-speech functionality
- Optimize API usage
- Implement Prisma with database for storing user preferences and history

## License

MIT
