# Quick Start Guide

## Setup (First Time)

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   ```bash
   # Copy the example env file
   cp .env.local.example .env.local
   
   # Edit .env.local and add your OpenAI API key
   # OPENAI_API_KEY=sk-your-key-here
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   - Navigate to http://localhost:3000
   - You should see the Okara Chat landing page

## Using the App

### Step 1: Upload a PDF
- Drag and drop a PDF file onto the upload area, OR
- Click the upload area and select a file from your computer
- Wait for "Processing PDF..." to complete

### Step 2: Chat with Your Document
- Type your question in the input field at the bottom
- Examples:
  - "What is this document about?"
  - "Summarize the key points"
  - "What does section 3 say about X?"
- Press Enter or click the Send button
- Watch the AI response stream in real-time

### Step 3: Continue the Conversation
- Ask follow-up questions
- The AI maintains context throughout the conversation
- All responses are based on the uploaded document

## Tips for Best Results

### Writing Good Questions
✅ **Good**: "What are the main benefits mentioned in section 2?"
✅ **Good**: "Summarize the conclusion"
✅ **Good**: "What dates are mentioned in the document?"

❌ **Not Ideal**: "What do you think?" (too vague)
❌ **Not Ideal**: "Is this good?" (requires subjective judgment)

### Document Requirements
- PDF must contain selectable text (not just images)
- For best results, use well-formatted PDFs
- Scanned documents may not work unless they've been OCR'd

## Troubleshooting

### "Failed to process PDF"
- Ensure the file is a valid PDF
- Check if the PDF has selectable text
- Try a different PDF to isolate the issue

### "An error occurred" in chat
- Verify your OpenAI API key is set correctly in `.env.local`
- Check your OpenAI account has available credits
- Look at the terminal for detailed error messages

### Chat is slow or not responding
- Check your internet connection
- Verify the OpenAI API is accessible
- Large PDFs may take longer to process

### Build errors
```bash
# Clean and reinstall
rm -rf .next node_modules
npm install
npm run build
```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## File Size Limits

- **Recommended**: PDFs under 10MB
- **Maximum**: Depends on browser memory
- Larger files will take longer to process

## Privacy & Security

### What stays on your device:
- ✅ Your original PDF file
- ✅ Extracted text (stored in memory only)

### What gets sent to servers:
- ❌ NOT the PDF file itself
- ✅ Small text chunks relevant to your question
- ✅ Your questions and the AI's responses

### Notes:
- No files are stored on any server
- Processing happens entirely in your browser
- Only relevant text excerpts are sent to OpenAI for generating responses

## Keyboard Shortcuts

- `Enter` - Send message
- `Shift + Enter` - New line in input (if multi-line input is enabled)

## Browser Compatibility

Tested and working on:
- ✅ Chrome/Edge 100+
- ✅ Firefox 100+
- ✅ Safari 15+

## Need Help?

- Check the `README.md` for detailed documentation
- Review `IMPLEMENTATION.md` for technical details
- Examine the code comments for implementation specifics

---

**Happy Chatting! 🚀**
