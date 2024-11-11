# Car Image Processor

A web application for processing, categorizing, and deduplicating car images using AI vision models. Built with React, TypeScript, and Tailwind CSS.

## Features

- 🚗 Automatic image categorization using AI vision models
- 🔍 Perceptual hash-based duplicate detection
- 📁 Bulk processing of ZIP files
- 🏷️ Manual category adjustment
- 🔄 Duplicate review system
- ⬇️ Download processed images with category prefixes

## Local Installation

### Prerequisites

1. Node.js 18+ and npm
2. [Ollama](https://ollama.ai/) for local LLM processing (optional)

### Installation Steps

1. Clone the repository:

```bash
git clone [repository-url]
cd car-image-processor
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

### Setting up Ollama (Optional)

1. Install Ollama:

   - macOS: `brew install ollama`
   - Linux: `curl -fsSL https://ollama.ai/install.sh | sh`

2. Pull recommended vision models:

```bash
# For M1/M2 Macs (Apple Silicon)
ollama pull bakllava

# For Intel Macs or Linux
ollama pull llava
```

3. Start Ollama:

```bash
ollama serve
```

## Recommended Vision Models

### Local Models (via Ollama)

1. **Bakllava** (Recommended for M1/M2 Macs)

   - Optimized for Apple Silicon
   - Good balance of speed and accuracy
   - ~4GB model size

2. **LLaVA** (Recommended for Intel/AMD)
   - Excellent general vision capabilities
   - Good for detailed image analysis
   - ~4GB model size

### Cloud Models (via OpenAI)

1. **GPT-4o-mini**
   - High accuracy
   - Fast processing
   - Requires OpenAI API key

## Usage

1. Launch the application and configure settings:

   - Choose between Ollama (local) or OpenAI (cloud)
   - If using OpenAI, enter your API key
   - Adjust similarity threshold for duplicate detection (recommended: 70-90%)

2. Upload a ZIP file containing car images:

   - Supports JPG, PNG, WEBP formats
   - Maximum file size: 1GB
   - Automatically filters out macOS system files

3. Review and adjust results:

   - Check categorized images
   - Review detected duplicates
   - Manually adjust categories if needed
   - Remove unwanted images

4. Download processed images:
   - Images will be prefixed with category codes
   - Organized by category and subcategory
   - Duplicates excluded

## Categories

- **Exterior**: Front views, side views, rear views, details, defects
- **Inside**: Interior views, dashboard, seats, controls
- **Engine**: Full engine bay, engine details
- **Undercarriage**: Default views
- **Documents**: Invoices, car books, technical checks
- **Uncategorized**: Default category for unclassified images

## Performance Tips

1. For faster processing:

   - Use local Ollama models when possible
   - Reduce image resolution before uploading
   - Process batches of 100-200 images at a time

2. For better duplicate detection:
   - Start with 90% similarity threshold
   - Adjust down to 70% if needed
   - Review duplicates before final processing

## Troubleshooting

1. If Ollama is not connecting:

   - Ensure Ollama service is running (`ollama serve`)
   - Check if the selected model is downloaded
   - Restart Ollama service if needed

2. If duplicate detection is not working:

   - Lower the similarity threshold
   - Ensure images are not too small/low quality
   - Check the duplicate review panel

3. If categorization is inaccurate:
   - Try a different vision model
   - Ensure images are clear and well-lit
   - Use manual category adjustment

## Contributing

Contributions are welcome! Please feel free to submit pull requests.

## License

All rights belong to Adrien Fernandez
