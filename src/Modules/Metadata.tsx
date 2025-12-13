import { useEffect, useState } from 'react';

interface MetadataProps {
  isOpen: boolean;
  metadataRef: React.RefObject<HTMLDivElement | null>;
  selectedImage: {
    name: string;
    fullURL: string;
  } | null;
}

interface ImageMetadata {
  name: string;
  width: number;
  height: number;
  aspectRatio: string;
  resolution: string;
  fileSize: string;
  fileSizeBytes: number;
  type: string;
  megapixels: string;
  isUltrawide: boolean;
  orientation: string;
  pixelDensity: string;
  estimatedColors: string;
  bitDepth: string;
}

interface GitHubCommitInfo {
  author: string;
  avatarUrl: string;
  date: string;
  commitMessage: string;
  profileUrl: string;
}

export default function Metadata({
  isOpen,
  metadataRef,
  selectedImage
}: MetadataProps) {
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [gitHubInfo, setGitHubInfo] = useState<GitHubCommitInfo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedImage || !isOpen) return;

    const fetchMetadata = async () => {
      setLoading(true);
      try {
        // Fetch GitHub commit info
        const fetchGitHubInfo = async () => {
          try {
            const imagePath = `Pictures/${selectedImage.name}`;
            const commitsUrl = `https://api.github.com/repos/RyuZinOh/.dotfiles/commits?path=${imagePath}&page=1&per_page=1`;

            const response = await fetch(commitsUrl);
            if (response.ok) {
              const commits = await response.json();
              if (commits.length > 0) {
                const commit = commits[0];
                setGitHubInfo({
                  author: commit.commit.author.name,
                  avatarUrl: commit.author?.avatar_url || '',
                  date: new Date(commit.commit.author.date).toLocaleDateString(
                    'en-US',
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }
                  ),
                  commitMessage: commit.commit.message,
                  profileUrl: commit.author?.html_url || ''
                });
              }
            }
          } catch (error) {
            console.error('Failed to fetch GitHub info:', error);
          }
        };

        fetchGitHubInfo();

        const img = new Image();
        img.src = selectedImage.fullURL;

        img.onload = async () => {
          const gcd = (a: number, b: number): number =>
            b === 0 ? a : gcd(b, a % b);
          const divisor = gcd(img.width, img.height);
          const aspectW = img.width / divisor;
          const aspectH = img.height / divisor;

          const megapixels = ((img.width * img.height) / 1000000).toFixed(2);

          let orientation = 'Square';
          if (img.width > img.height) orientation = 'Landscape';
          else if (img.height > img.width) orientation = 'Portrait';

          const isUltrawide =
            aspectW / aspectH >= 2.0 ||
            selectedImage.name.toLowerCase().includes('maxxed');

          let resType = 'Custom Resolution';
          if (img.width === 1920 && img.height === 1080) resType = 'Full HD';
          else if (img.width === 2560 && img.height === 1080)
            resType = 'Ultrawide FHD';

          const diagonalPixels = Math.sqrt(img.width ** 2 + img.height ** 2);
          const ppi = Math.round(diagonalPixels / 27);

          let fileSize = 'Unknown';
          let fileSizeBytes = 0;
          try {
            const response = await fetch(selectedImage.fullURL);
            const blob = await response.blob();
            fileSizeBytes = blob.size;
            const sizeInKB = (blob.size / 1024).toFixed(2);
            const sizeInMB = (blob.size / (1024 * 1024)).toFixed(2);
            fileSize =
              parseFloat(sizeInMB) >= 1 ? `${sizeInMB} MB` : `${sizeInKB} KB`;
          } catch (e) {
            console.error('Failed to fetch file size', e);
          }

          const totalPixels = img.width * img.height;
          const estimatedColors =
            totalPixels > 1000000 ? '16.7M (24-bit)' : '16.7M (24-bit)';
          const bitDepth = '8-bit per channel';

          const fileType =
            selectedImage.name.split('.').pop()?.toUpperCase() || 'Unknown';

          setMetadata({
            name: selectedImage.name.replace(/\.[^/.]+$/, ''),
            width: img.width,
            height: img.height,
            aspectRatio: `${aspectW}:${aspectH}`,
            resolution: resType,
            fileSize,
            fileSizeBytes,
            type: fileType,
            megapixels,
            isUltrawide,
            orientation,
            pixelDensity: `~${ppi} PPI`,
            estimatedColors,
            bitDepth
          });
          setLoading(false);
        };

        img.onerror = () => {
          setLoading(false);
        };
      } catch (error) {
        console.error('Error fetching metadata:', error);
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [selectedImage, isOpen]);

  return (
    <div
      ref={metadataRef}
      className={`fixed top-6 left-6 w-[90vw] max-w-[800px] overflow-hidden z-40 backdrop-blur-2xl bg-black/90 border border-white/20 shadow-2xl transition-all duration-500 ease-out rounded-xl ${
        isOpen
          ? 'translate-x-0 scale-100 opacity-100'
          : '-translate-x-[calc(100%+24px)] scale-95 opacity-0 pointer-events-none'
      }`}
    >
      <div className="p-6 text-white">
        {loading ? (
          <div className="flex items-center justify-center py-8 animate-pulse">
            <div className="text-gray-400 text-sm">Loading metadata...</div>
          </div>
        ) : metadata ? (
          <div className="space-y-3 text-sm">
            {/* GitHub Contributor Info */}
            {gitHubInfo && (
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 hover:bg-white/10 transition-all duration-300">
                <h3 className="font-bold mb-3 text-white">Contributed By</h3>
                <div className="flex items-center gap-4">
                  {gitHubInfo.avatarUrl && (
                    <img
                      src={gitHubInfo.avatarUrl}
                      alt={gitHubInfo.author}
                      className="w-12 h-12 rounded-full border-2 border-white/30 hover:border-white/50 transition-all"
                    />
                  )}
                  <div className="flex-1">
                    <a
                      href={gitHubInfo.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-white hover:text-gray-300 transition-colors"
                    >
                      @{gitHubInfo.author}
                    </a>
                    <p className="text-gray-400 text-xs mt-1">
                      Added on {gitHubInfo.date}
                    </p>
                    {gitHubInfo.commitMessage && (
                      <p className="text-gray-300 text-xs mt-2 italic">
                        "{gitHubInfo.commitMessage}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 hover:bg-white/10 transition-all duration-300">
              <h3 className="font-bold mb-2 text-white">File Name</h3>
              <p className="break-all text-gray-300">{metadata.name}</p>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                <h3 className="font-bold mb-2 text-white">Dimensions</h3>
                <p className="text-gray-300">
                  {metadata.width} × {metadata.height}
                </p>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                <h3 className="font-bold mb-2 text-white">Aspect Ratio</h3>
                <p className="text-gray-300">{metadata.aspectRatio}</p>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                <h3 className="font-bold mb-2 text-white">Megapixels</h3>
                <p className="text-gray-300">{metadata.megapixels} MP</p>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                <h3 className="font-bold mb-2 text-white">Orientation</h3>
                <p className="text-gray-300">{metadata.orientation}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                <h3 className="font-bold mb-2 text-white">Resolution</h3>
                <p className="text-gray-300">{metadata.resolution}</p>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                <h3 className="font-bold mb-2 text-white">Display Type</h3>
                <p className="text-gray-300">
                  {metadata.isUltrawide ? 'Ultrawide' : 'Standard'}
                </p>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                <h3 className="font-bold mb-2 text-white">File Size</h3>
                <p className="text-gray-300">{metadata.fileSize}</p>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                <h3 className="font-bold mb-2 text-white">Format</h3>
                <p className="text-gray-300">{metadata.type}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                <h3 className="font-bold mb-2 text-white">Pixel Density</h3>
                <p className="text-gray-300">{metadata.pixelDensity}</p>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                <h3 className="font-bold mb-2 text-white">Color Depth</h3>
                <p className="text-gray-300">{metadata.estimatedColors}</p>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                <h3 className="font-bold mb-2 text-white">Bit Depth</h3>
                <p className="text-gray-300">{metadata.bitDepth}</p>
              </div>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 hover:bg-white/10 transition-all duration-300">
              <h3 className="font-bold mb-2 text-white">Technical Stats</h3>
              <div className="grid grid-cols-3 gap-3">
                <p className="text-gray-300">
                  Pixels: {(metadata.width * metadata.height).toLocaleString()}
                </p>
                <p className="text-gray-300">
                  Bytes/Pixel: ~
                  {(
                    metadata.fileSizeBytes /
                    (metadata.width * metadata.height)
                  ).toFixed(2)}
                </p>
                <p className="text-gray-300">
                  Compression: ~
                  {(
                    (metadata.width * metadata.height * 3) /
                    metadata.fileSizeBytes
                  ).toFixed(1)}
                  :1
                </p>
              </div>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 hover:bg-white/10 transition-all duration-300">
              <h3 className="font-bold mb-2 text-white">Recommended Usage</h3>
              <p className="text-gray-300">
                {metadata.isUltrawide
                  ? 'Perfect for ultrawide monitors (21:9). Ideal for immersive gaming and productivity.'
                  : 'Standard Full HD quality. Great for most displays and fast loading.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-gray-400 text-center py-8">
            No image selected
          </div>
        )}
      </div>
    </div>
  );
}
