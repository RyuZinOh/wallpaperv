import loaderGif from '/Assets/loader.gif';

interface ContributionProps {
  isOpen: boolean;
  onClose: () => void;
  contributionRef: React.RefObject<HTMLDivElement | null>;
}

export default function Contribution({
  isOpen,
  // onClose,
  contributionRef
}: ContributionProps) {
  return (
    /*
    Contributions of pictues rules and process
    */
    <div
      ref={contributionRef}
      className="fixed top-6 right-6 w-[90vw] max-w-[480px] p-6 rounded-lg transition-all duration-300 z-40"
      style={{
        backdropFilter: 'blur(20px)',
        background: 'rgba(20,20,20,0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        transform: isOpen ? 'translateX(0)' : 'translateX(calc(100% + 24px))',
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none'
      }}
    >
      {isOpen && (
        <div className="absolute -top-8 -right-5">
          <img src={loaderGif} alt="Loading" className="w-25" />
        </div>
      )}

      <div className="text-white">
        <h2 className="text-2xl font-bold mb-4">Contribute Wallpapers</h2>
        <div className="space-y-4 text-sm">
          <p>
            Want to add your own wallpapers to this collection? We'd love your
            contributions!
          </p>
          <div className="bg-black/40 p-3 rounded-lg border border-white/10">
            <h3 className="font-bold mb-2">Repository</h3>
            <a
              href="https://github.com/RyuZinOh/.dotfiles/tree/main/Pictures"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 hover:underline break-all text-xl"
            >
              github.com/RyuZinOh/.dotfiles/Pictures
            </a>
          </div>
          <div className="bg-black/40 p-3 rounded-lg border border-white/10">
            <h3 className="font-bold mb-2">Image Requirements</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <strong>Standard (16:9):</strong> 1920x1080 resolution
                <br />
                <span className="text-gray-400 ml-4">
                  Naming: normal convention (e.g., sunset.jpg, mountain.jpg)
                </span>
              </li>
              <li>
                <strong>Ultrawide (21:9):</strong> 2560x1080 resolution
                <br />
                <span className="text-gray-400 ml-4">
                  Naming: must include{' '}
                  <code className="bg-white/10 px-1 py-0.5 rounded">
                    maxxed_
                  </code>{' '}
                  keyword
                </span>
                <br />
                <span className="text-gray-400 ml-4">
                  Example: maxxed_sunset.jpg,city_maxxed_.jpeg, city_maxxed_.jpg
                </span>
              </li>
            </ul>
          </div>
          <div className="bg-black/40 p-3 rounded-lg border border-white/10">
            <h3 className="font-bold mb-2">How to Contribute</h3>
            <ol className="space-y-1 list-decimal list-inside text-xs">
              <li>Fork the repository</li>
              <li>Add your images to the Pictures folder</li>
              <li>Follow the naming convention above</li>
              <li>Submit a pull request</li>
            </ol>
          </div>
          <p className="text-gray-400 italic text-xs">
            Note: Mandatory image formata is <strong>jpg</strong>{' '}
            <strong>jpeg</strong> for the cause!
          </p>
        </div>
        {/* <button
          onClick={onClose}
          className="mt-4 w-full py-2 rounded-lg font-semibold transition-colors text-sm hover:cursor-pointer"
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
          onMouseEnter={e =>
            (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')
          }
          onMouseLeave={e =>
            (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')
          }
        >
          Close
        </button> */}
      </div>
    </div>
  );
}
