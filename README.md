# Okara Chat with PDF

A privacy-focused "Chat with PDF" application built with Next.js, allowing users to interact with their PDF documents using AI. PDFs are processed entirely client-side to ensure privacy.

## Features

- **Privacy-First**: PDFs are processed entirely in your browser - no files are uploaded to any server
- **AI-Powered Chat**: Ask questions about your PDF and get intelligent responses
- **Modern UI**: Clean, minimalist design following Okara.ai's brand style
- **Real-time Streaming**: See AI responses as they're generated
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS with custom design system
- **PDF Processing**: pdfjs-dist (client-side)
- **AI Integration**: Vercel AI SDK with OpenAI
- **Animations**: Framer Motion
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ installed
- An OpenAI API key

### Installation

1. Clone the repository (or navigate to this directory)

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file based on the example:
   ```bash
   cp .env.local.example .env.local
   ```

4. Add your OpenAI API key to `.env.local`:
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   ```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## How It Works

1. **Upload**: User drops or selects a PDF file
2. **Client-Side Processing**: The PDF is parsed using pdfjs-dist entirely in the browser
3. **Text Extraction**: Text content is extracted and chunked into manageable pieces
4. **Question & Answer**: When a user asks a question:
   - Relevant chunks are identified using keyword matching
   - Only the text chunks (not the PDF file) are sent to the API
   - The AI generates a response based on the provided context
5. **Privacy**: The actual PDF file never leaves the user's device

## Project Structure

```
.
├── src/
│   ├── app/
│   │   ├── api/chat/
│   │   │   └── route.ts         # Chat API endpoint
│   │   ├── globals.css          # Global styles and design tokens
│   │   ├── layout.tsx           # Root layout with metadata
│   │   └── page.tsx             # Main app page
│   ├── components/
│   │   ├── ui/                  # Base UI components (Button, Input, Card)
│   │   ├── chat-interface.tsx   # Chat UI with message bubbles
│   │   └── file-upload.tsx      # PDF upload component
│   ├── hooks/
│   │   └── use-pdf.ts           # Hook for PDF processing
│   └── lib/
│       ├── pdf.ts               # PDF extraction and chunking utilities
│       └── utils.ts             # Utility functions
├── public/                      # Static assets
└── package.json
```

## Customization

### Changing the AI Model

Edit `src/app/api/chat/route.ts`:

```typescript
const result = streamText({
  model: openai("gpt-4o"), // Change this to any supported model
  // ...
});
```

### Adjusting Chunk Size

Edit `src/lib/pdf.ts`:

```typescript
export function chunkText(
  text: string, 
  chunkSize: number = 1000,  // Adjust this
  overlap: number = 200       // And this
)
```

### Styling

The design system is configured in `src/app/globals.css` using CSS variables. Modify the color values to match your brand.

## License

This project is part of Okara.ai.

## Support

For issues or questions, please refer to the Okara.ai documentation or contact support.
