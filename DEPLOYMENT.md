# Deployment Checklist

## Pre-Deployment

- [ ] All dependencies installed (`npm install`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] Environment variables configured
- [ ] Tested with sample PDF files
- [ ] Responsive design verified on mobile/desktop
- [ ] Error handling tested

## Environment Variables

Required for production:

```env
OPENAI_API_KEY=sk-...
```

### Platform-Specific Setup

#### Vercel
1. Connect your GitHub repository
2. Add `OPENAI_API_KEY` in Project Settings → Environment Variables
3. Deploy

#### Netlify
1. Connect your repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variable `OPENAI_API_KEY`

#### Docker (Self-hosted)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t okara-chat .
docker run -p 3000:3000 -e OPENAI_API_KEY=your_key okara-chat
```

## Post-Deployment

- [ ] Test PDF upload functionality
- [ ] Verify chat responses are working
- [ ] Check error handling (try invalid PDF)
- [ ] Monitor API usage and costs
- [ ] Test on different devices/browsers
- [ ] Verify privacy (no file uploads in network tab)

## Monitoring

### Things to Monitor
- OpenAI API usage and costs
- PDF processing failures
- Chat response times
- Error rates

### Recommended Tools
- Vercel Analytics (if using Vercel)
- OpenAI Dashboard for API usage
- Custom logging with tools like Sentry

## Performance Optimization

### Current Optimizations
✅ Client-side PDF processing
✅ Streaming responses
✅ Code splitting (Next.js automatic)
✅ Dynamic imports for pdfjs-dist

### Future Optimizations
- [ ] Implement caching for frequently asked questions
- [ ] Add service worker for offline support
- [ ] Optimize chunk size based on model context limits
- [ ] Add request deduplication

## Security Considerations

### Implemented
✅ No file uploads to server
✅ API key stored in environment variables
✅ Client-side only file processing

### Additional Recommendations
- [ ] Add rate limiting to API routes
- [ ] Implement user authentication if needed
- [ ] Add CORS restrictions if applicable
- [ ] Monitor for abuse/excessive API usage

## Scaling Considerations

### Current Architecture
- Serverless functions handle API requests
- Client-side processing scales with users
- No database required

### If Scaling Needed
- [ ] Add Redis for response caching
- [ ] Implement request queuing
- [ ] Add CDN for static assets
- [ ] Consider edge functions for lower latency

## Cost Estimation

### OpenAI API Costs (GPT-4o)
- Input: $2.50 per 1M tokens
- Output: $10.00 per 1M tokens

### Example Usage
- Average PDF: ~3000 tokens
- Average query context: ~1000 tokens
- Average response: ~200 tokens
- **Cost per question: ~$0.003-0.005**

### Monthly Estimates
- 1,000 questions/month: ~$5
- 10,000 questions/month: ~$50
- 100,000 questions/month: ~$500

## Backup & Recovery

### What to Backup
- Source code (already in Git)
- Environment variables (document separately)
- Configuration files

### Recovery Steps
1. Clone repository
2. Install dependencies
3. Configure environment variables
4. Deploy

## Support & Maintenance

### Regular Tasks
- [ ] Update dependencies monthly
- [ ] Monitor OpenAI API changes
- [ ] Review error logs weekly
- [ ] Check for security updates

### Emergency Contacts
- OpenAI Support: support@openai.com
- Hosting provider support
- Development team contacts

---

## Quick Deploy Commands

### Vercel
```bash
npm install -g vercel
vercel
```

### Manual Deploy
```bash
npm run build
npm start
```

---

**Ready to Deploy!** ✅
