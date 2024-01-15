# Bulkier

Bulk image optimization and responsive image creator in Node.js

## Quick start

Install dependencies

```bash
npm install
```

Copy the example config and configure it

```bash
cp .env.example .env
# update .env file according to your needs
```

After you have configured the project you can choose between these options

```bash
# Optimize images
npm run optimize

# Optimize videos
npm run tiktok

# Resize images
npm run resize

# Rename images
npm run rename
```

### Installing FFmpeg

FFmpeg is a powerful tool that allows you to manipulate and convert audio and video files.
To use it with this Node.js application, you need to install FFmpeg on your system.
Here are the installation instructions for Windows, Linux, and macOS:

```bash
# Ubuntu
sudo apt-get install ffmpeg

# Mac OS
brew install ffmpeg

# Windows with Chocolatey
choco install ffmpeg

# Verification step for every OS
ffmpeg -version
```

For Windows there is also the option of manual downloading the source files:

1. Download FFmpeg: Visit the FFmpeg official website and download the appropriate version for Windows.
2. Extract the Files: Extract the downloaded archive to a directory, for example, C:\ffmpeg.
3. Add FFmpeg to the System Path
